import React from 'react';
import {useSelector} from "react-redux";
import * as Utils from "../../constants/utils";
import {RootState} from "../../redux/store";
import {PopupState} from "../../redux/states/popup/popup";

const Popup = () => {

    const popup: PopupState = useSelector((state: RootState) => state.popup) as PopupState;

    const DEFAULT_MSG = "일시적인 오류가 발생하였습니다.\n잠시 후 다시 시도해주세요.";

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <div className="popupWrap">
            <div className="popupWrap__tit">
                <h2 className="txtStyle03">{Utils.isEmpty(popup.title) ? "알림" : popup.title}</h2>
                <p dangerouslySetInnerHTML={{__html: Utils.isEmpty(popup.content) ? DEFAULT_MSG : popup.content}}/>
            </div>
            <div className="buttonWrap">
                {
                    popup.btnType === 'two' &&
                    <button type="button" className="outlineTxtBtn"
                            onClick={() => popup.action("hide")}>
                        {Utils.isEmpty(popup.btn01) ? "취소" : popup.btn01}
                    </button>
                }
                <button type="button" className="solidBtn"
                        onClick={() => popup.action(popup.actionType)}>
                    {Utils.isEmpty(popup.btn02) ? "확인" : popup.btn02}
                </button>
            </div>
        </div>
    );
};

export default Popup;
