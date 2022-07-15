import React, { useState,lazy,useMemo } from 'react'
import { useSelector } from "react-redux";
import Dompurify from "dompurify";
import * as Utils from "../../../constants/utils";
import { RootState } from "../../../redux/store";
import { PopupState } from "../../../redux/states/popup/popup";
import * as DetailHelpInfo from '../../../component/care/popup/helpInfo'


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
            helpInfo.forEach((item: any, idx: number) => {
                html.push(
                    <li key={idx} className={position === idx ? "active" : ""} onClick={() => setPosition(idx)}>
                        <button type="button">{item.title}</button>
                    </li>
                );
            });
        }
        return html;
    }, [popup.actionType, position]);

    
    return (
        <>
                <div className="bottomPopupWrap">
                    <div className="bottomPopup__detail">
                    {
                        (popup.actionType && (DetailHelpInfo.careHelpInfo00 || helpInfo.length > 1 )) && Utils.isEmpty(popup.title) &&
                        <div className="headerTabWrap">
                            <ul className="popupWrap__tab" role="tablist">
                                {renderTab}
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
                                <div className='popupWrap__tit'>
                                    <h2 className="popupWrap__tit--help">
                                        <mark>{helpInfo[position].title}</mark>
                                    </h2>
                                    <p className='line3' dangerouslySetInnerHTML={{__html: Dompurify.sanitize(helpInfo[position].content)}}/>
                                </div>
                            </div>
                                <div className="btnWrap mt40">
                                    <button 
                                        type="button" 
                                        className="btnColor"
                                        onClick={()=> popup.action(popup.actionType)}
                                    >확인</button>
                                </div>
                        </div>
                    }
                    </div>
                </div>
        </>
    )
}

export default ExplanationRoomPopup;
