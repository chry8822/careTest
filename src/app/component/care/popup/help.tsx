import React, { useState,lazy,useMemo } from 'react'
import { useSelector } from "react-redux";
import Dompurify from "dompurify";
import * as Utils from "../../../constants/utils";
import { RootState } from "../../../redux/store";
import { PopupState } from "../../../redux/states/popup/popup";

interface HelpInfoType {
    img: string;
    title: string;
    content: string;
}

/**
 * 공고 등록/상세 환자 정보 도움말 팝업
 * -----------------------------------------------------------------------------------------------------------------
 */

const ExplanationRoomPopup = () => {

    const popup: PopupState = useSelector((state: RootState) => state.popup);
    const [position, setPosition] = useState(Number(popup.title) || 0); //## 도움말 팝업 탭 위치 (index)
    const helpInfo: HelpInfoType[] = require('./helpInfo')[popup.actionType]; //## 도움말 팝업 데이터 (Dynamic Importing)



    const renderTab = useMemo(() => {
        let html: any[] = [];
        {
            helpInfo.map((item: any, idx: number) => {
                html.push(
                    <li key={idx} className={position === idx ? "active" : ""} onClick={() => setPosition(idx)}>
                        <button type="button">{item.title}</button>
                    </li>
                );
                return item;
            });
        }
        return html;
    }, [popup.actionType, position]);
    console.log(helpInfo[position])
    
    return (
        <>
                <div className="bottomPopupWrap">
                    <div className="bottomPopup__detail">
                        {/* <!-- 간병 상세에서 각각을 클릭 했을 때에는 popupWrap__tab 태그만 삭제해주세요. --> */}
                        {/* <ul className="popupWrap__tab" role="tablist">
                            <li role="tab">일반실</li>
                            <li role="tab">응급실</li>
                            <li role="tab">중환자실</li>
                            <li role="tab">격리병실</li>
                            <li role="tab" className="active">폐쇄병실</li>
                        </ul> */}

                {
                    (popup.actionType && helpInfo.length > 1) && Utils.isEmpty(popup.title) &&
                    <div className="headerTabWrap">
                        <ul className="popupWrap__tab" role="tablist">
                            {renderTab}asdfasdf
                        </ul>
                    </div>
                }
                {
                    helpInfo &&
                    <div className="commonWrap04">
                        <div role="tabpanel">
                                <figure className='popupWrap__grayBox'>
                                    <img src={helpInfo[position].img} alt={helpInfo[position].title} aria-hidden onError={Utils.imgSrcError}/>
                                </figure>
                            <div className={"notifiRegis__helpPopup" + (popup.actionType === "careHelpInfo00" ? " sickRoom" : "")}>
                                <h2>
                                    <mark>{helpInfo[position].title}</mark>
                                </h2>
                                <p dangerouslySetInnerHTML={{__html: Dompurify.sanitize(helpInfo[position].content)}}/>
                            </div>
                      </div>
                            <div className="btnWrap mt40">
                                <button type="button" className="btnColor">확인</button>
                            </div>
                </div>
                }
                        {/* <div className="commonWrap04">
                            <div role="tabpanel">
                                <figure className="popupWrap__grayBox">
                                    <img src="../images/sickRoom05.svg" alt="폐쇄병실" />
                                </figure>
                                <div className="popupWrap__tit">
                                    <h2 className="popupWrap__tit--help"><mark>폐쇄병실</mark></h2>
                                    <p className="line3">
                                        폐쇄병동에 위치하여 출입이 제한된 병실입니다. <br />
                                        병원 운영 방침에 따라 개인 소지품(휴대폰, 개인 컵, 날이 뾰족한 물건 등) 사용이
                                        제한됩니다.
                                    </p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
        </>
    )
}

export default ExplanationRoomPopup;
