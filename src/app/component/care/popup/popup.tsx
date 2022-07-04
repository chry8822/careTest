import React from 'react'
import {RootState} from "../../../redux/store";
import {PopupState} from "../../../redux/states/popup/popup";
import {useSelector} from "react-redux";

const ExtendTypePopup = () => {

    const popup: PopupState = useSelector((state: RootState) => state.popup) as PopupState;

    const DEFAULT_MSG = "일시적인 오류가 발생하였습니다.\n잠시 후 다시 시도해주세요.";

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################


    return (
        <>
            {/* <aside className={"bottomPopup active"}> */}
                <div className="bottomPopupWrap">
                    <section className="bottomPopup__tit border">
                        <h2 className="txtStyle02-Wnoml">기간제 간병</h2>
                        <button 
                            type="button" 
                            className="close"
                            onClick={() => popup.action("hide")}
                        >닫기</button>
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
            {/* </aside> */}
            {/* <aside className={"bottomPopup"}>
                <div className="bottomPopupWrap">
                    <section className="bottomPopup__tit border">
                        <h2 className="txtStyle02-Wnoml">시간제 간병</h2>
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
            </aside> */}
        </>
    )
}

export default ExtendTypePopup;