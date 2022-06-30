// export function mainList() {
//     return new Promise((resolve, reject) => {
//             return baseApi(apiCarePrefix).get(Constants.MAIN_API, getAccessTokenHeader())
//                 .then((response) => {
//                     successStatusCheck(response, resolve)
//                 }).catch(err => {
//                     failStatusCheck(err, reject)
//                 });
//         }
//     )
// }

import axios from 'axios';

function getAccessTokenHeader() {
    let auth = localStorage.getItem(localStorage.TOKEN_TYPE) + ` ` + localStorage.getItem(localStorage.ACCESS_TOKEN);
    return {'Authorization': auth}
}
// https://ci_api3.carenation.kr
// const apiBasePrefix = process.env.REACT_APP_BASE_URL;
const apiBasePrefix = "https://ci_api3.carenation.kr"
const apiPrefix = process.env.REACT_APP_API_URL;
const apiCarePrefix = "/v3_0/protector";
const apiCommonPrefix = process.env.REACT_APP_COMMON_API_URL;
const apiCaregiverPrefix = `${apiBasePrefix}/v2/caregiver`;

console.log("url", apiBasePrefix)

const MAIN_API = "/main";

const baseApi = (apiUrl:string = "") => {
    const axiosBase =  axios.defaults.baseURL = apiBasePrefix + apiUrl
    return axiosBase;
} 


export function mainList () {
return new Promise ((resolve, reject) => {
        axios({
            method: "get",
            url: baseApi(apiCarePrefix) + MAIN_API,
            headers : getAccessTokenHeader() 
        })
        .then((response) => {
            successStatusCheck(response,resolve)
        }).catch((err) => {
            console.log(err, reject)
        })
})
}



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


export default {mainList} 