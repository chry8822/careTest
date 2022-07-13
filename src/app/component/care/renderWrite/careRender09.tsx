import React from 'react';
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

const CareRender09 = ({ registerData, setData }: CareRender00Props) => {

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
        if (type === "overText") { //# 30자 초과시 뒤에서 한글자 삭제
            setData({ diagnosis: registerData.diagnosis.substring(0, 29) })
        }
    };

    console.log(registerData.diagnosis)

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
                        <span>1/6</span>
                    </div>
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 재활 치료 중인가요?</h4>
                        </div>
                        <figure>
                            <img src="/images/rehabilitation01.svg" alt="재활 치료" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="rehabilitation01" 
                                name="rehabilitation" 
                                checked={registerData.rehabilitate === 1}
                                onChange={()=> setData({rehabilitate:1})}
                            />
                            <label htmlFor="rehabilitation01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input
                                type="radio" 
                                id="rehabilitation02" 
                                name="rehabilitation" 
                                checked={registerData.rehabilitate === 2}
                                onChange={()=> setData({rehabilitate:2})}
                            />
                            <label htmlFor="rehabilitation02">아니요</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={() => dispatch(showPopup({element:ExplanationRoomPopup,action: popupAction, type: "bottomPopup", actionType: "careHelpInfo14"}))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list breakLine">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 투석 치료를 받고있나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/dialysis01.svg" alt="투석" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="dialysis01" 
                                name="dialysis" 
                                checked={registerData.dialysis === 1}
                                onChange={()=> setData({dialysis:1})}
                            />
                            <label htmlFor="dialysis01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="dialysis02" 
                                name="dialysis" 
                                checked={registerData.dialysis === 2}
                                onChange={()=> setData({dialysis:2})}
                            />
                            <label htmlFor="dialysis02">아니요</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={() => dispatch(showPopup({element:ExplanationRoomPopup,action: popupAction, type: "bottomPopup", actionType: "careHelpInfo15"}))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list breakLine">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">우대하는 케어메이트 성별</h4>
                        </div>
                        <figure>
                            <img src="/images/gender01.svg" alt="성별" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="gender01" 
                                name="gender" 
                                checked={registerData.favoriteGender === 1}
                                onChange={()=> setData({favoriteGender:1})}
                            />
                            <label htmlFor="gender01">남자</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="gender02" 
                                name="gender" 
                                checked={registerData.favoriteGender === 2}
                                onChange={()=> setData({favoriteGender:2})}
                            />
                            <label htmlFor="gender02">여자</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="gender03" 
                                name="gender" 
                                checked={registerData.favoriteGender === 3}
                                onChange={()=> setData({favoriteGender:3})}
                            />
                            <label htmlFor="gender03">상관없음</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={() => dispatch(showPopup({element:ExplanationRoomPopup,action: popupAction, type: "bottomPopup", actionType: "careHelpInfo16"}))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list breakLine">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">선호하는 케어메이트 복장을 알려주세요.</h4>
                        </div>
                        <figure>
                            <img src="/images/uniform.svg" alt="유니폼 착용여부" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="uniform01" 
                                name="uniform" 
                                checked={registerData.isWantUniform === "Y"}
                                onChange={()=> setData({isWantUniform:"Y"})}
                            />
                            <label htmlFor="uniform01">케어네이션 유니폼</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="uniform02" 
                                name="uniform" 
                                checked={registerData.isWantUniform === "N"}
                                onChange={()=> setData({isWantUniform:"N"})}
                            />
                            <label htmlFor="uniform02">자유복장(상관없음)</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={() => dispatch(showPopup({element:ExplanationRoomPopup,action: popupAction, type: "bottomPopup", actionType: "careHelpInfo17"}))}
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list">
                    <div className="select__list--detailTit">
                        <div>
                            <h4 className="txtStyle03">
                                간병 유의사항
                                <span>선택</span>
                            </h4>
                        </div>
                    </div>
                    <textarea
                        className="select__list--textarea"
                        placeholder="간병 유의사항을 작성해 주세요. (30자 이내)"
                        autoComplete='off'
                        onChange={(e)=> setData({hospitalizeReason: e.target.value})}
                        value={registerData.hospitalizeReason || ""}
                    ></textarea>
                </div>
            </section>
        </>
    )
}

export default CareRender09;