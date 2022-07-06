import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../common/header';
import {setCare} from "../../redux/actions/care/care";
import { CareType } from './common/types'
import { RootState } from '../../redux/store';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import moment from 'moment';
import * as LocalStorage from '../../constants/localStorage'
import Popup from '../common/popup';
import { hidePopup, showPopup } from '../../redux/actions/popup/popup';
import Api from '../../api/api'

const formatDate: string = "YYYY-MM-DD";
const formatTime: string = "HH:mm";
const formatHourTime: string = "HH:00";

const CareWrite = () => {

    const careData: CareType = useSelector((state: RootState) => state.care); //## 공고 등록/수정 데이터

    const getParam = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ detailPlaceType ] = useState<string>(getParam.type || "register")
    const [step, setStep] = useState<number>(Number(getParam.step) || 0);   //## 간병 공고 등록/수정 단계
    const [editData, setEditData] = useState<CareType>(careData);                    //## 수정 공고 데이터
    const [requestType] = useState<string>(getParam.place || "");           //## 간병장소 (hospital / home)
    const [familyId] = useState<number>(Number(getParam.familyId) || 0);    //## 선택한 가족 ID
    const [jobType] = useState<string>(getParam.time || "");                //## 시간기간제, 기간제 확인 변수
    
    
    //##################################################################################################################
    //##
    //## >> Method : Override
    //##
    //##################################################################################################################

    useEffect(() => {
        if (detailPlaceType === "register") { //# 공고 등록
            window.scrollTo(0, 0);

            //## 공고 불러오기
            let tempLoadWriteData = LocalStorage.getStorage(LocalStorage.LOAD_WRITE_DATA);
            // console.log("tempLoadWriteData",tempLoadWriteData)
            if (tempLoadWriteData) {
                let jsonLoadWriteData = JSON.parse(tempLoadWriteData);
                delete jsonLoadWriteData.step;

                dispatch(setCare({
                    ...jsonLoadWriteData
                }));
            } else {
                if (familyId > 0) { //## 등록된 환자 선택 후 공고 등록 진행 시
                    patientDetailApi(familyId); //## 선택한 환자 정보 API 호출
                }
                //## 공고데이터 초기값 설정
                dispatch(setCare({
                    requestType: requestType,
                    jobType: jobType,
                    familyId: familyId,
                    startDate: moment().format(formatDate),
                    startTime: moment(moment().subtract(-1, "hours")).format(formatHourTime),
                    endDate: jobType === "day" ? moment(moment().add(7, "days")).format(formatDate) : moment().format(formatDate),
                    endTime: moment(moment().subtract((jobType === "day" ? -1 : -2), "hours")).format(formatHourTime),
                    selectDate: moment().format(formatDate),
                }));
            }
        } else { //# 공고 수정
            if (step === 2) {
                setEditData({
                    ...editData,
                    name: ""
                });
            }
        }

        // socket = new SocketIO("");
        // return () => {
        //     if (socket != null) {
        //         socket.viewStay();
        //     }
        // }
    }, []);

    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################

    /**
     * Data 변경
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param data : change register Data
     */
     const setData = (data: any) => {
        if (detailPlaceType === "register") { //## 공고 등록 시
            dispatch(setCare({
                ...data
            }));
        } else { //## 공고 수정 시
            setEditData({
                ...editData,
                ...data
            });
        }
    };

    /**
     * 이전 버튼 
     * -----------------------------------------------------------------------------------------------------------------
     */
    const prevStep = () => {
        if (step === 0 || detailPlaceType === "edit" ) {
            navigate(-1)
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

        if (type === "complete") {
            navigate(-1)
        }
    };

    //##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################

    /**
     * 공고 상세 정보 API
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param familyId : 선택한 가족 ID
     */
     const patientDetailApi = (familyId: number) => {
        try {
            Api.patientDetail(familyId).then((response: any) => {
                if (response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        // 상세 정보 업데이트
                        dispatch(setCare({
                            familyId: familyId,
                            name: data.data.patients.patient_name,
                            gender: data.data.patients.patient_gender,
                            weight: data.data.patients.patient_weight,
                            height: data.data.patients.patient_height,
                            age: data.data.patients.patient_age,
                            paralysis: data.data.patients.ability_paralysis,
                            consciousness: data.data.patients.ability_consciousness,
                            cognitive: data.data.patients.ability_cognitive,
                            cognitiveDementiaEtc: data.data.patients.cognitive_dementia_etc,
                            cognitiveDeliriumEtc: data.data.patients.cognitive_delirium_etc,
                            moveToilet: data.data.patients.ability_move_toilet,
                            moveToiletEtc: data.data.patients.move_toilet_etc,
                            stoma: data.data.patients.ability_stoma,
                            somnipathy: data.data.patients.ability_somnipathy,
                            somnipathyEtc: data.data.patients.somnipathy_etc,
                            suction: data.data.patients.ability_suction,
                            rehabilitate: data.data.patients.ability_rehabilitate,
                            dialysis: data.data.patients.ability_dialysis,
                            changePosture: data.data.patients.ability_change_posture,
                            move: data.data.patients.ability_move,
                            eat: data.data.patients.ability_eat,
                            feeding: data.data.patients.ability_feeding,
                            toiletType: data.data.patients.ability_toilet,
                            toiletDiapersEtc: data.data.patients.toilet_diapers_etc,
                            toiletLineEtc: data.data.patients.toilet_line_etc,
                            favoriteGender: data.data.patients.favorite_gender,
                            hospitalizeReason: data.data.patients.reason,
                            infectiousDisease: data.data.patients.ability_infectious_disease,
                            infectiousDiseaseEtc: data.data.patients.infectious_disease_etc,
                            diagnosis: data.data.patients.diagnosis,
                            isWantUniform: data.data.patients.is_want_uniform
                        }));
                    } else {
                        dispatch(showPopup({element:Popup,action:popupAction,type:"popup",content:data.message}));
                    }
                } else {
                    dispatch(showPopup({element:Popup,action:popupAction,actionType:"complete"}));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup,action:popupAction,actionType:"complete"}));
            });
        } catch (e) {
            dispatch(showPopup({element:Popup,action:popupAction,actionType:"complete"}));
        }
    };

    //##################################################################################################################
    //##
    //## >> Method : Render
    //##
    //##################################################################################################################

    /**
     * Register Family Component Dynamic Importing
     * -----------------------------------------------------------------------------------------------------------------
     */
    const RenderCare = useMemo(() => {
        return lazy(() => import(`./renderWrite/careRender0${step}`));
    }, [step]);

    /**
     * 하단 안내문 
     * -----------------------------------------------------------------------------------------------------------------
     */

    const renderBottomNotice = useMemo(() => {
        if(step === 0){
            return (
                <div className="noticeInfo__txt">
                    <h2>코로나 19 검사 비용</h2>
                    <p>일반적으로 코로나 검사 비용은 아래와 같이 처리되고 있습니다.</p>
                    <ol>
                        <li>케어메이트의 개인 돈으로 코로나 검사 우선 진행</li>
                        <li>음성 결과 확인 후, 보호자님에게 현금으로 현장수금</li>
                    </ol>
                </div>
            )
        }else if(step === 1 ){
            return (
                <div className="noticeInfo__txt">
                    <h2>선택 이후에 간병기간이 변동 된다면?</h2>
                    <p>
                        선택 이후에 간병기간이 변동되는 경우, 선택 된 간병인에게 고지하신 후에 케어네이션
                        고객센터(1811 - 5949)로 접수해 주시기 바랍니다.
                    </p>
                </div>
            )
        }else if(step === 2){
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
        }
    },[step]) 
    
    console.log("renderBottomNotice",renderBottomNotice)

    return (
        <>
            <Header
                historyBack={true}
                title="공고 등록"
            />
            <main id="content">
                <div className="subWrap">
                    <div className="subWrap__flex">


                        {/* 공고 작성 단계 (컴포넌트로 빼야됨) */}
                        <section className="noticeRegister breakLine">
                            <div className="commonWrap">
                                <h2 className="a11y-hidden">공고 작성 단계</h2>
                                <ul className="noticeRegister__step">
                                    {/* <!-- 해당되는 step에 li에 active 추가되고 해당 스텝이 완료 되면 li에 check로 변경 --> */}
                                    <li className="check">장소 선택</li>
                                    <li className="active">공고 작성</li>
                                    <li className="">대기</li>
                                </ul>
                            </div>
                        </section>


                        {/* 단계 마다 렌더되는 컴포넌트 */}
                        <Suspense fallback={null}>
                            <RenderCare registerData={detailPlaceType === "register"? careData : editData} setData={setData}/>
                        </Suspense>



                    </div>
                    {
                        // 스탭 3 이상부터 하단 알림글 없음
                        step < 3 ?
                        <div className="noticeInfo">
                            { renderBottomNotice }
                            <div className="btnWrap">
                                <button type="button" className="btnBorder" onClick={prevStep}>이전</button>
                                <button type="button" className="btnColor">다음</button>
                            </div>
                        </div>
                        :
                        <div className="btnWrap">
                            <button type="button" className="btnBorder" onClick={prevStep}>이전</button>
                            <button type="button" className="btnColor">다음</button>
                        </div>
                    }


                </div>
            </main>
        </>
    )
}

export default CareWrite;