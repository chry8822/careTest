import axios, { AxiosRequestHeaders } from 'axios';
import * as LocalStorage from '../constants/localStorage'
import * as Utils from '../constants/utils'
import Header from './../component/common/header';
import React,{useCallback,useMemo} from 'react';

const apiBasePrefix = "https://ci_api3.carenation.kr"
const apiPrefix = "/v3_0"
const apiCarePrefix = "/v3_0/protector";
const apiCommonPrefix = process.env.REACT_APP_COMMON_API_URL;

const ENCRYPTION_TYPE = process.env.REACT_APP_ENCRYPTION_TYPE;
const SERVER_TYPE = "CI";
const MAIN_API = "/main";
const LOWEST_PRICE_API = "/job/main";
const LOGIN_API = "/login";
const PREFER_HOSPITAL_NEW_API = "/hospital-new";   
const GET_RSA_PUBLIC_KEY_API = "v2/common/user/key";
const PATIENTS = "/patients";   
const SIGN_UP_BAD_WORDS_API = "/badwords";  
const BAD_WORDS_API = "/bad_words"
const USER_INFO_API = "/my-page"; 
const JOB_GRAPH = "/job/graph";       
const JOB_API = "/job"; 
const JOB_CANCEL_API = "/job/cancel";    


// string || null 타입
// const getAuthHeader = () => {
//     if(Utils.isEmpty(LocalStorage.AUTHORIZATION)){
//         return "";
//     }else{
//         return LocalStorage.getStorage(LocalStorage.AUTHORIZATION)
//     }
// }


const getMD5Header = (type?: string): AxiosRequestHeaders => {
    if (type === 'TRUE'){
        return {
            'Content-Type': 'text/plain',
            'User-Content-Type': Utils.md5(),
            'Authorization':getAuth(),
        } 
    }else {
        return {
            'UserType': 'protector',
            'AppVersion': '1.0.0',
            'Content-Type': 'application/json',
            'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
            'Authorization':getAuth()
        }
    }
}


// string
const getAuth = () => {
    return LocalStorage.getStorage(LocalStorage.AUTHORIZATION) || ""
}

export const apiAxios = axios.create({
   timeout: 30000,
   headers: {
       'Content-Type': 'application/json',
       'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
       'UserType': 'protector',
       'AppVersion': '1.0.0',
       'Authorization': getAuth()
   }
})


function baseApi(apiUrl: string = "") {
    let test = apiAxios.defaults.baseURL = apiBasePrefix + apiUrl;
    return test;
}


function successStatusCheck(response: any, resolve: any) {
    if (response.status === 200) {
        resolve(response);
    } else if (response.status === 401) {
        moveMain();
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
                headers: {
                    "Authorization": getAuth(), 
                    'Content-Type': 'application/json',
                    'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
                    'UserType': 'protector',
                    'AppVersion': '1.0.0',
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
 * 메인 최저가 현황
 * -----------------------------------------------------------------------------------------------------------------
 */

export function lowestPriceList () {
    return new Promise ((resolve, reject) => {
            axios({
                method: "get",
                url: "https://ci_api3.carenation.kr/v3_0/protector"  + LOWEST_PRICE_API,
                headers: {
                    'Content-Type': 'application/json',
                    'UserAgent': "CI",
                    'UserType': 'protector',
                    'AppVersion': '1.0.0',
                    'Authorization': getAuth()
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

export function login(data: any, userId: string) {
    return new Promise ((resolve, reject) => {
            apiAxios({
            method: "post",
            url: baseApi(apiCarePrefix) + LOGIN_API + '/' + userId ,
            data:{
                ...data
            },
        })
        .then((response) => {
            successStatusCheck(response,resolve)
        }).catch((err) => {
            console.log(err, reject)
        })    
    })
}



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


export function getRSAPublicKey() {
    return new Promise((resolve, reject) => {
        apiAxios({
            method: "get",
            url: baseApi() + '/' + GET_RSA_PUBLIC_KEY_API ,
            headers: {
                'Authorization': getAuth(),
                'Content-Type': 'application/json',
                'UserAgent': "CI",
                'UserType': 'protector',
                'AppVersion': '1.0.0',
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
 * 가족 리스트 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 */

export function patientList () {
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url: baseApi(apiCarePrefix) + PATIENTS,
            headers : {
                'UserType': 'protector',
                'Content-Type': 'application/json',
                'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
                'Authorization': getAuth()
            }
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}



/**
 * 가족 정보 상세 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 */

export function patientDetail(familyId: number) {
    return new Promise((resolve, reject) => {
        axios({
            method:"get",
            url: baseApi(apiCarePrefix) + PATIENTS + familyId,
            headers: {"Authorization": getAuth()}
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}

/**
 * 금칙어 체크하기(UserId가 존재하지 않는다면 carenation으로 AES 암호화를 진행하고, UserId가 존재한다면 UserId로 AES 암호화를 진행한다.)
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param data : Post Data Value
 */
 export function badwordsCheck(data: any) {
    let auth = LocalStorage.getStorage(LocalStorage.AUTHORIZATION) || "";
    let userId = LocalStorage.getStorage(LocalStorage.USER_ID);
    let queryString = Utils.isEmpty(userId) ? `/${Buffer.from("carenation").toString('base64')}` : "";
    let api = Utils.isEmpty(userId) ? SIGN_UP_BAD_WORDS_API : BAD_WORDS_API;

    return new Promise((resolve, reject) => {
            // apiAxios.post(baseApi(apiCommonPrefix) + api + queryString, data, )
            return axios({
                method: "post",
                url: baseApi(apiCommonPrefix) + api + queryString,
                data: {
                    ...data
                },
                headers: getMD5Header(ENCRYPTION_TYPE)
            })
            .then((response) => {
                successStatusCheck(response, resolve)
            }).catch(err => {
                failStatusCheck(err, reject)
            });
        } 
    )
}

/**
 * 유저 정보
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param data : Post Data Value
 */

export function userInfo(){
    return new Promise((resolve, reject)=> {
        axios({
            method:"get",
            url: "https://ci_api3.carenation.kr/v3_0" + USER_INFO_API,
            headers: {
                'Authorization': getAuth(),
                'UserType': 'protector',
                'AppVersion': '1.0.0',
                'Content-Type': 'application/json',
                'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
            }
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        })
    })
}



/**
 * 공고 상세 정보 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param jobId : 공고 Id
 */

export function careDetail(jobId: number) {
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url: baseApi(apiCarePrefix) + "/job"+ '/' +  jobId,
            headers: {
                'Authorization': getAuth(),
                'UserType': 'protector',
                'AppVersion': '1.0.0',
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        })
    })
}


/**
 * 공고 상세 예상 간병비용 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param params : Object Params
 */

export function jobGraph(params:any) {
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url: baseApi(apiCarePrefix) + JOB_GRAPH,
            headers: {
                'Authorization': getAuth(),
                'UserType': 'protector',
                'AppVersion': '1.0.0',
                'Content-Type': 'application/json',
                'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
            },
            params: {
                ...params
            }
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}


/**
 * 가족 정보 등록
 * -----------------------------------------------------------------------------------------------------------------
 */

            

export function patientRegister(data: any) {
    return new Promise((resolve, reject) => {
        axios({
            method:"post",
            url: baseApi(apiCarePrefix) + PATIENTS,
            data:{
                ...data
            },
            headers: getMD5Header(ENCRYPTION_TYPE)
            }) .then((response) => {
                successStatusCheck(response, resolve)
            }).catch(err => {
                failStatusCheck(err, reject)
            });
        }
    )
}

/**
 * 공고 등록
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param data : Object Data
 */

export function jobRegister(data: any) {
    return new Promise((resolve, reject)=> {
        axios({
            method:"post",
            url: baseApi(apiCarePrefix) + JOB_API,
            data:{
                ...data
            },
            headers: getMD5Header(ENCRYPTION_TYPE)
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}

/**
 * 공고 수정
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param jobId : 공고 Id
 * @param data : Object Data
 */


export function jobEdit(jobId: number, data: any) {
    return new Promise((resolve,reject) => {
        axios({
            method:"post",
            url: baseApi(apiCarePrefix) + JOB_API + '/' + jobId,
            data: {
                ...data
            },
            headers: getMD5Header(ENCRYPTION_TYPE)
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}
/**
 * 가족 정보 수정
 * -----------------------------------------------------------------------------------------------------------------
 */

export function patientEdit(patientId: number, data: any) {
    console.log("공고 등록")
    return new Promise((resolve, reject)=> {
        axios({
            method:"post",
            url:baseApi(apiCarePrefix) + PATIENTS + `/${patientId}`,
            data: {
                ...data
            },
            headers: getMD5Header(ENCRYPTION_TYPE)
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}



/**
 * 간병 내역 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param params : Object params
 */

export function jobList(params: any) {
    return new Promise((resolve, reject) => {
        axios({
            method:"get",
            url: baseApi(apiCarePrefix) + JOB_API,
            params:{
                ...params
            },
            headers: {
                'UserType': 'protector',
                'AppVersion': '1.0.0',
                'Content-Type': 'application/json',
                'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
                'Authorization': getAuth()
            }
        })  .then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}


/**
 * 공고 취소
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param jobId : 공고 Id
 * @param deletedType : 취소 사유
 */
export function jobDelete(jobId:number, deletedType?: number) {
    return new Promise((resolve, reject) => {
        axios({
            method:"delete",
            url:baseApi(apiCarePrefix) + JOB_API + `/${jobId}${Utils.isEmpty(deletedType) ? '' : '/' + deletedType}`,
            headers:{
                'Content-Type': 'application/json',
                'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
                'UserType': 'protector',
                'AppVersion': '1.0.0',
                'Authorization': getAuth()
            }
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}


/**
 * 공고 취소 요청
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param jobId : 공고 Id
 * @param deletedType : 취소 사유
 */

export function jobCancel(jobId:number, deletedType?: number) {
    return new Promise((resolve, reject) => {
        axios({
            method:"delete",
            url:baseApi(apiCarePrefix) + JOB_CANCEL_API + `/${jobId}/${deletedType}`,
            headers:{
                'Content-Type': 'application/json',
                'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
                'UserType': 'protector',
                'AppVersion': '1.0.0',
                'Authorization': getAuth()
            }
        }).then((response) => {
            successStatusCheck(response, resolve)
        }).catch(err => {
            failStatusCheck(err, reject)
        });
    })
}


export default {
    lowestPriceList,
    mainList,
    login,
    addressList,
    hospitalListNew,
    getRSAPublicKey,
    patientDetail,
    badwordsCheck,
    userInfo,
    careDetail,
    jobGraph,
    patientList,
    patientRegister,
    jobRegister,
    jobEdit,
    patientEdit,
    jobList,
    jobDelete,
    jobCancel
 } 

