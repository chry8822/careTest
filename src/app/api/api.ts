import axios from 'axios';
import * as LocalStorage from '../constants/localStorage'
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

const apiAxios = axios.create({
   timeout: 30000,
   headers: {
       'Content-Type': 'application/json',
       'UserAgent': SERVER_TYPE ? SERVER_TYPE : "",
       'UserType': 'protector',
       'AppVersion': '1.0.0'
   }
})

function baseApi(apiUrl: string = "") {
    const test = apiAxios.defaults.baseURL = apiBasePrefix + apiUrl;
   return test
}


// 기본 api 요청 url
// function baseApi(apiUrl: string = "") {
//    const test = apiAxios.defaults.baseURL = apiBasePrefix + apiUrl;
//     return test;
// }


// api 헤더
function getAccessTokenHeader() {
    let auth = LocalStorage.getStorage(LocalStorage.AUTHORIZATION);
    if(auth) {
        return {
                'Authorization': auth
        }
    } else {
        return
    }
    
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



// 메인페이지 api
// export function mainList () {
//     return new Promise ((resolve, reject) => {
//             axios({
//                 method: "get",
//                 url: baseApi(apiCarePrefix) + MAIN_API,
//                 headers : getAccessTokenHeader()
//             })    
//             .then((response) => {
//                 successStatusCheck(response,resolve)
//             }).catch((err) => {
//                 console.log(err, reject)
//             })    
//     })        
// }

export function mainList () {
    return new Promise ((resolve, reject) => {
        axios.get(baseApi(apiCarePrefix) + MAIN_API, { headers : getAccessTokenHeader() } )
            .then((response) => {
                successStatusCheck(response,resolve)
            }).catch((err) => {
                console.log(err, reject)
            })    
    })
}


// 메인페이지 최저가 현황 api
export function lowestPriceList () {
    return new Promise ((resolve, reject) => {
            axios({
                method: "get",
                url: baseApi(apiPrefix) + "/protector"  + LOWEST_PRICE_API,
                headers : getAccessTokenHeader()
            })    
            .then((response) => {
                successStatusCheck(response,resolve)
            }).catch((err) => {
                console.log(err, reject)
            })    
    })        
}

// 로그인 api
export function login (data: any, userId: string) {
    return new Promise ((resolve, reject) => {
             axios.post(baseApi(apiCarePrefix) + LOGIN_API + '/' + userId , data)
            .then((response) => {
                successStatusCheck(response,resolve)
                console.log("success")
            }).catch((err) => {
                console.log(err, reject)
            })    
    })         
}





export default {mainList,lowestPriceList,login } 