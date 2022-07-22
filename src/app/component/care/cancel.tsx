import React,{ useState, useMemo } from 'react'
import Header from '../common/header';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../common/popup';
import { showPopup, hidePopup } from '../../redux/actions/popup/popup';
import { useDispatch } from 'react-redux';
import Api from '../../api/api';
import * as Utils from '../../constants/utils'
import CancelPopup from './popup/cancelPopup';


const CareExtendCancel = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getParams = useParams();
    
    const [jobId] = useState<number>(Number(getParams.jobId) || 0)
    const [deletedType,setDeletedType] = useState<number>(0)
    const [commissionNoticeFlag, setCommissionNoticeFlag] = useState<boolean>(false)
    const [status] = useState<number>(Number(getParams.status) || 0)
    const reasonCancel:any[] = [
        "환자 상태/간병일정이 변경 되었어요",
        "그냥 취소하고 싶어요(단순변심)",
        "지원한 케어메이트가 별로에요",
        "케어메이트와 연락이 되지 않아요",
        "이미 케어메이트를 구했어요",
        "코로나 검사로 인해 취소해요",
        "환자가 퇴원했어요",
        "환자가 작고(사망)하셨어요",
        "간병장소가 변경되었어요",
        "가족이 간병할거에요",
        "케어메이트가 취소했어요",
        "기타"
    ]




    //##################################################################################################################
    //##
    //## >> Method : PopupAction
    //##
    //##################################################################################################################


    const popupAction = (type:any) => {
        dispatch(hidePopup())
        if(type === "complete"){
            navigate(-1)
        }else if(type === "cancel") {
            navigate("/job/list/process")
        }else if(type === "penaltyCancel"){
            careCancelApi()
        }
    }


    //##################################################################################################################
    //##
    //## >> Method : Private
    //##
    //##################################################################################################################

    const submitCheckReason = () => {
        if(deletedType <= 0) {
            dispatch(showPopup({element:Popup,action:popupAction,content:"간병 취소사유를 선택해주세요."}))
            return
        }else if(status <= 2){
            careDeleteApi();
        }else if(status > 2) {
            dispatch(showPopup({element:CancelPopup,action:popupAction,actionType:"penaltyCancel"}))
        }
    }


    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################


    const renderCheckReason = useMemo(() => {
        let html:any[] = [];
        reasonCancel.forEach((item:any, idx:any)=> {
            html.push(
                <li className="radioSelect__box">
                    <input 
                        type="radio" id={`cancelReques${idx + 1}`} 
                        name="cancelRequest" 
                        onChange={()=> setDeletedType(idx+1)}
                    />
                    <label htmlFor={`cancelReques${idx + 1}`}>{item}</label>
                </li>
            )
        })
        return html;
    },[])

    //##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################


    const careDeleteApi = () => {
        Api.jobDelete(jobId,deletedType).then((reponse:any) => {
            if(reponse.status === 200){
                let data = reponse.data;
                if(data.code === 200){
                    dispatch(showPopup({element:Popup,action:popupAction,actionType:"cancel"}))
                }else {
                    dispatch(showPopup({element:Popup,action:popupAction,content:data.massage,actionType:"complete"}))
                }
            }
        }).catch(err => {
            console.log(err)
            dispatch(showPopup({element:Popup,action:popupAction,actionType:"complete"}))
        })
    }


    const careCancelApi = () => {
        Api.jobCancel(jobId,deletedType).then((reponse:any) => {
            if(reponse.status === 200){
                let data = reponse.data;
                if(data.code === 200){
                    dispatch(showPopup({element:CancelPopup,action:popupAction,actionType:"cancel"}))
                }else {
                    dispatch(showPopup({element:Popup,action:popupAction,content:data.massage,actionType:"complete"}))
                }
            }
        }).catch(err => {
            console.log(err)
            dispatch(showPopup({element:Popup,action:popupAction,actionType:"complete"}))
        })
    }





    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################



    return (
        <>
            <Header
                historyBack={true}
                title="간병 취소"
            />
            <main id="content">
                <div className="subWrap">
                    <div className="subWrap__flex">
                        <div className="cancelRequest">
                            <h2 className="txtStyle03"><mark>간병 취소 사유가 무엇인가요?</mark></h2>
                            <ul className="radioSelect">
                                {renderCheckReason}
                            </ul>
                        </div>
                    </div>

                    <div className="noticeInfo">
                        <div className="noticeInfo__txt">
                            <h2>
                                <span>이용약관에 의거하여</span> 취소 수수료 정책<span
                                >이 적용되어 처리됩니다.</span
                                >
                            </h2>
                        </div>
                        <article className="noticeInfo__aco">
                            {/* <!--
                            버튼 오픈 시에는 mustRed on 추가 & mustRed__detail none 삭제
                            버튼 닫을 시에는 mustRed on 삭제 & mustRed__detail none 추가 
                             --> */}
                            <div className={`mustRed ${commissionNoticeFlag ? " on": ""}`}>
                                <button 
                                    id="careCanTit" 
                                    className="mustRed__tit" 
                                    aria-controls="careCanCon"
                                    onClick={()=>
                                        setCommissionNoticeFlag(!commissionNoticeFlag)
                                    }
                                >
                                    <span>필독</span>취소 수수료 및 취소 페널티 안내
                                </button>
                            </div>
                            <div
                                id="careCanCon"
                                role="region"
                                aria-labelledby="careCanTit"
                                className={`mustRed__detail ${commissionNoticeFlag ? "": " none"}`}
                            >
                                <p>
                                    회사는 보호자 회원과 케어메이트 회원 간의 안정적이고 건전한 전자상거래환경 조성을
                                    위하여 아래와 같이 취소 수수료 및 취소 페널티 제도를 운영합니다.
                                </p>
                                <p>
                                    ① 매칭된 간병이 시작되기 전, 또는 진행 중인 간병을 보호자 회원의 요청이나 보호자
                                    회원이 공고에 기재한 내용 (예시：간병 기간, 환자 상태, 간병 장소 등)이 사실과 다른
                                    것으로 밝혀져 해당 간병이 취소되는 경우, 회사는 보호자 회원에게 취소 수수료를
                                    부과합니다. 회사는 보호자 회원에게 부과된 취소 수수료 중 일부(PG 수수료, 위약금
                                    수수료, 기타 지출 등)를 제외한 나머지 금액을 케어메이트 회원에게 정산하며, 보호자
                                    회원에게는 취소 수수료가 차감된 금액으로 환불을 진행합니다. 간병 취소 요청 접수
                                    일시가 촉박할수록 취소 수수료가 증액되오니, 간병 일정을 잘 고려하여 진행해 주시기
                                    바랍니다.
                                </p>
                                <p>취소 수수료</p>
                                <ol>
                                    <li>매칭된 간병을 시작 일시 기준 3일 전에 취소하는 경우:취소 수수료 없음</li>
                                    <li>
                                        매칭된 간병을 시작 일시 기준 2일 전에 취소하는 경우 : 취소 수수료 10,000원
                                    </li>
                                    <li>
                                        매칭된 간병을 시작 일시 기준 1일 전에 취소하는 경우 : 취소 수수료 20,000원
                                    </li>
                                    <li>매칭된 간병을 시작 일시 기준 당일에 취소하는 경우 : 취소 수수료 30,000원</li>
                                </ol>
                                <p>진행 중인 간병의 간병 취소 요청 접수 일시 기준</p>
                                <ol>
                                    <li>케어메이트 회원에게 보장 된 간병 일이 3일 이상인 경우: 취소 수수료 없음</li>
                                    <li>
                                        케어메이트 회원에게 보장 된 간병 일이 2일 이상 3일 미만인 경우: 취소 수수료
                                        10,000원
                                    </li>
                                    <li>
                                        케어메이트 회원에게 보장 된 간병 일이 1일 이상 2일 미만인 경우: 취소 수수료
                                        20,000원
                                    </li>
                                    <li>
                                        케어메이트 회원에게 보장 된 간병 일이 1일 미만인 경우: 취소 수수료 30,000원
                                    </li>
                                </ol>
                                <p>
                                    단, 환자의 상태(위독, 사망, 퇴원 등) 또는 불가항력적으로 발생한 사건 및 사고에
                                    의해 발생한 취소 요청건에 한해서는 페널티 담당자의 결정으로 취소 수수료가 발생하지
                                    않을 수 있습니다.
                                </p>
                                <p>
                                    ② 회사는 필요하다고 판단되는 경우, 위에 명시 된 취소 수수료와 함께 보호자 회원의
                                    자격을 제한 및 정지시킬 수 있으며, 이로 인해 보호자 및 케어메이트 회원에게 발생한
                                    모든 책임과 손해에 대해서 회사는 면책함을 명시합니다.
                                </p>
                            </div>
                        </article>
                        <div className="btnWrap">
                            <button 
                                type="button" 
                                className="btnBorder"
                                onClick={()=>
                                    navigate(-1)
                                }
                            >돌아가기</button>
                            <button 
                                type="button" 
                                className={`btnColor ${deletedType <= 0 ? "disabled" : ""}`}
                                onClick={()=> submitCheckReason()} 
                            >{status <= 2 ? "간병 취소" : "간병 취소요청"}</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CareExtendCancel;