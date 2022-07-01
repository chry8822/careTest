import * as LocalStorage from './localStorage'

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