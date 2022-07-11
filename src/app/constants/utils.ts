import * as LocalStorage from './localStorage'
import Api from '../api/api'
import moment from 'moment';

const IMG_PATH = process.env.REACT_APP_IMG_URL;
const ENCRYPTION_TYPE = process.env.REACT_APP_ENCRYPTION_TYPE;


const crypto = require('crypto');
const pkcs7 = require("pkcs7");
const chainingMode = "AES-256-CBC";


/**
 * MD5 암호화
 * ---------------------------------------------------------------------------------------------------------------------
 */
 export function md5() {
    let md5 = require('md5');

    return md5('aes');
}

/**
 * Empty Check
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : Object Value
 */
 export function isEmpty(value: any) {
    return typeof value === "undefined" || value === null || value === "";
}


/**
 * 콤마찍기
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param number : Value
 */
 export function numberWithCommas(number: number) {
    if (isEmpty(number) || isNaN(number)) {
        return 0;
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/**
 * Auth(로그인) 값이 존재하는지 확인
 * ---------------------------------------------------------------------------------------------------------------------
 */
 export function isAuthCheck() {
    return isEmpty(LocalStorage.getStorage(LocalStorage.AUTHORIZATION))
}

/**
 * 이미지 에러 Src
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param e : event
 */
 export function imgSrcError(e: any) {
    let path: string = e.target.getAttribute('src');

    if (path.includes("/care/") || (IMG_PATH && path.includes(IMG_PATH))) {
        e.target.onerror = null;
    } else {
        e.target.src = "/care" + path;
    }
}


/**
 * Number Regex
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : Value
 */
 export function isNumber(value: string) {
    let regExp = /^[0-9]*$/;
    return regExp.test(value)
}



/**
 * Email Pattern Regex
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : Value
 */
 export function emailCheck(value: string) {
    let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return regExp.test(value);
}


/**
 * 기존 Password Pattern 체크
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : Value
 */
 export function existingPasswordCheck(value: string) {
    let flag = passwordCheck(value);

    if (!flag) {
        let regExp = /^[a-zA-Z](?=.{0,28}[0-9])[0-9a-zA-Z]{5,20}$/; //## 영문으로 시작하며, 영문소문자와 숫자로 이루어져 있고, 6~20자리
        flag = regExp.test(value);
    }
    return flag;
}

/**
 * Password Pattern Regex
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : 입력한 값
 * @param phone : 핸드폰번호
 */
 export function passwordCheck(value: string, phone: string = "") {
    if (isEmpty(value)) {
        return true;
    }

    let flag;

    let regExp01 = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!?@#$%^&*():;\+\-=~{}<>\_\[\]\|\,\.\/\`]).{8,}$/; //## 8자리 이상, 영문 포함, 숫자 포함, 특수문자 포함 정규식
    flag = regExp01.test(value);

    if (!flag) {
        let regExp02 = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{10,}$/; //## 10자리 이상, 영문 포함, 숫자 포함 정규식
        flag = regExp02.test(value);
    }

    if (!flag) {
        let regExp03 = /^(?=.*?[a-zA-Z])(?=.*?[!?@#$%^&*():;\+\-=~{}<>\_\[\]\|\,\.\/\`]).{10,}$/; //## 10자리 이상, 영문 포함, 특수문자 포함 정규식
        flag = regExp03.test(value);
    }

    if (flag && !isEmpty(phone)) {
        let midPhone = phone.substr(3, 4); //## 핸드폰번호 가운데 4글자
        let endPhone = phone.substr(7, 4); //## 핸드폰번호 마지막 4글자
        flag = !(value.includes(midPhone) || value.includes(endPhone)); //## 핸드폰번호가 포함되어있는지
    }

    if (flag) {
        flag = compareChar(value); //## 숫자 연속 사용 체크
    }
    return flag;
}


/**
 * 숫자 연속 사용 체크
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : 입력한 값
 */
 export function compareChar(value: string) {
    let cnt = 0;
    for (let i = 0; i < value.length - 1; i++) {
        if (isNumber(value[i])) {
            let char01 = value.charCodeAt(i);
            let char02 = value.charCodeAt(i + 1);
            if (char01 - char02 === 1) {
                cnt++;
            } else if (char01 - char02 === -1) {
                cnt--;
            } else {
                cnt = 0;
            }
            if (Math.abs(cnt) === 2) {
                return false;
            }
        } else {
            cnt = 0;
        }
    }

    return true;
}


//##################################################################################################################
//##
//## >> Method : Adjust / Analytics
//##
//##################################################################################################################

/**
 * Adjust Action Check
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : adjust value
 * @param userId : userId
 */
 export function adjustEvent(value: string, userId?: string) {
    try {
        if (osCheck() === 'android') {
            const androidHandler = androidDevice();
            try {
                if (isEmpty(userId)) {
                    androidHandler.adjustEvent(value);
                } else {
                    androidHandler.adjustEvent(value, userId);
                }
            } catch (e) {
                androidHandler.adjustEvent(value);
            }
        } else if (osCheck() === 'ios') {
            let iosData = {
                value: value
            };
            if (!isEmpty(userId)) {
                let userIdObj = {
                    userId: userId
                };
                iosData = {
                    ...iosData,
                    ...userIdObj
                };
            }
            const iosHandler = iosDevice('adjustEvent');
            iosHandler.postMessage(iosData);
        }
    } catch (e) {
    }
}

/**
 * Analytics Action Check
 * ---------------------------------------------------------------------------------------------------------------------
 */
export function analyticsEvent(value: string) {
    try {
        if (osCheck() === 'android') {
            const androidHandler = androidDevice();
            androidHandler.analyticsEvent(value);
        } else if (osCheck() === 'ios') {
            let iosData = {
                value: value
            };
            const iosHandler = iosDevice('analyticsEvent');
            iosHandler.postMessage(iosData);
        }
    } catch (e) {
    }
}

/**
 * Android Device Check
 * ---------------------------------------------------------------------------------------------------------------------
 */
 export function androidDevice() {
    const messageHandler = (window as any).AndroidApp;
    return messageHandler;
}

/**
 * IOS Device Check
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param functionName : Function Name
 */
export function iosDevice(functionName: string) {
    const messageHandler =
        (window as any).webkit &&
        (window as any).webkit.messageHandlers &&
        (window as any).webkit.messageHandlers[functionName];
    return messageHandler;
}

/**
 * OS Check
 * ---------------------------------------------------------------------------------------------------------------------
 */
export function osCheck() {
    let os = 'android';
    try {
        let ua = navigator.userAgent;

        let checker = {
            iphone: ua.match(/(iPhone|iPod|iPad)/),
            android: ua.match(/Android/)
        };

        if (!ua.includes("connectionType/webview")) {
            os = 'web';
        } else if (checker.android) {
            os = 'android';
        } else if (checker.iphone) {
            os = 'ios';
        }
    } catch (e) {
        os = 'error';
    }
    return os;
}


/**
 * Page Finish
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @type : page finish type
 * @jsonData : JSONObject String Data
 */
 export function pageFinish(type?: string, jsonData?: String) {
    try {
        if (osCheck() === 'android') {
            const androidHandler = androidDevice();
            if (type) {
                androidHandler.pageFinish(type, jsonData);
            } else {
                androidHandler.pageFinish();
            }
        } else if (osCheck() === 'ios') {
            const iosHandler = iosDevice('pageFinish');
            if (type) {
                let iosData = {
                    type: type,
                    jsonData: jsonData
                };
                iosHandler.postMessage(iosData);
            } else {
                iosHandler.postMessage('');
            }
        }
    } catch (e) {

    }
}

/**
 * 도로명주소 API 예외 처리(https://www.juso.go.kr/addrlink/devAddrLinkRequestWrite.do?returnFn=write&cntcMenu=URL)
 * ---------------------------------------------------------------------------------------------------------------------
 */
 export function checkSearchedWord(value: string) {
    if (value.length > 0) {
        //특수문자 제거
        let expText = /[%=><]/;
        if (expText.test(value) == true) {
            alert("특수문자를 입력 할수 없습니다.");
            value = value.split(expText).join("");
            return false;
        }

        //특정문자열(sql예약어의 앞뒤공백포함) 제거
        let sqlArray = new Array(
            //sql 예약어
            "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
            "UNION", "FETCH", "DECLARE", "TRUNCATE"
        );

        let regex;
        for (let i = 0; i < sqlArray.length; i++) {
            regex = new RegExp(sqlArray[i], "gi");

            if (regex.test(value)) {
                alert("\"" + sqlArray[i] + "\"와(과) 같은 특정문자로 검색할 수 없습니다.");
                value = value.replace(regex, "");
                return false;
            }
        }
    }
    return true ;
}

/**
 * input Tag 엔터키 입력 시 포커싱 해제
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param e : Event
 */
 export function enterKeyPress(e: any) {
    if (e.key === "Enter" || e.keyCode === 13) {
        e.target.blur();
    }
}


/**
 * RSA PublicKey 가져오기
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param authorization : Auth
 * @param userId : User ID
 * @param callback : CallBack Method
 */
 export function getRSAPublicKeyApi(authorization: string = "", userId: number, callback: (flag: boolean) => void) {
    if (!isEmpty(authorization)) {
        LocalStorage.setStorage(LocalStorage.AUTHORIZATION, authorization);
    }
    LocalStorage.setStorage(LocalStorage.USER_ID, userId);
    try {
        Api.getRSAPublicKey().then((response: any) => {
            if (response.status === 200) {
                let data = response.data;
                if (data.code === 200) {
                    LocalStorage.setStorage(LocalStorage.RSA_PUBLIC_KEY, data.data);
                    callback(true)
                } else {
                    callback(false)
                }
            } else {
                callback(false)
            }
        }).catch(err => {
            console.log(err);
            callback(false)
        });
    } catch (e) {
        callback(false)
    }
}

/**
 * Date Converting
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param date : Date Value
 * @param format : format
 */
 export function convertDateToString(date: any, format: string = "YYYY-MM-DD") {
    return moment(date).format(format);
}

/**
 * Time Converting
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param momentTime : Time Value
 */
export function convertTimeToString(momentTime: any) {
    return moment(momentTime, 'HH:mm').format('HH:mm');
}

/**
 * Calendar How Many Weeks
 * Weeks start on Another
 * ---------------------------------------------------------------------------------------------------------------------
 */
 export function weeks(year: number, month: number) {
    let firstDay = new Date(year, month, 1).getDay(); //## 1일의 요일
    let lastDay = new Date(year, month + 1, 0).getDate(); //## 마지막 날짜
    let result = Math.ceil((firstDay + lastDay) / 7);

    return result;
}

/**
 * Not Hangul Pattern Regex
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param value : Value
 */
 export function notHangulCheck(value: string, flag?: boolean) {
    let regExp = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"\\]/g;
    let result = regExp.test(value);
    if (result && !isEmpty(value) && value.length > 1 && flag) {
        let valueArr = value.split("");
        if (valueArr[1] === "*") {
            if (!regExp.test(value.substring(0, 1))) {
                result = regExp.test(value.substring(2))
            }
        }
        if (value === "**") {
            result = true;
        }
    }
    return result;
}


/**
 * 금칙어 체크 Api
 * -----------------------------------------------------------------------------------------------------------------
 */
 export function badwordsCheckApi(data: any, callback?: any) {
    try {
        if (ENCRYPTION_TYPE === "TRUE") {
            let userId = LocalStorage.getStorage(LocalStorage.USER_ID);

            data = encryptAES256(JSON.stringify(data), userId ? userId : "carenation");
        }
        Api.badwordsCheck(data).then((response: any) => {
            if (response.status === 200) {
                if (callback) {
                    if (response.data.code === 200) {
                        callback(true);
                        return;
                    }
                    console.log("금칙어",response.data.data)

                    let arr: any[] = [];
                        for (let i = 0; i < response.data.data.length; i++) {
                            for (let j = 0; j < response.data.data[i].length; j++) {
                                if (arr.indexOf(response.data.data[i][j]) === -1) arr.push(response.data.data[i][j]);
                            }
                        }

                    callback(false, arr);
                    return;
                }
            } else {
                callback(false);
                return;
            }
        }).catch(err => {
            console.log(err);
            callback(false);
            return;
        });
    } catch (e) {
        callback(false);
        return;
    }
}

/**
 * AES 암호화
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param str : 암호화 값
 */
 export function encryptAES256(str: string, encryptKey?: string) {
    let userId = LocalStorage.getStorage(LocalStorage.USER_ID);
    if (isEmpty(userId)) {
        userId = encryptKey ? encryptKey : "";
    }

    if (isEmpty(userId)) {
        return;
    }

    /**
     * binary 변환
     * ---------------------------------------------------------------------------------------------------------------------
     *
     * @param len : byte length
     */
    const byteChange = (len: number) => {
        let result = "";
        if (userId) {
            let flag = isNumber(userId); //## str 문자열이 숫자인지 문자인지 체크
            let tempResult = "";
            for (let i = 0; i < userId.length; i++) {
                if (flag) {
                    tempResult += userId[i];
                } else {
                    tempResult += userId[i].charCodeAt(0);
                }
            }
            for (let i = 0; i < len; i++) {
                result += String.fromCharCode(i < tempResult.length ? (tempResult[i].charCodeAt(0) - '0'.charCodeAt(0)) : 0);
            }
        }
        return result;
    };

    /**
     * AES256 암호화
     * ---------------------------------------------------------------------------------------------------------------------
     *
     * @param str : String Value
     */
    const encrypt = (str: string) => {
        const cipher = crypto.createCipheriv(chainingMode, privateKey, ivKey);
        cipher.setAutoPadding(false);
        let encrypted = cipher.update(pkcs7Pad(str), undefined, "base64");
        encrypted += cipher.final("base64");
        return encrypted;
    };

    /**
     * AES256 암호화 pkcs7
     * ---------------------------------------------------------------------------------------------------------------------
     *
     * @param params : Params
     */
    const pkcs7Pad = (params: string) => {
        const buffer = Buffer.from(params, "utf8");
        const bytes = new Uint8Array(buffer.length);
        let i = buffer.length;
        while (i--) {
            bytes[i] = buffer[i];
        }
        return Buffer.from(pkcs7.pad(bytes) as Uint8Array);
    };

    const privateKey = byteChange(32); //## 32byte
    const ivKey = byteChange(16); //## 16byte

    return encrypt(str);
}
