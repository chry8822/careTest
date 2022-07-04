import * as LocalStorage from './localStorage'

const IMG_PATH = process.env.REACT_APP_IMG_URL;

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