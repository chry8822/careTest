import React,{ useState, useEffect } from 'react'
import {RootState} from "../../../redux/store";
import {PopupState} from "../../../redux/states/popup/popup";
import {useSelector} from "react-redux";
import { useDispatch } from 'react-redux';
import { hidePopup,showPopup } from '../../../redux/actions/popup/popup';
import * as Utils from '../../../constants/utils'
import * as LocalStorage from '../../../constants/localStorage';
import { useNavigate } from 'react-router-dom';

const ExtendTypePopup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const popup: PopupState = useSelector((state: RootState) => state.popup) as PopupState;


    const [ extendType, setExtendType ] = useState("") //## 시간제: timeCare01 , 기간제: timeCare02
    const [ placeType, setPlaceType ] = useState("")  //## 병.의원: placeType01 , 집 : placeType02

    useEffect(() => { // 선택 결과 팝업에서 넘겨준 타입
        setExtendType(popup.title)   
        setPlaceType(popup.content) 
    },[extendType,placeType])

    console.log(extendType)

    
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
     * @param result : Object Data
     */
     const popupAction = (type: string, result?: any) => {
        dispatch(hidePopup());
        
    };

    //##################################################################################################################
    //##
    //## >> Method : Private
    //##
    //##################################################################################################################


    const serviceSelect = () => { //선택 결과 팝업에서 다음 클릭 시 선택한 데이터를 쿼리로 전달해서 해당 컴포넌트로 이동
        dispatch(hidePopup())

        if(extendType) {
            console.log("ddd")
            let jobType = extendType === "timeCare01" ? "time" : "day";
            let requestType = placeType === "placeCare01" ? "hospital" : "home";
            
            if(jobType === "day") { //# 기간제 
                if(requestType === "hopital"){ //# 병원
                    Utils.adjustEvent("i3skha");
                    Utils.analyticsEvent("care_dhos_st");
                } else {                       //# 집
                    Utils.adjustEvent("pasc1c");
                    Utils.analyticsEvent("care_dhom_st");
                }
            }else {
                if (requestType === "hospital") { //# 병원
                    Utils.adjustEvent("f4ga1y");
                    Utils.analyticsEvent("care_thos_st");
                } else {                          //# 집
                    Utils.adjustEvent("qyrh0o");
                    Utils.analyticsEvent("care_thom_st");
                }
            }

            navigate(`/care/place/register/${jobType}/${requestType}`);
        }

    }
    
    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################


    return (
        <>
            {   
                <div className="bottomPopupWrap">
                    <section className="bottomPopup__tit border">
                        <h2 className="txtStyle02-Wnoml">{extendType === "timeCare01" ? "시간제 간병" : "기간제 간병"}</h2>
                        <button 
                            type="button" 
                            className="close"
                            onClick={() => popup.action("hide")}    
                        >닫기</button>
                    </section>
                    <section className="bottomPopup__detail">
                        <div className="commonWrap04">
                            <div className="bottomPopup__detail--timeCare">
                                <div className="timeCareDown">
                                    <h3 className="txtStyle02"><mark>{
                                        extendType === "timeCare01" ? 
                                        "시간제 간병을 선택하셨네요!"
                                        :
                                        "기간제 간병을 선택하셨네요!"
                                    }</mark></h3>
                                    {
                                        extendType === "timeCare01" ? 
                                        <p>
                                            시간제 간병은 보호자님이 설정하신 시간만큼만<br />
                                            간병받는 서비스입니다.
                                        </p>
                                        :
                                        <p>
                                            기간제 간병은 장기간 간병을 받는데<br />
                                            적합한 서비스입니다.
                                        </p>
                                    }
                                </div>
                                <h4 className="txtStyle03-C333">해당 서비스의 설정 가능 시간</h4>
                                <dl>
                                    <div>
                                        <dt>간병 시작시간</dt>
                                        <dd>제한 없음</dd>
                                    </div>
                                    <div>
                                        <dt>간병 종료시간</dt>
                                        <dd>07시부터 20시까지</dd>
                                    </div>
                                </dl>
                            </div>
                            {
                                extendType === "timeCare01" &&
                                <div className="bottomPopup__detail--timeCareInfo">
                                    <p className="txtStyle04-W500">
                                        보호자님의 개인 스케줄에 맞추어 <br />
                                        간병을 받아보세요!
                                    </p>
                                </div>
                            }
                            <div className="btnWrap">
                                <button 
                                    type="button" 
                                    className="btnColor"
                                    onClick={() => serviceSelect()}        
                                >다음</button>
                            </div>
                        </div>
                    </section>
                </div>
            }
        </>
    )
}

export default ExtendTypePopup;