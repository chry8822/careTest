import axios from 'axios';
import * as LocalStorage from '../constants/localStorage'

const apiBasePrefix = "https://ci_api3.carenation.kr"
const apiPrefix = "/v3_0"
const apiCarePrefix = "/v3_0/protector";
const apiCommonPrefix = process.env.REACT_APP_COMMON_API_URL;
const apiCaregiverPrefix = `${apiBasePrefix}/v2/caregiver`;
const MAIN_API = "/main";
const LOWEST_PRICE_API = "/job/main";


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










export default {mainList,lowestPriceList } 