export type PopupState = {
    show: boolean; //## Show Flag
    element: Function | any; //## Popup Element
    action: Function | any; //## Button Action
    type: string; //## Popup Type(popup / bottomPopup)
    title: string; //## 제목
    content: string; //## 내용
    btnType: string; //## one / two
    btn01: string; //## 첫번째 버튼 텍스트
    btn02: string; //## 두번째 버튼 텍스트
    actionType: string; //## Button Action Type
};

export const InitialPopup: PopupState = {
    show: false,
    element: null,
    action: null,
    type: "popup",
    title: "",
    content: "",
    btnType: "one",
    btn01: "",
    btn02: "",
    actionType: ""
};
// popup 기본 상태