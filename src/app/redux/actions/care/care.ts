export const SET_CARE = "care/SET" as const;
export const INIT_CARE = "care/INIT" as const;

/**
 * Care Data Set
 * -----------------------------------------------------------------------------------------------------------------
 */
export const setCare = (payload: any) => ({
    type: SET_CARE,
    payload
});

/**
 * Care Data Initialize
 * -----------------------------------------------------------------------------------------------------------------
 */
export const initCare = () => ({
    type: INIT_CARE
});



export type CareAction =
    | ReturnType<typeof setCare>
    | ReturnType<typeof initCare>;
