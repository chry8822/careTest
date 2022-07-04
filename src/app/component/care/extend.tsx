import React, { useState } from 'react';
import Header from '../common/header';
import { useNavigate } from 'react-router-dom';
import * as Utils from '../../constants/utils'
import ExtendTypePopup from './popup/popup'
import { useDispatch } from 'react-redux';
import { showPopup, hidePopup } from './../../redux/actions/popup/popup';


const CareExtend = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [extendType, setExtendType] = useState('');
    const [placeType, setPlaceType] = useState('');
    const [infoPopupFlag, setinfoPopupFlag] = useState<any>("");

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


    // timeCare 시간제
    // placeCare 기간제

    const validationData = () => {
        return Utils.isEmpty(extendType) || Utils.isEmpty(placeType)
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
                            onClick={() => {
                                extendType === "timeCare01" ? setinfoPopupFlag("time") : setinfoPopupFlag("place")
                                dispatch(showPopup({element:ExtendTypePopup,action:popupAction,type:"bottomPopup"}))
                            }}
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