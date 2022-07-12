import React from 'react';
import { CareType } from '../common/types';
import * as Utils from '../../../constants/utils'
import { useDispatch } from 'react-redux';
import Popup from '../../common/popup';
import { hidePopup, showPopup } from '../../../redux/actions/popup/popup';

interface CareRender00Props {
    registerData: CareType;
    setData: (data: any) => void;
}

const CareRender02 = ({ registerData, setData }: CareRender00Props) => {

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
        if(type === "overText"){ //# 30자 초과시 뒤에서 한글자 삭제
            setData({diagnosis : registerData.diagnosis.substring(0,29) })
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
                <div className="select__list">
                    <div className="select__list--totalTit">
                        <h3 className="txtStyle03-txtBrown">환자 정보 입력</h3>
                    </div>
                    <ul className="basicInput">
                        <li className="basicInput__txt">
                            <label htmlFor="name">이름</label>
                            <div className="basicInput__txt--form">
                                <div className={
                                    `inputWrap__box ${registerData.name && Utils.notHangulCheck(registerData.name) && " wrong"}`}
                                >
                                    <input 
                                        type="text" 
                                        id="name" 
                                        placeholder="환자 이름을 입력하세요." 
                                        maxLength={16}
                                        autoComplete="off"
                                        onKeyPress={Utils.enterKeyPress}
                                        value={registerData.name}
                                        onChange={(e) => setData({name: e.target.value})}
                                    />
                                    {
                                        registerData.name &&
                                        <button 
                                            type="reset" 
                                            className="resetBtn"
                                            onClick={() => setData({name: ""})}    
                                        >리셋</button>
                                    }

                                </div>
                            </div>
                            {
                                registerData.name && Utils.notHangulCheck(registerData.name) ? 
                                <em>한글만 입력하실 수 있습니다.</em> :
                                ""
                            }
                        </li>
                        <li className="basicInput__txt">
                            <label>성별</label>
                            <ul className="radioSelect mt0">
                                <li className="radioSelect__border">
                                    <input 
                                        type="radio" 
                                        id="gender01" 
                                        name="gender" 
                                        checked={registerData.gender === 1}
                                        onChange={()=> setData({gender : 1})}
                                    />
                                    <label htmlFor="gender01">남자</label>
                                </li>
                                <li className="radioSelect__border">
                                    <input 
                                        type="radio" 
                                        id="gender02" 
                                        name="gender" 
                                        checked={registerData.gender === 2}
                                        onChange={()=> setData({gender : 2})}    
                                    />
                                    <label htmlFor="gender02">여자</label>
                                </li>
                            </ul>
                        </li>
                        <li className="basicInput__txt">
                            <label htmlFor="age">나이</label>
                            <div className="basicInput__txt--form">
                               <div className={
                                    `inputWrap__box ${registerData.age && !Utils.isNumber(registerData.age) && " wrong"}`}
                                >
                                    <input 
                                        type="text" 
                                        id="age" 
                                        placeholder="환자 나이를 입력하세요." 
                                        inputMode='numeric'
                                        maxLength={3}
                                        autoComplete='off'
                                        value={registerData.age}
                                        onKeyPress={Utils.enterKeyPress}
                                        onChange={(e)=> setData({age: e.target.value})}
                                    />
                                    {
                                        registerData.age &&
                                        <button 
                                            type="reset" 
                                            className="resetBtn"
                                            onClick={() => setData({age: ""})}    
                                        >리셋</button>
                                    }
                                </div>
                                <small className="basicInput__txt--label">세</small>
                            </div>
                                {
                                    registerData.age && !Utils.isNumber(registerData.age) ? 
                                    <em>숫자만 입력하실 수 있습니다.</em> :
                                    ""
                                }
                        </li>
                        <li className="basicInput__txt">
                            <label htmlFor="height">키</label>
                            <div className="basicInput__txt--form">
                                <div className={
                                        `inputWrap__box ${registerData.height && !Utils.isNumber(registerData.height) && " wrong"}`}
                                >
                                    <input 
                                        type="text" 
                                        id="height" 
                                        placeholder="환자 키를 입력하세요." 
                                        maxLength={3}
                                        autoComplete='off'
                                        value={registerData.height}
                                        onKeyPress={Utils.enterKeyPress}
                                        onChange={(e)=> setData({height: e.target.value})}
                                    />
                                    {
                                        registerData.height &&
                                        <button 
                                            type="reset" 
                                            className="resetBtn"
                                            onClick={() => setData({height: ""})}    
                                        >리셋</button>
                                    }
                                </div>
                                <small className="basicInput__txt--label">cm</small>
                            </div>
                                {
                                    registerData.height && !Utils.isNumber(registerData.height) ? 
                                    <em>숫자만 입력하실 수 있습니다.</em> :
                                    ""
                                }
                        </li>
                        <li className="basicInput__txt">
                            <label htmlFor="weight">몸무게</label>
                            <div className="basicInput__txt--form">
                                <div className={
                                    `inputWrap__box ${registerData.weight && !Utils.isNumber(registerData.weight) && " wrong"}`}
                                >
                                    <input 
                                        type="text" 
                                        id="weight" 
                                        placeholder="환자 몸무게를 입력하세요." 
                                        autoComplete='off'
                                        value={registerData.weight}
                                        onKeyPress={Utils.enterKeyPress}
                                        onChange={(e)=> setData({weight: e.target.value})}   
                                    />
                                      {
                                        registerData.weight &&
                                        <button 
                                            type="reset" 
                                            className="resetBtn"
                                            onClick={() => setData({weight: ""})}    
                                        >리셋</button>
                                    }
                                </div>
                                <small className="basicInput__txt--label">kg</small>
                            </div>
                            {
                                registerData.weight && !Utils.isNumber(registerData.weight) ? 
                                <em>숫자만 입력하실 수 있습니다.</em> :
                                ""
                            }
                        </li>
                        <li className="basicInput__txt">
                            <label htmlFor="diagnosis">진단명</label>
                            <textarea
                                id="diagnosis"
                                placeholder="진단명을 입력하세요."
                                value={registerData.diagnosis || ""}
                                autoComplete="off"
                                onChange={(e) => 
                                    registerData.diagnosis.length < 30 ?
                                    setData({diagnosis: e.target.value})
                                    :
                                    dispatch(showPopup({element:Popup,content:"진단명은 30자를 초과 할수 없습니다.",action:popupAction,actionType:"overText"}))
                                }
                            ></textarea>
                        </li>
                    </ul>
                </div>
            </section>

        </>
    )
}

export default CareRender02;