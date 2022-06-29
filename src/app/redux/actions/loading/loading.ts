export const SET_LOADING = "loading/SET" as const;
export const INIT_LOADING = "loading/INIT" as const;

/**
 * Loading Set
 * -----------------------------------------------------------------------------------------------------------------
 */
 export const setLoading = (loading: boolean) => ({
    type: SET_LOADING,
    payload: {loading}
});

/**
 * Loading Initialize
 * -----------------------------------------------------------------------------------------------------------------
 */
export const initLoading = () => ({
    type: INIT_LOADING
});

export type LoadingAction =
    | ReturnType<typeof setLoading>
    | ReturnType<typeof initLoading>;
