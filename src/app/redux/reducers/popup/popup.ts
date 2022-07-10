import {PopupState, InitialPopup} from '../../states/popup/popup'
import {PopupAction, SHOW_POPUP, HIDE_POPUP} from "../../actions/popup/popup";

function popup(state: PopupState = InitialPopup, action: PopupAction) {
    switch(action.type) {
        case SHOW_POPUP :
            return {
                ...state,
                ...action.payload,
                show: true
            };
        case HIDE_POPUP :
            return InitialPopup;
        default :
            return state;
    }
}

export default popup;

// 타입이 SHOW_POPUP 일때 팝업의 초기값, aciton.payload , show: true 가 담긴 객체를 반환.
// 타입이 HIDE_POPUP 일때 팝업의 초기값 반환 (show: false) 

