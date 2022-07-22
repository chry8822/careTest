import React,{ useState, useEffect, useMemo } from 'react'
import Header from '../common/header';
import Api, { patientList } from '../../api/api'
import { useDispatch } from 'react-redux';
import Popup from '../common/popup';
import { showPopup, hidePopup } from '../../redux/actions/popup/popup';
import { useNavigate } from 'react-router-dom';
import { maskingName } from './../../constants/utils';
import * as Utils from '../../constants/utils'
import moment from 'moment';

const CareFamily = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ familyList, setFamilyList ] = useState<any[]>([])
    const [ selectListItem, setSelectListItem ] = useState<number>(0)

    useEffect(() => {
        window.scrollTo(0,0);

        patientListApi()
    },[])



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
     * @param result : Object Data
     */
     const popupAction = (type: string, result?: any) => {
        dispatch(hidePopup());
    };


    //##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################




    /**
     * 가족 목록 리스트 조회 Api
     * -----------------------------------------------------------------------------------------------------------------
     */
     const patientListApi = () => {
        try {
            Api.patientList().then((response: any) => {
                if (response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        setFamilyList(data.data.list);
                    } else {
                        dispatch(showPopup({element:Popup,action:popupAction,content:data.massage}));
                    }
                } else {
                    dispatch(showPopup({element:Popup, action:popupAction}));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup, action:popupAction}));
            });
        } catch (e) {
            dispatch(showPopup({element:Popup, action:popupAction}));
        }
    };


    /**
     * 가족 목록 리스트 Rendering (등록한 가족 렌더링만- 상세로 이동해서 등록 안됨)
     * -----------------------------------------------------------------------------------------------------------------
     */
    const renderPatientList = useMemo(() => {
        let html:any[] = [];
        familyList.forEach((item:any, idx:number) => {
            html.push(
                <li className="radioSelect__box">
                    <div className="radioSelect__box--inputWrap">
                        <input 
                            type="radio" 
                            id={`patientSelet0${idx + 1}`}
                            name="patientSelet" 
                            checked={selectListItem === idx + 1} 
                            // checked
                            onChange={()=> setSelectListItem(idx + 1)}
                            />
                        <label htmlFor={`patientSelet0${idx + 1}`}>
                            {
                                Utils.maskingName(item.patient_name) 
                            }
                            <span>
                                {
                                    moment(item.updated_at ? item.updated_at : new Date()).format("YY.MM.DD")
                                }
                            </span>
                        </label>
                        <div className="patientSelet__radio--btn">
                            <button 
                                type="button"
                                // onClick={() => {}}
                                >보기</button>
                        </div>
                    </div>
                </li>
            )
        }) 
        return html;
    },[familyList,selectListItem])


    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    

    return (
        <>
            <Header
                historyBack={true}
                title="가족 목록"
            />
            <main id="content">
                <div className="subWrap">
                    <div className="subWrap__flex">
                        <article className="patientSelet">
                            <div className="patientSelet__tit">
                                <h2 className="txtStyle02"><mark>환자 정보를 선택해 주세요!</mark></h2>
                                <p className="txtStyle04-C333">공고를 더 빠르고 간편하게 등록할 수 있어요.</p>
                            </div>
                            <div className="patientSelet__btn">
                                <button 
                                    type="button" 
                                    className="arrowBtn"
                                    onClick={()=>{
                                        navigate("/care/select")
                                    }}
                                >신규 환자 등록하기</button>
                            </div>
                            <ul className="patientSelet__radio">
                            {/* input 없을 때 : radioSelect__box--inputWrap noRadio */}
                            {renderPatientList}
                            </ul>
                        </article>
                    </div>
                    <div className="noticeInfo">
                        <div className="noticeInfo__txt">
                            <h2>보호자의 환자 상태 고지 의무</h2>
                            <p className="dash">
                                환자 본인이 아닌 보호자 회원이 환자의 개인정보를 제공하는 경우, 해당 보호자 회원은
                                환자와 관련된 정보의 입력을 환자 본인으로부터 명시적으로 위임 받았거나 정보의 입력에
                                대한 정당한 대리권을 보유하고 있어야 합니다.
                            </p>
                            <p className="dash">
                                보호자는 환자 상태에 대해서 케어메이트에게 정확히 고지해야 합니다. 정확히 고지하지
                                않는 경우, 케어메이트은 간병을 거부할 수 있습니다.
                            </p>
                            <p className="dash">
                                개인정보 보호를 위해 환자의 이름 중 일부는 별표 처리(ex. 홍*동)됩니다. 최소 간병
                                시작 1시간 전에는 케어메이트에게 연락하시어, 환자의 전체 이름을 알려주세요.
                            </p>
                        </div>
                        <div className="btnWrap">
                            <button 
                                type="button" 
                                className={`btnColor ${selectListItem <= 0 && " disabled"}`}
                                disabled={selectListItem <= 0}
                                onClick={()=>{
                                }}
                            >다음</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CareFamily;