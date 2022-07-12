import React, {useState} from 'react';
import { CareType } from '../common/types';
import * as Utils from '../../../constants/utils'
import { useDispatch } from 'react-redux';
import Popup from '../../common/popup';
import { hidePopup, showPopup } from '../../../redux/actions/popup/popup';
import ExplanationRoomPopup from '../popup/help'

interface CareRender00Props {
    registerData: CareType;
    setData: (data: any) => void;
}

const CareRender04test = ({ registerData, setData }: CareRender00Props) => {
    const dispatch = useDispatch()

    const [ checked, setChecked ] = useState<boolean>(false) 
    const [ checkedNum, setCheckedNum ] = useState<any[]>([]) 

    const testChange = (e:any, id:any) => {
        setCheckedNum(checkedNum => [...checkedNum, checkedNum.push(`infectious0${id}`)])
        // let {infectiousDisease, infectiousDiseaseEtc} = registerData;
        const testArr = [
            checkedNum.includes(`infectious01`) && checked && e.target.checked,
            checkedNum.includes(`infectious02`) && checked && e.target.checked,
            checkedNum.includes(`infectious03`) && checked && e.target.checked,
        ]

        console.log(testArr)
        console.log(checkedNum)
        if(checkedNum.includes(`infectious0${id}`)){
          testArr.filter((i) => i !== `infectious0${id}`)
        }else {
            testArr.concat(`infectious0${id}`)
        }
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
                                checked={checkedNum.includes(`infectious01`)}
                                onChange={(e) => {
                                    testChange(e.target.checked, 1)
                                }}
                            />
                          
                            <label htmlFor="infectious01">오국화</label>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious02" 
                                name="infectious" 
                                checked={checkedNum.includes(`infectious02`)}
                                onChange={(e) => {
                                    testChange(e.target.checked, 2)
                                }}
                            />
                            <label htmlFor="infectious02">VRE</label>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="infectious03" 
                                name="infectious" 
                                checked={checkedNum.includes(`infectious03`)}
                                onChange={(e) => {
                                    testChange(e.target.checked, 3)
                                }}
                            />
                            <label htmlFor="infectious03">CRE</label>
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

export default CareRender04test;