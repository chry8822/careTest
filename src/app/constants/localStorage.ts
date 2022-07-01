export const AUTHORIZATION = "authorization";
export const USER_ID = "user_id";
export const RSA_PUBLIC_KEY = "rsa_public_key";
export const LOAD_WRITE_DATA = "load_write_data";       //### 공고 등록 불러오기 데이터
export const SCROLL_POSITION = "scroll_position";       //### 리스트 스크롤 위치 저장
export const JOB_RE_CALL_FLAG = "job_re_call_flag";     //### 공고 재등록 분기
export const IS_EXTEND_PAYMENT = "is_extend_payment";   //### 간병 공고 연장 분기
export const REVIEW_SCROLL_FLAG = "review_scroll_flag"; //### 간병 완료내역 한 줄 평 보기 분기

export function setStorage(key: string, value: any) {
    localStorage.setItem(key, value);
}

export function getStorage(key: string) {
    return localStorage.getItem(key);
}

export function remove(key: string) {
    return localStorage.removeItem(key);
}

export function clear() {
    return localStorage.clear();
}

export default {
    AUTHORIZATION, USER_ID, RSA_PUBLIC_KEY, LOAD_WRITE_DATA, SCROLL_POSITION, JOB_RE_CALL_FLAG, IS_EXTEND_PAYMENT, REVIEW_SCROLL_FLAG
};
