import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {PopupState} from "../../../redux/states/popup/popup";

const CareSaveFamilyPopup = () => {

    const popup: PopupState = useSelector((state:RootState) => state.popup);

    return (
        <>
            <div className="popupWrap">
                <div className="popupWrap__tit">
                    <h2 className="txtStyle03">알림</h2>
                    <p>
                        작성한 환자 정보를 환자 목록에 <br/>
                        저장하시겠습니까?
                    </p>
                </div>
                <div className="btnWrap">
                    <button type="button" className="btnBorder" onClick={() => popup.action("saveCancel")}>저장 안함</button>
                    <button type="button" className="btnColor" onClick={() => popup.action("saveFamily")}>저장</button>
                </div>
            </div>
        </>
    )
}

export default CareSaveFamilyPopup;