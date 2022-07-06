import axios from 'axios';
import * as LocalStorage from '../constants/localStorage'
import * as Utils from '../constants/utils'
import Header from './../component/common/header';

const apiBasePrefix = "https://ci_api3.carenation.kr"
// const apiBasePrefix = "https://ci_api.carenation.kr"
const apiPrefix = "/v3_0"
const apiCarePrefix = "/v3_0/protector";
// const apiCarePrefix = "/v2/protector";
const apiCommonPrefix = process.env.REACT_APP_COMMON_API_URL;
const apiCaregiverPrefix = `${apiBasePrefix}/v2/caregiver`;

const SERVER_TYPE = "CI";
const MAIN_API = "/main";
const LOWEST_PRICE_API = "/job/main";
const LOGIN_API = "/login";
const PREFER_HOSPITAL_NEW_API = "/hospital-new";   
const GET_RSA_PUBLIC_KEY_API = "v2/common/user/key";
const PATIENTS = "/patients";   
let auth = LocalStorage.getStorage(LocalStorage.AUTHORIZATION) || "";



const apiAxios = axios.create({
   timeout: 30000,
   headers: {
       'Content-Type': 'application/json',
       'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
       'UserType': 'protector',
       'AppVersion': '1.0.0',
       'Authorization': auth
   }
})


function baseApi(apiUrl: string = "") {
    let test = apiAxios.defaults.baseURL = apiBasePrefix + apiUrl;
    return test;
}


// api 데이터 상태 체크
function successStatusCheck(response: any, resolve: any) {
    let hkey: string = response.headers['hkey'];
    let htime: string = response.headers['htime'];
    let data: string = JSON.stringify(response.data);

    if (hkey !== "qodkvmn1k431k3m4n1k08alk2mn59kaskfld8734kj324kjb2mnb324mnb2341a") {
        const sha256 = require('sha256');
        let result = sha256(htime + data);

        if (result !== hkey && !response.config.baseURL.includes("datalab")) {
            response.data = {
                code: 600,
                message: "데이터 위변조가 이루어졌습니다.<br/>다시 시도해주세요."
            };
        }
    }
    if (response.status === 200) {
        resolve(response);
    } else if (response.status === 401) {
        console.log(response.status)
    } else {
        resolve('error');
    }
}

function failStatusCheck(err: any, reject: any) {
    if (err.response && err.response.status === 401) {
        moveMain()
    } else {
        reject(err)
    }
}

function moveMain() {
    LocalStorage.clear();
    Utils.pageFinish("logout", "");
}


// 메인페이지 api
export function mainList () {
    return new Promise ((resolve, reject) => {
    //    const AUTH = apiAxios.defaults.headers.common['Authorization'] = auth ? `${auth}` : "" ; 
            axios({
                method: "get",
                url: baseApi(apiCarePrefix) + MAIN_API,
                headers: {"Authorization": auth}
            })    
            .then((response) => {
                successStatusCheck(response,resolve)
            }).catch((err) => {
                console.log(err, reject)
            })    
    })        
}

// export function mainList () {
//     return new Promise ((resolve, reject) => {
//         axios.get(baseApi(apiCarePrefix) + MAIN_API, { headers : getAccessTokenHeader() } )
//             .then((response) => {
//                 successStatusCheck(response,resolve)
//             }).catch((err) => {
//                 console.log(err, reject)
//             })    
//     })
// }


/**
 * 메인 최저가 현황
 * -----------------------------------------------------------------------------------------------------------------
 */
export function lowestPriceList () {
    return new Promise ((resolve, reject) => {
            axios({
                method: "get",
                url: baseApi(apiPrefix) + "/protector"  + LOWEST_PRICE_API,
                headers: {"Authorization": auth}
            })    
            .then((response) => {
                successStatusCheck(response,resolve)
            }).catch((err) => {
                console.log(err, reject)
            })    
    })        
}

/**
 * 로그인
 * -----------------------------------------------------------------------------------------------------------------
 */

export function login(data: any, userId: string) {
    return new Promise ((resolve, reject) => {
            axios({
            method: "post",
            url: baseApi(apiCarePrefix) + LOGIN_API + '/' + userId ,
            data:{
                ...data
                // email: data.email,
                // password: data.password
            },
            headers: {
                'UserAgent':  "CI",
                'UserType': 'protector',
            }

        })
        .then((response) => {
            successStatusCheck(response,resolve)
        }).catch((err) => {
            console.log(err, reject)
        })    
    })
}


/**
 * 로그인
 * -----------------------------------------------------------------------------------------------------------------
 */
// export function login (data: any, userId: string) {
//     return new Promise ((resolve, reject) => {
//             return  axios.post(baseApi(apiCarePrefix) + LOGIN_API + '/' + userId , data)
//             .then((response) => {
//                 successStatusCheck(response,resolve)
//                 console.log("success")
//             }).catch((err) => {
//                 console.log(err, reject)
//             })    
//     })         
// }


/**
 * 병원 리스트 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 */
 export function hospitalListNew(page: number, search?: string) {
    let url: any[] = [];
    url.push(PREFER_HOSPITAL_NEW_API);
    url.push(page);
    if (search) {
        url.push(encodeURIComponent(search));
    }
    return new Promise((resolve, reject) => {
               apiAxios.get(baseApi(apiCarePrefix) + url.join("/"))
                .then((response) => {
                    successStatusCheck(response, resolve)
                }).catch(err => {
                    failStatusCheck(err, reject)
                });
        }
    )
}

/**
 * 도로명 주소 리스트 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 */
export function addressList(confmKey: string = "", keyword: string, page: number, limit: number) {
    return new Promise((resolve, reject) => {
            return axios.create({
                timeout: 5000
            }).get('https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=' + confmKey + '&currentPage=' + page + '&countPerPage=' + limit + '&keyword=' + keyword + '&resultType=json')
                .then((response) => {
                    resolve(response);
                }).catch(err => {
                    reject(err)
                });
        }
    )
}

/**
 * RSA Public key 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 */
//  export function getRSAPublicKey() {
//     return new Promise((resolve, reject) => {
//             // return baseApi(GET_RSA_PUBLIC_KEY_API).get("", getAccessTokenHeader())
//             return axios.get(baseApi(GET_RSA_PUBLIC_KEY_API),{ headers : getAccessTokenHeader() })
//                 .then((response) => {
//                     successStatusCheck(response, resolve)
//                 }).catch(err => {
//                     failStatusCheck(err, reject)
//                 });
//         }
//     )
// }


export function getRSAPublicKey() {
    return new Promise((resolve, reject) => {
        apiAxios({
            method: "get",
            url: baseApi() + '/' + GET_RSA_PUBLIC_KEY_API ,
            headers: {"Authorization": auth}
        })
        .then((response) => {
            successStatusCheck(response,resolve)
        }).catch((err) => {
            console.log(err, reject)
        })    
    })
}


/**
 * 가족 정보 상세 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 */
//  export function patientDetail(familyId: number) {
//     return new Promise((resolve, reject) => {
//             return baseApi(apiCarePrefix).get(Constants.PATIENTS + `/${familyId}`, getAccessTokenHeader())
//                 .then((response) => {
//                     successStatusCheck(response, resolve)
//                 }).catch(err => {
//                     failStatusCheck(err, reject)
//                 });
//         }
//     )
// }

export function patientDetail(familyId: number) {
    return new Promise((resolve, reject) => {
        axios({
            method:"get",
            url: baseApi(apiCarePrefix) + PATIENTS + familyId,
            headers: {"Authorization": auth}
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}



export default {mainList,lowestPriceList,login,addressList,hospitalListNew,getRSAPublicKey,patientDetail } 