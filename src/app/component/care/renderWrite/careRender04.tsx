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

const CareRender04 = ({ registerData, setData }: CareRender00Props) => {
    const dispatch = useDispatch()

    /**
     * CheckBox Data 변경 (감염성 질환)
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param position : checkBox Position
     */

    const changeCheckbox = (position: number) => {
        let { infectiousDisease, infectiousDiseaseEtc } = registerData;
        const diseaseCheckArr = [
            infectiousDisease === 0,
            (infectiousDisease & 1) > 0,
            (infectiousDisease & 2) > 0,
            (infectiousDisease & 4) > 0,
            (infectiousDisease & 8) > 0,
            (infectiousDisease & 16) > 0,
            (infectiousDisease & 32) > 0,
        ];

        const toggleValue = Math.pow(2, position - 1);
        infectiousDisease = infectiousDisease + (!diseaseCheckArr[position]? toggleValue : -toggleValue);

        setData({
            infectiousDisease: position > 0 ? infectiousDisease : 0,
            infectiousDiseaseEtc: position === 0 ? "" : (infectiousDisease & 32) > 0 ? infectiousDiseaseEtc : ""
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
                <div className="select__list">
                    <div className="select__list--totalTit">
                        <h3 className="txtStyle03-txtBrown">환자 상세 정보 입력</h3>
                        <span>2/7</span>
                    </div>
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 감염성 질환을 앓고 있나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/infectious01.svg" alt="감염성 질환" />
                        </figure>
                        <em>(중복 선택 가능)</em>
                    </div>
                    <ul className="checkSelect">
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious01" 
                                name="infectious" 
                                checked={registerData.infectiousDisease === 0}
                                onChange={()=> changeCheckbox(0)}
                            />
                          
                            <label htmlFor="infectious01">없음</label>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious02" 
                                name="infectious" 
                                checked={(registerData.infectiousDisease & 1) > 0}
                                onChange={()=> changeCheckbox(1)}
                            />
                            <label htmlFor="infectious02">VRE</label>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious03" 
                                name="infectious" 
                                checked={(registerData.infectiousDisease & 2) > 0}
                                onChange={()=> changeCheckbox(2)}
                            />
                            <label htmlFor="infectious03">CRE</label>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious04" 
                                name="infectious" 
                                checked={(registerData.infectiousDisease & 4) > 0}
                                onChange={()=> changeCheckbox(3)}
                            />
                            <label htmlFor="infectious04">결핵</label>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious05" 
                                name="infectious" 
                                checked={(registerData.infectiousDisease & 8) > 0}
                                onChange={()=> changeCheckbox(4)}
                            />
                            <label htmlFor="infectious05">옴</label>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious06" 
                                name="infectious" 
                                checked={(registerData.infectiousDisease & 16) > 0}
                                onChange={()=> changeCheckbox(5)}
                            />
                            <label htmlFor="infectious06">독감</label>
                        </li>

                        {/* <!-- 기타 선택시 active 추가 --> */}
                        <li className={`checkSelect__box ${((registerData.infectiousDisease & 32) > 0) && " active"}`}>
                            <input 
                                type="checkbox" 
                                id="infectious07" 
                                name="infectious" 
                                checked={(registerData.infectiousDisease & 32) > 0}
                                onChange={()=> changeCheckbox(6)}
                            />
                            <label htmlFor="infectious07">기타</label>
                            <textarea 
                                placeholder="병명과 참고사항을 입력해주세요"
                                value={registerData.infectiousDiseaseEtc || ""}
                                autoComplete="off"
                                onChange={(e) => setData({
                                    infectiousDiseaseEtc: e.target.value
                                })}
                            ></textarea>
                        </li>

                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={()=>
                            dispatch(showPopup({element:ExplanationRoomPopup,action:popupAction,type:"bottomPopup",actionType:"careHelpInfo01"}))
                        }
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
            </section>
        </>
    )
}

export default CareRender04;