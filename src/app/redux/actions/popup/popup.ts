export const SHOW_POPUP = "popup/SHOW" as const;
export const HIDE_POPUP = "popup/HIDE" as const;


/*
    1. element: Function | any; //## Popup Element
    2. action: Function | any; //## Button Action
    4. type: string; //## Popup Type(popup / bottomPopup)
    5. title: string; //## 제목
    6. content: string; //## 내용
    7. btnType: string; //## one / two
    8. btn01: string; //## 첫번째 버튼 텍스트
    9. btn02: string; //## 두번째 버튼 텍스트
    3. actionType: string; //## Button Action Type
 */

interface ShowPopupType {
    element: () => JSX.Element 
    action?: (type: string, result?:any) => void 
    type?: string
    title?: string | number
    content?: string
    btnType?: string
    btn01?: string
    btn02?: string 
    actionType?: string | any,
}
export const showPopup = ({...props}:ShowPopupType) => ({
    type: SHOW_POPUP,
    payload: props
});
// showPopup에 파라미터로 ShowPopupType 가 들어오고 해당 파라미터는 payload 에 값으로 할당 된다. 

export const hidePopup = () => ({ type: HIDE_POPUP });

export type PopupAction = | ReturnType<typeof showPopup> | ReturnType<typeof hidePopup>; 
