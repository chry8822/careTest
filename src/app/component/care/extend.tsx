import React, { useState, useEffect } from 'react';
import Header from '../common/header';
import { useNavigate, useParams } from 'react-router-dom';
import * as Utils from '../../constants/utils'
import ExtendTypePopup from './popup/popup'
import { useDispatch } from 'react-redux';
import { showPopup, hidePopup } from './../../redux/actions/popup/popup';
import Popup from "../common/popup";
import * as LocalStorage from '../../constants/localStorage';
import {initCare} from "../../redux/actions/care/care";


const CareExtend = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const getParam = useParams()

    const [extendType, setExtendType] = useState(''); //## timeCare01 : 시간제 , timeCare02 : 기간제
    const [placeType, setPlaceType] = useState('');   //## placeCare01: 병.의원 , placeCare02 : 집
    const [familyId] = useState(getParam.familyId || 0);


    //##################################################################################################################
    //##
    //## >> Override
    //##
    //##################################################################################################################

    useEffect(() => {
        window.scrollTo(0, 0);

        //### 공고 등록 store 초기화
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
        dispatch(hidePopup())
        console.log("팝엎비잗거ㅣㅏㅓㅇㄹ")
        if(extendType === "timeCare01" || extendType === "timeCare02") {
            let jobType = extendType === "timeCare01" ? "time" : "day";
            let requestType = placeType === "placeCare01" ? "hospital" : "home";
            let paramFamilyId = (Utils.isEmpty(familyId) || familyId === 0) ? '' : `/${familyId}`;

            
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
                  //### 공고 등록 store 초기화
                  dispatch(initCare());

                  LocalStorage.remove(LocalStorage.LOAD_WRITE_DATA);

            navigate(`/care/place/register/${jobType}/${requestType}${paramFamilyId}`);
        }

    }


    //##################################################################################################################
    //##
    //## >> Method : Private
    //##
    //##################################################################################################################

    // timeCare 시간제
    // placeCare 기간제

    const validationData = () => { //### 다음 버튼 활성화
        return Utils.isEmpty(extendType) || Utils.isEmpty(placeType)
    }


    /**
     * 간병장소 선택 결과
     * -----------------------------------------------------------------------------------------------------------------
     */

    const validationSelect = () => { //### 간병 서비스 선택 결과 팝업
        let checkMsg;         
        if(Utils.isEmpty(extendType)) {
            checkMsg = "간병 서비스를 선택해주세요.";
        } else if (Utils.isEmpty(placeType)) {
            checkMsg = "간병 장소를 선택해주세요.";
        }
        if(checkMsg) {
            dispatch(showPopup({element:Popup,action:popupAction,content:checkMsg}))
        } else {
            //### 간병 서비스 선택 Bottom Popup 노출
            dispatch(showPopup
                ({element:ExtendTypePopup,
                  action:popupAction,
                  type:"bottomPopup",
                  title:extendType,
                  content:placeType,
                  actionType:"timeCare01"
                }))
                  // extendType 에 들어오는 시간제 , 기간제 타입을 타이틀로 넘겨줘서 해당 타입에 맞는 팝업 노출
        }
    }


    return (
        <>
            <Header
                title={"공고 등록"}
                historyBack={true}
            />
            <main id="content">
                <div className="subWrap">
                    <div className="subWrap__flex">
                        <div className="customCare">
                            <h2 className="txtStyle05-Wnoml"><strong>맞춤형 간병설정</strong>을 시작합니다.</h2>
                            <section className="careWrap">
                                <h3 className="txtStyle02">
                                    보호자님에게 필요한<br />
                                    <mark>간병 서비스</mark>는 무엇인가요?
                                </h3>
                                <ul className="radioSelectCheck">
                                    <li className="radioSelectCheck__box timeCareDown">
                                        <input
                                            type="radio"
                                            id="timeCare01"
                                            name="timeCare"
                                            value="timeCare01"
                                            checked={extendType === "timeCare01"}
                                            onChange={(e) => setExtendType(e.target.value)}
                                        />
                                        <label htmlFor="timeCare01" className="timeCare01"
                                        >시간제 간병
                                            <span
                                            >24시간 미만의 <br />
                                                간병이 필요해요.</span
                                            >
                                        </label>
                                    </li>
                                    <li className="radioSelectCheck__box timeCareUp">
                                        <input
                                            type="radio"
                                            id="timeCare02"
                                            name="timeCare"
                                            value="timeCare02"
                                            checked={extendType === "timeCare02"}
                                            onChange={(e) => setExtendType(e.target.value)}
                                        />
                                        <label htmlFor="timeCare02" className="timeCare02"
                                        >기간제 간병
                                            <span
                                            >24시간 이상의 <br />
                                                간병이 필요해요.</span
                                            >
                                        </label>
                                    </li>
                                </ul>
                            </section>
                            <section className="careWrap pt0">
                                <h3 className="txtStyle02">
                                    보호자님이 원하는 <br />
                                    <mark>간병장소</mark>를 선택해주세요!
                                </h3>
                                <ul className="radioSelectCheck">
                                    <li className="radioSelectCheck__box hospital">
                                        <input
                                            type="radio"
                                            id="placeCare01"
                                            name="placeCare"
                                            value="placeCare01"
                                            checked={placeType === "placeCare01"}
                                            onChange={(e) => setPlaceType(e.target.value)}
                                        />
                                        <label htmlFor="placeCare01">병, 의원</label>
                                    </li>
                                    <li className="radioSelectCheck__box home">
                                        <input
                                            type="radio"
                                            id="placeCare02"
                                            name="placeCare"
                                            value="placeCare02"
                                            checked={placeType === "placeCare02"}
                                            onChange={(e) => setPlaceType(e.target.value)}
                                        />
                                        <label htmlFor="placeCare02">집</label>
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                    <div className="btnWrap mt0">
                        <button
                            type="button"
                            className="btnBorder"
                            onClick={() => navigate(-1)}
                        >이전</button>
                        <button
                            type="button"
                            className={"btnColor" + (validationData() ? " disabled" : "")}
                            disabled={validationData()}
                            onClick={() => validationSelect()}
                        >다음</button>
                    </div>
                </div>
            </main>


            {/* 기간제 */}

           {/* { 
            infoPopupFlag === "time" ? 
            <aside className={"bottomPopup" + infoPopupFlag === "time" ? " active" : ""}>
                <div className="bottomPopupWrap">
                    <section className="bottomPopup__tit border">
                        <h2 className="txtStyle02-Wnoml">기간제 간병</h2>
                        <button type="button" className="close">닫기</button>
                    </section>
                    <section className="bottomPopup__detail">
                        <div className="commonWrap04">
                            <div className="bottomPopup__detail--timeCare">
                                <div className="timeCareUp">
                                    <h3 className="txtStyle02"><mark>기간제 간병을 선택하셨네요!</mark></h3>
                                    <p>
                                        기간제 간병은 장기간 간병을 받는데<br />
                                        적합한 서비스입니다.
                                    </p>
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
                            <div className="btnWrap">
                                <button type="button" className="btnColor">다음</button>
                            </div>
                        </div>
                    </section>
                </div>
            </aside>
            :
            <aside className={"bottomPopup" + infoPopupFlag === "palce" ? " active" : ""}>
                <div className="bottomPopupWrap">
                    <section className="bottomPopup__tit border">
                        <h2 className="txtStyle02-Wnoml">시간제 간병</h2>
                        <button type="button" className="close">닫기</button>
                    </section>
                    <section className="bottomPopup__detail">
                        <div className="commonWrap04">
                            <div className="bottomPopup__detail--timeCare">
                                <div className="timeCareDown">
                                    <h3 className="txtStyle02"><mark>시간제 간병을 선택하셨네요!</mark></h3>
                                    <p>
                                        시간제 간병은 보호자님이 설정하신 시간만큼만<br />
                                        간병받는 서비스입니다.
                                    </p>
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
                            <div className="bottomPopup__detail--timeCareInfo">
                                <p className="txtStyle04-W500">
                                    보호자님의 개인 스케줄에 맞추어 <br />
                                    간병을 받아보세요!
                                </p>
                            </div>
                            <div className="btnWrap">
                                <button type="button" className="btnColor">다음</button>
                            </div>
                        </div>
                    </section>
                </div>
            </aside>
            } */}
            {/* <ExtendTypePopup infoPopupFlag={infoPopupFlag}/> */}
        </>
    );
}

export default CareExtend;