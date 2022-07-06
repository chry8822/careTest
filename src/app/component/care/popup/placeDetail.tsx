import React,{ useEffect, useState } from 'react';
import {RootState} from "../../../redux/store";
import {PopupState} from "../../../redux/states/popup/popup";
import {useSelector,useDispatch} from "react-redux";
import { useNavigate } from 'react-router-dom';
import {hidePopup, showPopup} from "../../../redux/actions/popup/popup";
import * as Utils from '../../../constants/utils'
import Popup from '../../common/popup';


interface CarePlaceDetailPopupProps {
    jobType: string;    //## 기간,시간제  
    placeType: string;  //## 병원, 집
    selectPlace: any;   //## 선택장소
}



const CarePlaceDetailPopup = ({jobType, placeType,selectPlace}:CarePlaceDetailPopupProps) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const popup: PopupState = useSelector((state: RootState) => state.popup) as PopupState;

    const [ detailEtcAddress, setDetailEtcAddress ] = useState<string>("") //## 기타 상세 주소
    const [ uncertainFlag, setUncertainFlag ] = useState<boolean>(false) //## 병동 호실 체크 확인
    const [ etcWarning, setEtcWarning ] = useState<boolean>(false) //## 기타 상세 주소 input warning

    
    
    //##################################################################################################################
    //##
    //## >> Override
    //##
    //##################################################################################################################

    useEffect(() => {
        window.scrollTo(0, 0);

        // //### 공고 등록 store 초기화
        // dispatch(initCare());

        // socket = new SocketIO("");
        // return () => {
        //     if (socket != null) {
        //         socket.viewStay();
        //     }
        // }
    }, []);

    //##################################################################################################################
    //##
    //## >> Method : Popup
    //##
    //##################################################################################################################

    /**
     * Popup Action
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param type : result Type
     */
     const popupAction = (type: string) => {
        dispatch(hidePopup());
    }

    // 등록 버튼
    const addressRegisterValidation = () => {
        if(!uncertainFlag && Utils.isEmpty(detailEtcAddress)){
            setEtcWarning(true)
            return
        }
        if (jobType === "day") { //# 기간제
            if (placeType === "hospital") { //# 병원
                Utils.adjustEvent("rd5vvi");
                Utils.analyticsEvent("care_dhos_loc");
            } else { //# 집
                Utils.adjustEvent("ollcv4");
                Utils.analyticsEvent("care_dhom_loc");
            }
        } else { //# 시간제
            if (placeType === "hospital") { //# 병원
                Utils.adjustEvent("55t248");
                Utils.analyticsEvent("care_thos_loc");
            } else { //# 집
                Utils.adjustEvent("pku6ww");
                Utils.analyticsEvent("care_thom_loc");
            }

        }
        
        setDetailEtcAddress("");
        setUncertainFlag(false);
        setEtcWarning(false);
        
        popup.action(popup.actionType, {...selectPlace, detail: uncertainFlag ? '(호실 미정)' : detailEtcAddress});

    };

    /**
     * 미정 클릭
     * -----------------------------------------------------------------------------------------------------------------
     */

    const checkUncertain = () => {
        setDetailEtcAddress("");
        setUncertainFlag(!uncertainFlag)
    }
    
    return (
        <>
                <h2 className="a11y-hidden">주소 자세히 입력하기</h2>
                <div className="popupWrap">
                    <article className="noticeRegister__form">
                        <div className={"noticeRegister__form--txt" + (placeType === "hospital" ? " hospital" : " home")}>
                            <h3 className="txtStyle03-W500">간병 장소 :{placeType === "hospital" ? "병,의원" : "집"}</h3>
                            <p className="txtStyle06-C777">
                                {placeType === "hospital" ? 
                                    "선택한 케어메이트가 병,의원으로 찾아갑니다." 
                                    : 
                                    "선택한 케어메이트가 입력한 주소로 찾아갑니다."}
                            </p>
                        </div>

                        <div className="noticeRegister__form--search">
                            <div className="inputWrap">
                                <div className="inputWrap__box">
                                    {/* <!-- 비활성화 일 때 input에 disabled 추가 --> */}
                                    <input
                                        type="text"
                                        className=""
                                        value={selectPlace.info}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="inputWrap">
                                {/* <!-- 아무 동작도 하지않았을 때 className에 wrong 추가 --> */}
                                <div 
                                    className="inputWrap__box"
                                >
                                    <input 
                                        style={ etcWarning ? {borderColor :"#dc3545"} : {borderColor :""}}    
                                        type="text" 
                                        autoComplete="off"
                                        placeholder=
                                        {
                                            placeType === "hospital" ?         
                                            "병동 및 호실 정보를 입력해 주세요."
                                            :
                                            "기타 상세 주소를 입력해 주세요."
                                        }
                                        disabled={uncertainFlag}
                                        value={detailEtcAddress}
                                        onKeyPress={Utils.enterKeyPress}
                                        onChange={(e) => setDetailEtcAddress(e.target.value)}
                                    />
                                    {
                                        !Utils.isEmpty(detailEtcAddress) &&
                                        <button 
                                            type="reset" 
                                            className="resetBtn"
                                            onClick={()=> setDetailEtcAddress("")}    
                                        >리셋</button>
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            placeType === "hospital" &&
                            <div className="checkSelect__box">
                                <input 
                                    type="checkbox" 
                                    id="agree" 
                                    name="agree" 
                                    checked={uncertainFlag}
                                    onChange={()=> checkUncertain()}
                                />
                                <label htmlFor="agree">병동 및 호실이 정해지지 않음</label>
                            </div>
                        }
                    </article>
                    <div className="btnWrap">
                        <button 
                            type="button" 
                            className="btnBorder"
                            onClick={() => dispatch(hidePopup())}    
                        >취소</button>
                        <button 
                            type="button" 
                            className="btnColor"
                            onClick={()=>{addressRegisterValidation()}}    
                        >등록하기</button>
                    </div>
                </div>
        </>
    )
}

export default CarePlaceDetailPopup;