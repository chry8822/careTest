import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {PopupState} from "../../../redux/states/popup/popup";
import * as Utils from "../../../constants/utils";

/**
 * 메인 공고 불러오기 팝업
 * -----------------------------------------------------------------------------------------------------------------
 */
const LoadWritePopup = () => {

    const popup: PopupState = useSelector((state: RootState) => state.popup);

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <div className="popupWrap">
            <div className="popupWrap__tit load">
                <img src="/img/popupLoad.svg" alt="공고 불러오기 이미지" aria-hidden onError={Utils.imgSrcError}/>
                <h2>
                    <mark>작성중인 신청서가 있습니다.</mark>
                    <br/>
                    불러올까요?
                </h2>
                <p>
                    새로 등록하시면<br/>
                    임시저장된 공고는 삭제됩니다!
                </p>
            </div>
            <div className="buttonWrap">
                <button type="button" className="outlineTxtBtn" onClick={() => popup.action("new")}>새로 등록</button>
                <button type="button" className="solidBtn" onClick={() => popup.action(popup.actionType)}>불러오기</button>
            </div>
        </div>
    );
};

export default LoadWritePopup;
