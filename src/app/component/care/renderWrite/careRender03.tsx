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

const CareRender03 = ({ registerData, setData }: CareRender00Props) => {

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
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################
    return (
        <>
            <section className="select">
                <div className="select__list">
                    <div className="select__list--totalTit">
                        <h3 className="txtStyle03-txtBrown">환자 상세 정보 입력</h3>
                        <span>1/6</span>
                    </div>
                    <div className="select__list--detailTit">
                        <div>
                            <span>Q1</span>
                            <h4 className="txtStyle03">환자의 병실을 선택해주세요.</h4>
                        </div>
                        <figure>
                            <img src="/images/sickRoom01.svg" alt="병실" />
                        </figure>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            {/* <!-- 팝업에 나오는 이미지는 id 값과 동일합니다. --> */}
                            <input type="radio" id="sickRoom01" name="sickRoom" />
                            <label htmlFor="sickRoom01">일반실</label>
                        </li>
                        <li className="radioSelect__box">
                            <input type="radio" id="sickRoom02" name="sickRoom" />
                            <label htmlFor="sickRoom02">응급실</label>
                        </li>
                        <li className="radioSelect__box">
                            <input type="radio" id="sickRoom03" name="sickRoom" />
                            <label htmlFor="sickRoom03">중환자실</label>
                        </li>
                        <li className="radioSelect__box">
                            <input type="radio" id="sickRoom04" name="sickRoom" />
                            <label htmlFor="sickRoom04">격리병실</label>
                        </li>
                        <li className="radioSelect__box">
                            <input type="radio" id="sickRoom05" name="sickRoom" />
                            <label htmlFor="sickRoom05">폐쇄병실</label>
                        </li>
                    </ul>
                    <button 
                        type="button" 
                        className="select__list--help"
                        onClick={()=> 
                            dispatch(showPopup({element:ExplanationRoomPopup,type:"bottomPopup",actionType:"careHelpInfo00"}))
                        }    
                    >
                        설명이 필요하다면 눌러주세요!
                    </button>
                </div>
            </section>
        </>
    )
}

export default CareRender03;