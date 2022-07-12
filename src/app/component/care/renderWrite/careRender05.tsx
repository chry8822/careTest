import React, { useMemo } from 'react';
import { CareType } from '../common/types';
import * as Utils from '../../../constants/utils'
import { useDispatch } from 'react-redux';
import Popup from '../../common/popup';
import { hidePopup, showPopup } from '../../../redux/actions/popup/popup';
import ExplanationRoomPopup from '../../care/popup/help'

interface CareRender00Props {
    registerData: CareType;
    setData: (data: any) => void;
}

const CareRender05 = ({ registerData, setData }: CareRender00Props) => {

    const dispatch = useDispatch()

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
    };


    
    //##################################################################################################################
    //##
    //## >> Method : Render
    //##
    //##################################################################################################################


    
    /**
     * 렌더링 마비/거동 상태 체크박스 텍스트
     * -----------------------------------------------------------------------------------------------------------------
     */
    const checkRenderContent: any[] = [
        {
            paralysis: "전신마비",
            behavior: "스스로 가능합니다."
        },
        {
            paralysis: "편마비",
            behavior: "부축이 필요합니다."
        },
        {
            paralysis: "없음",
            behavior: "불가능합니다."
        },
    ]


    /**
     * 렌더링 마비/거동 상태
     * -----------------------------------------------------------------------------------------------------------------
     */
    const renderTest = (type?: any) => {
        let html: any[] = [];
        for (let idx = 0; idx < 3; idx++) {
            html.push(
                type === "test" ?
                    <li className="radioSelect__box" key={Math.random()}>
                        <input
                            type="radio"
                            id={`paralysis0${idx + 2}`}
                            name={`paralysis0${idx + 2}`}
                            checked={registerData.paralysis === idx + 1}
                            onChange={() =>
                                setData({ paralysis: idx + 1 })
                            }
                        />
                        <label
                            htmlFor={`paralysis0${idx + 2}`}
                        >
                            {checkRenderContent[idx].paralysis}
                        </label>
                    </li>
                    :
                    <li className="radioSelect__box" key={Math.random()}>
                        <input
                            type="radio"
                            id={`behavior0${idx + 2}`}
                            name={`behavior0${idx + 2}`}
                            checked={registerData.move === idx + 1}
                            onChange={() =>
                                setData({ move: idx + 1 })
                            }
                        />
                        <label
                            htmlFor={`behavior0${idx + 2}`}
                        >
                            {checkRenderContent[idx].behavior}
                        </label>
                    </li>
            );
        }
        return html
    }

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################
    return (
        <>
            <section className="select">
                <div className="select__list breakLine">
                    <div className="select__list--totalTit">
                        <h3 className="txtStyle03-txtBrown">환자 상세 정보 입력</h3>
                        <span>2/7</span>
                    </div>
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자의 마비상태는 어떤가요?</h4>
                        </div>
                        <figure>
                            <img src="/images/paralysis01.svg" alt="마비상태" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        {renderTest("test")}
                    </ul>
                    <button
                        type="button"
                        className="select__list--help"
                        onClick={() => 
                            dispatch(showPopup({ element: ExplanationRoomPopup, action: popupAction, type: "bottomPopup", actionType: "careHelpInfo02" }))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list breakLine">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자의 거동상태는 어떤가요?</h4>
                        </div>
                        <figure>
                            <img src="/images/behavior01.svg" alt="거동상태" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        {renderTest()}
                    </ul>
                    <button
                        type="button"
                        className="select__list--help"
                        onClick={() => 
                            dispatch(showPopup({ element: ExplanationRoomPopup, action: popupAction, type: "bottomPopup", actionType: "careHelpInfo03" }))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">욕창 환자인가요?</h4>
                        </div>
                        <figure>
                            <img src="/images/pressure01.svg" alt="욕창" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="pressure01" 
                                name="pressure" 
                                checked={registerData.changePosture === 1}
                                onChange={()=> {
                                    setData({changePosture: 1})
                                }}    
                            />
                            <label htmlFor="pressure01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="pressure02" 
                                name="pressure" 
                                checked={registerData.changePosture === 2}
                                onChange={()=> {
                                    setData({changePosture: 2})
                                }}    
                            />
                            <label htmlFor="pressure02">아니요</label>
                        </li>
                    </ul>
                    <button
                        type="button"
                        className="select__list--help"
                        onClick={() => 
                            dispatch(showPopup({ element: ExplanationRoomPopup, action: popupAction, type: "bottomPopup", actionType: "careHelpInfo04" }))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
            </section>
        </>
    )
}

export default CareRender05;