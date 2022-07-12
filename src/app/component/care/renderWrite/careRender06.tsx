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

const CareRender06 = ({ registerData, setData }: CareRender00Props) => {

    const dispatch = useDispatch()

    const changeCheckbox = (position:any) => {
        let { cognitive, cognitiveDeliriumEtc, cognitiveDementiaEtc   } = registerData;

        let power = Math.pow(2, position -1);

        setData({
            cognitive: position > 0 ? cognitive : 0,
            cognitiveDementiaEtc: ((cognitive & 1) > 0) ? cognitive = cognitive + ((cognitive & 1) > 0? power : -power) : "" ,
            cognitiveDeliriumEtc :((cognitive & 2) > 0) ? cognitive = cognitive + ((cognitive & 2) > 0? power : -power) : "" ,
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
                        <span>3/7</span>
                    </div>
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 의식이 있나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/consciousness01.svg" alt="의식" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="consciousness01" 
                                name="consciousness" 
                                checked={registerData.consciousness === 1}
                                onClick={()=> setData({consciousness : 1})}
                            />
                            <label htmlFor="consciousness01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="consciousness02" 
                                name="consciousness" 
                                checked={registerData.consciousness === 2}
                                onClick={()=> setData({consciousness : 2})}
                            />
                            <label htmlFor="consciousness02">아니오</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={() => dispatch(showPopup({element:ExplanationRoomPopup,action: popupAction, type: "bottomPopup", actionType: "careHelpInfo05"}))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list breakLine">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 인지장애가 있나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/recognition01.svg" alt="인지장애" />
                        </figure>
                        <em>(중복 선택 가능)</em>
                    </div>
                    <ul className="checkSelect">
                        <li className="checkSelect__box active">
                            <input 
                                type="checkbox" 
                                id="recognition01" 
                                name="recognition" 

                            />
                            <label htmlFor="recognition01">치매</label>
                            <textarea
                                placeholder="환자의 치매와 관련하여 참고해야 하는 것이 있다면 입력해주세요.(선택)"
                            ></textarea>
                        </li>
                        <li className="checkSelect__box active">
                            <input 
                                type="checkbox" 
                                id="recognition02" 
                                name="recognition" 
                                
                            />
                            <label htmlFor="recognition02">섬망</label>
                            <textarea
                                placeholder="환자의 섬망과 관련하여 참고해야 하는 것이 있다면 입력해주세요.(선택)"
                            ></textarea>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious03" 
                                name="recognition" 

                            />
                            <label htmlFor="infectious03">없음</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={() => dispatch(showPopup({element:ExplanationRoomPopup,action: popupAction, type: "bottomPopup", actionType: "careHelpInfo06"}))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 수면장애가 있나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/sleep01.svg" alt="수면장애" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className={`radioSelect__box  ${(registerData.somnipathy === 1) && " active"}`}>
                            <input 
                                type="radio" 
                                id="sleep01" 
                                name="sleep" 
                                checked={registerData.somnipathy === 1}
                                onChange={()=> {
                                    setData({somnipathy: 1})
                                }}
                            />
                            <label htmlFor="sleep01">네</label>
                            <textarea
                                placeholder="환자의 수면장애와 관련하여 참고해야 하는 것이 있다면 입력해주세요.(선택)"
                                value={registerData.somnipathy}
                                autoComplete="off"
                                onChange={(e) => {
                                    setData({ somnipathyEtc: e.target.value })
                                }}
                            ></textarea>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="sleep02" 
                                name="sleep" 
                                checked={registerData.somnipathy === 2}
                                onChange={()=> {
                                    setData({somnipathy: 2 ,somnipathyEtc: ""})
                                }}
                            />
                            <label htmlFor="sleep02">아니요</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={() => dispatch(showPopup({element:ExplanationRoomPopup,action: popupAction, type: "bottomPopup", actionType: "careHelpInfo07"}))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
            </section>
        </>
    )
}

export default CareRender06;