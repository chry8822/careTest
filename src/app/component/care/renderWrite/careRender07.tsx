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

const CareRender07 = ({ registerData, setData }: CareRender00Props) => {

    const dispatch = useDispatch()

    /**
     * CheckBox Data 변경 (배변 활동)
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param position : checkBox Position
     */

    const changeCheckbox = (position:any) => {
        let {toiletType, toiletDiapersEtc, toiletLineEtc} = registerData;
        let power = Math.pow(2, position -1);
    
        if(position === 1){
            toiletType = toiletType + (!((toiletType & 1) > 0) ? power : -power)
        }
        if(position === 2){
            toiletType = toiletType + (!((toiletType & 2) > 0) ? power : -power)
        }


        setData({
            toiletType: position > 0 ? toiletType : 0,
            toiletDiapersEtc : position === 0 ? "" : (toiletType & 1) > 0 ? toiletDiapersEtc : "",
            toiletLineEtc : position === 0 ? "" : (toiletType & 2) > 0 ? toiletLineEtc : ""
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
                        <span>5/7</span>
                    </div>
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 화장실 이동을 할 수있나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/washroom01.svg" alt="화장실" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="washroom01" 
                                name="washroom" 
                                checked={registerData.moveToilet === 3}
                                onChange={()=> setData({moveToilet : 3, moveToiletEtc: ""})}
                            />
                            <label htmlFor="washroom01">화장실을 이용하지 않습니다.</label>
                        </li>
                        {/* <!-- input checked 시에 checkSelect__box active 추가--> */}
                        <li className={`radioSelect__box ${registerData.moveToilet === 2 && " active"} `}>
                            <input 
                                type="radio" 
                                id="washroom02" 
                                name="washroom" 
                                checked={registerData.moveToilet === 2}
                                onChange={()=> setData({moveToilet : 2})}    
                            />
                            <label htmlFor="washroom02">네. 다만, 부축이 필요합니다.</label>
                            <textarea
                                placeholder="환자의 화장실 이용과 관련하여 참고해야 하는 것이 있다면 입력해주세요. (선택)"
                                onChange={(e)=> setData({ moveToiletEtc: e.target.value })}
                                value={registerData.moveToiletEtc || ""}
                                autoComplete="off"
                            ></textarea>
                        </li>
                        {/* <!-- input checked 시에 checkSelect__box active 추가--> */}
                        <li className={`radioSelect__box ${registerData.moveToilet === 1 && " active"} `}>
                            <input 
                                type="radio" 
                                id="washroom03" 
                                name="washroom" 
                                checked={registerData.moveToilet === 1} 
                                onChange={()=> setData({moveToilet : 1})}    
                            />
                            <label htmlFor="washroom03">네. 스스로 잘 이용하십니다.</label>
                            <textarea
                                placeholder="환자의 화장실 이용과 관련하여 참고해야 하는 것이 있다면 입력해주세요. (선택)"
                                onChange={(e)=> setData({ moveToiletEtc: e.target.value })}
                                value={registerData.moveToiletEtc || ""}
                                autoComplete="off"
                            ></textarea>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={()=> 
                            dispatch(showPopup({element:ExplanationRoomPopup,action:popupAction,type:"bottomPopup",actionType:"careHelpInfo08"}))
                        }
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list breakLine">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 사용 중인 배변도구는 무엇인가요?</h4>
                        </div>
                        <figure>
                            <img src="/images/tool01.svg" alt="배변도구" />
                        </figure>
                        <em>(중복 선택 가능)</em>
                    </div>
                    <ul className="checkSelect">
                        {/* <!-- input checked 시에 checkSelect__box active 추가--> */}
                        <li className={`checkSelect__box  ${(registerData.toiletType & 1) > 0 && "active"} `}>
                            <input 
                                type="checkbox" 
                                id="tool01" 
                                name="tool"
                                checked={(registerData.toiletType & 1) > 0}
                                onChange={() => changeCheckbox(1)}    
                            />
                            <label htmlFor="tool01">기저귀</label>
                            <textarea
                                placeholder="환자의 배변 도구 사용과 관련하여 참고해야 하는 것이 있다면 입력해주세요. (선택)"
                                autoComplete="off"
                                onChange={(e)=> setData({ toiletDiapersEtc: e.target.value })}
                                value={registerData.toiletDiapersEtc || ""}
                            ></textarea>
                        </li>
                        {/* <!-- input checked 시에 checkSelect__box active 추가--> */}
                        <li className={`checkSelect__box  ${(registerData.toiletType & 2) > 0 && "active"} `}>
                            <input 
                                type="checkbox" 
                                id="tool02" 
                                name="tool" 
                                checked={(registerData.toiletType & 2) > 0}
                                onChange={() => changeCheckbox(2)}  
                            />
                            <label htmlFor="tool02">소변줄</label>
                            <textarea
                                placeholder="환자의 배변 도구 사용과 관련하여 참고해야 하는 것이 있다면 입력해주세요. (선택)"
                                autoComplete="off"
                                onChange={(e)=> setData({ toiletLineEtc: e.target.value })}
                                value={registerData.toiletLineEtc || ""}
                            ></textarea>
                        </li>
                        <li className="checkSelect__box">
                            <input 
                                type="checkbox" 
                                id="tool03" 
                                name="tool" 
                                checked={registerData.toiletType === 0}    
                                onChange={()=> changeCheckbox(0)}
                            />
                            <label htmlFor="tool03">없음</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={()=> 
                            dispatch(showPopup({element:ExplanationRoomPopup,action:popupAction,type:"bottomPopup",actionType:"careHelpInfo09"}))
                        }
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
                <div className="select__list">
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자가 장루를 설치했나요?</h4>
                        </div>
                        <figure>
                            <img src="/images/ostomy01.svg" alt="장루" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="ostomy01" 
                                name="ostomy" 
                                checked={registerData.stoma === 1}
                                onChange={()=> setData({stoma: 1})}
                            />
                            <label htmlFor="ostomy01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input 
                                type="radio" 
                                id="ostomy02" 
                                name="ostomy" 
                                checked={registerData.stoma === 2}
                                onChange={()=> setData({stoma: 2})}
                            />
                            <label htmlFor="ostomy02">아니요</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={()=> 
                            dispatch(showPopup({element:ExplanationRoomPopup,action:popupAction,type:"bottomPopup",actionType:"careHelpInfo10"}))
                        }
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
            </section>
        </>
    )
}

export default CareRender07;