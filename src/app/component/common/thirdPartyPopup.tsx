import React from 'react';
import {RootState} from "../../redux/store";
import {PopupState} from "../../redux/states/popup/popup";
import { useSelector } from 'react-redux'
import { hidePopup } from '../../redux/actions/popup/popup';

const renderThirdPartyPopup = () => {

 
    const popup: PopupState = useSelector((state: RootState) => state.popup) as PopupState;

    const DEFAULT_MSG = "일시적인 오류가 발생하였습니다.\n잠시 후 다시 시도해주세요.";
 
 
    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return(
            <div className="popupWrap">
            <div className="popupWrap__tit">
                <h2 className="txtStyle03-W500">목록</h2>
            </div>
            <div className="popupWrap__clause">
                <ul className="radioSelect">
                <li className="radioSelect__box">
                    <input type="radio" id="clause01" name="clause" />
                    <label htmlFor="clause01">[시행예정] YYYY.MM.DD</label>
                </li>
                </ul>
            </div>
            <div className="btnWrap">
                <button 
                    type="button" 
                    className="btnColor"
                    onClick={()=>{
                        popup.action("hide")
                    }}
                >닫기</button>
                <button 
                    type="button" 
                    className="btnColor"
                    onClick={()=>{
                        popup.action("hide")
                    }}
                >선택</button>
            </div>
            </div>
    )
}

export default renderThirdPartyPopup;