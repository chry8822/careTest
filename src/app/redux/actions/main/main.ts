export const ADD_MAIN_DATA = "ADD_MAIN_DATA" as const;
export const INIT_MAIN_DATA = "INIT_MAIN_DATA" as const;

/**
 * 메인 데이터 저장
 * -----------------------------------------------------------------------------------------------------------------
 */
export const addMainData = (payload: any) => ({
    type: ADD_MAIN_DATA,
    payload
});

/**
 * 메인 데이터 초기화
 * -----------------------------------------------------------------------------------------------------------------
 */
export const initMainData = () => ({
    type: INIT_MAIN_DATA
});

export type MainAction = | ReturnType<typeof addMainData> | ReturnType<typeof initMainData>;
