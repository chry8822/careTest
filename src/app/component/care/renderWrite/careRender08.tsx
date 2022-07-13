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

const CareRender08 = ({ registerData, setData }: CareRender00Props) => {

    const dispatch = useDispatch()

    /**
     * CheckBox Data 변경 (배변 활동)
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param position : checkBox Position
     */

    const changeCheckbox = (position: any) => {
        let { toiletType, toiletDiapersEtc, toiletLineEtc } = registerData;
        let power = Math.pow(2, position - 1);

        if (position === 1) {
            toiletType = toiletType + (!((toiletType & 1) > 0) ? power : -power)
        }
        if (position === 2) {
            toiletType = toiletType + (!((toiletType & 2) > 0) ? power : -power)
        }


        setData({
            toiletType: position > 0 ? toiletType : 0,
            toiletDiapersEtc: position === 0 ? "" : (toiletType & 1) > 0 ? toiletDiapersEtc : "",
            toiletLineEtc: position === 0 ? "" : (toiletType & 2) > 0 ? toiletLineEtc : ""
        })

    }


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


    /**
     * 환자 정보 입력 (식사 가능) rendering
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param type : result Type
     */


    const checkMealContent = [
        {
            content:"식사를 하지 않습니다."
        },
        {
            content:"네. 다만, 도움이 필요합니다."
        },
        {
            content:"네. 스스로 잘 드십니다."
        },
    ]

    const renderCheckMeal = () => {
        let html:any[] = [];
        let count = 3;
        checkMealContent.forEach((item:any, idx:any) => {
            html.push (
                <li className="radioSelect__box">
                    <input 
                        type="radio" 
                        id={`meal0${count - idx }`} 
                        name="meal" 
                        checked={registerData.eat === count - idx}
                        onChange={()=> setData(registerData.eat = count - idx) }
                    />
                    <label htmlFor={`meal0${count - idx}`} >{item.content}</label>
                </li>
            )
        })
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
                        <span>6/7</span>
                    </div>
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자 스스로 식사가 가능한가요?</h4>
                        </div>
                        <figure>
                            <img src="/images/meal01.svg" alt="식사" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        {renderCheckMeal()}
                    </ul>
                    <button
                        type="button"
                        className="select__list--help"
                        onClick={() =>
                            dispatch(showPopup({ element: ExplanationRoomPopup, action: popupAction, type: "bottomPopup", actionType: "careHelpInfo11" }))
                        }
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list breakLine">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 석션을 사용하나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/suction01.svg" alt="석션" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="suction01" 
                                name="suction" 
                                checked={registerData.suction === 1}
                                onChange={()=> setData({suction: 1})}
                            />
                            <label htmlFor="suction01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="suction02" 
                                name="suction" 
                                checked={registerData.suction === 2}
                                onChange={()=> setData({suction: 2})}
                            />
                            <label htmlFor="suction02">아니요</label>
                        </li>
                    </ul>
                    <button
                        type="button"
                        className="select__list--help"
                        onClick={() =>
                            dispatch(showPopup({ element: ExplanationRoomPopup, action: popupAction, type: "bottomPopup", actionType: "careHelpInfo12" }))
                        }
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 피딩을 사용하나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/feeding01.svg" alt="피딩" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="feeding01" 
                                name="feeding" 
                                checked={registerData.feeding === 1}
                                onChange={()=> setData({feeding: 1})}
                            />
                            <label htmlFor="feeding01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="feeding02" 
                                name="feeding" 
                                checked={registerData.feeding === 2}
                                onChange={()=> setData({feeding: 2})}    
                            />
                            <label htmlFor="feeding02">아니요</label>
                        </li>
                    </ul>
                    <button
                        type="button"
                        className="select__list--help"
                        onClick={() =>
                            dispatch(showPopup({ element: ExplanationRoomPopup, action: popupAction, type: "bottomPopup", actionType: "careHelpInfo13" }))
                        }
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
            </section>
        </>
    )
}

export default CareRender08;