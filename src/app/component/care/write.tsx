import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Header from '../common/header';
import { setCare } from "../../redux/actions/care/care";
import { CareType } from './common/types'
import { RootState } from '../../redux/store';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import * as LocalStorage from '../../constants/localStorage'
import Popup from '../common/popup';
import { hidePopup, showPopup } from '../../redux/actions/popup/popup';
import Api from '../../api/api'
import * as Utils from '../../constants/utils'
import RenderCare01 from './renderWrite/careRender01'

const formatDate: string = "YYYY-MM-DD";
const formatTime: string = "HH:mm";
const formatHourTime: string = "HH:00";

const CareWrite = () => {

    const careData: CareType = useSelector((state: RootState) => state.care); //## 공고 등록/수정 데이터

    const getParam = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [detailPlaceType] = useState<string>(getParam.type || "register")
    const [step, setStep] = useState<number>(Number(getParam.step) || 0);   //## 간병 공고 등록/수정 단계
    const [editData, setEditData] = useState<CareType>(careData);                    //## 수정 공고 데이터
    const [requestType] = useState<string>(getParam.place || "");           //## 간병장소 (hospital / home)
    const [familyId] = useState<number>(Number(getParam.familyId) || 0);    //## 선택한 가족 ID
    const [jobType] = useState<string>(getParam.time || "");                //## 시간기간제, 기간제 확인 변수
    const [jobId] = useState<number>(Number(getParam.jobId) || 0);          //## 수정 중인 공고 ID


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


    /**
     * 공고 등록 데이터 변경 시 호출
     * -----------------------------------------------------------------------------------------------------------------
     */
         useEffect(() => {
            if (step === 1) {
                //### 간병 기간 수정 시 유효성 검사 체크
                careTimeValidationCheck();
            }
            if (detailPlaceType === "register") {
                let jobj: any = {
                    ...careData,
                    // detailType: detailType,
                    jobType: jobType,
                    requestType: requestType,
                    familyId: familyId,
                    step: step
                };
                LocalStorage.setStorage(LocalStorage.LOAD_WRITE_DATA, JSON.stringify(jobj));
            }
        }, [careData]);

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
     * Validation Check  (코로나 검사 유/무)
     * -----------------------------------------------------------------------------------------------------------------
     */

    const coronaValidationCheck = () => {
        const { coronaCheck } = detailPlaceType === "edit" ? editData : careData;
        let checkMsg: string = "";

        if (coronaCheck === 0) {
            checkMsg = "코로나 검사 유무를 선택해주세요";
        }
        return checkMsg;
    }

    /**
     * Validation Check  (간병 시간)
     * -----------------------------------------------------------------------------------------------------------------
     */
    const careTimeValidationCheck = () => {
        const {startDate, startTime, endDate, endTime, selectDate} = detailPlaceType === "edit" ? editData : careData;
        let checkMsg: string = "";

        let tempTimeFormat = "HH:mm:ss";

        let dateStart = Utils.convertDateToString(startDate) + ' ' + moment(startTime, tempTimeFormat).format(tempTimeFormat);
        let dateEnd = Utils.convertDateToString(endDate) + ' ' + moment(endTime, tempTimeFormat).format(tempTimeFormat);

        let curDateTime = new Date().getTime();
        let startDateTime = new Date(dateStart.replace(" ", "T")).getTime();
        let endDateTime = new Date(dateEnd.replace(" ", "T")).getTime();
        let betweenDay = (endDateTime - startDateTime) / 1000 / 60 / 60 / 24;

        let tempEndTime = moment(endTime, formatTime).format(formatTime).split(":");

        if (curDateTime > startDateTime) {
            checkMsg = `시작 시간(${Utils.convertDateToString(startDate)} ${moment(startTime, formatTime).format(formatTime)})이 이미 지났습니다.\n다시 설정해 주세요`;
        } else if ((jobType === "day" && startDateTime > endDateTime)) {
            checkMsg = `종료 시간은 시작 시간(${Utils.convertDateToString(startDate)} ${moment(startTime, formatTime).format(formatTime)}) 이후여야합니다.\n다시 설정해 주세요.`;
        } else if (jobType === "day" && betweenDay < 1) {
            checkMsg = '간병기간은 24시간 이상부터 신청가능합니다.'
        }
        if (Utils.isEmpty(checkMsg) && jobType === "time" && (selectDate && selectDate.length < 1)) {
            checkMsg = '간병 날짜를 선택해주세요.'
        }
        if (Utils.isEmpty(checkMsg) && (Number(tempEndTime[0]) >= 21 || Number(tempEndTime[0]) <= 6)) {
            checkMsg = '오후 9시부터 새벽 6시까지는\n간병 종료 시간으로 설정할 수 없습니다.';
        }

        return checkMsg;
    }

  /**
     * Validation Check  (환자 정보 입력)
     * -----------------------------------------------------------------------------------------------------------------
     */

    const patientInfoValidationMsg = () => {

        const {name, gender, age, height, weight, diagnosis} = detailPlaceType === "edit" ? editData : careData;
        let checkMsg:string ="";
        if(Utils.isEmpty(name)) {
            checkMsg = "이름을 입력해주세요."
        }else if(name.length < 2) {
            checkMsg = "이름은 두글자 이상 입력해주셔야 합니다.";
        }else if(Utils.notHangulCheck(name, true)) {
            checkMsg ="이름은 한글만 입력하실 수 있습니다."
        } else if (gender === 0) {
            checkMsg = "성별을 선택해주세요.";
        } else if(Utils.isEmpty(age)) {
            checkMsg ="나이를 입력해주세요."
        }else if(!Utils.isNumber(age)) {
            checkMsg ="나이는 숫자만 입력하실 수 있습니다."
        }else if(Utils.isEmpty(height)) {
            checkMsg ="키를 입력해주세요."
        }else if(!Utils.isNumber(height)) {
            checkMsg ="키는 숫자만 입력하실 수 있습니다."
        }
        else if(Utils.isEmpty(weight)) {
            checkMsg ="몸무게를 입력해주세요."
        }else if(!Utils.isNumber(weight)) {
            checkMsg ="몸무게는 숫자만 입력하실 수 있습니다."
        }else if(Utils.isEmpty(diagnosis)) {
            checkMsg ="진단명을 입력해주세요."
        }else if (diagnosis) {
            badwordsCheck([diagnosis], ["진단명"]);
            return "badwordsCheck";
        }

        return checkMsg;
    }


    /**
     * Validation Check  (환자 병신 선택)
     * -----------------------------------------------------------------------------------------------------------------
     */

    const sickRoomValidationMsg = () => {
        const{ sickroomType } = detailPlaceType === "edit" ? editData : careData;
        let checkMsg:string ="";
        if(sickroomType <= 0) {
            checkMsg = "환자의 병실을 선택해주세요."
        }
        return checkMsg;
    }

    
    /**
     * Validation Check  (감염성 질환 정보 입력)
     * -----------------------------------------------------------------------------------------------------------------
     */
     const infectiousCheckValidationMsg = () => {
        const {infectiousDiseaseEtc,infectiousDisease } = detailPlaceType === "edit" ? editData : careData;
        let checkMsg:string ="";
        if(infectiousDisease === 64 || 0) {
            checkMsg = "감염성 질환을 선택해주세요."
        }else if((infectiousDisease & 32) > 0 && Utils.isEmpty(infectiousDiseaseEtc)) {
            checkMsg = "감염성 질환 기타 사유를 입력해주세요.";
        }

        return checkMsg;
    }

    /**
     * Validation Check  (마비/ 거동 상태 정보)
     * -----------------------------------------------------------------------------------------------------------------
     */

    const behaviorCheckValidationMsg = () => {
        const {move, paralysis, changePosture } = detailPlaceType === "edit" ? editData : careData;
        let checkMsg:string ="";
        if(paralysis <= 0) {
            checkMsg = "마비 상태를 선택해주세요."
        }else if(move <= 0) {
            checkMsg = "거동 기능 상태를 선택해주세요."
        }else if(changePosture <= 0) {
            checkMsg = "욕창 유/무를 선택해주세요."
        }

        return checkMsg;
    }

    /**
     * Validation Check  (의식/ 인지장애 상태 정보)
     * -----------------------------------------------------------------------------------------------------------------
     */

        const cognitiveCheckValidationMsg = () => {
        const {consciousness ,cognitive,somnipathy } = detailPlaceType === "edit" ? editData : careData;
        let checkMsg:string ="";
        if(consciousness <= 0) {
            checkMsg = "의식 상태를 선택해주세요."
        }else if(cognitive === 4){
            checkMsg = "인지장애를 선택해주세요."
        }else if(somnipathy <= 0){
            checkMsg = "수면장애 유/무를 선택해주세요."
        }

        return checkMsg;
    }


    
    /**
     * Validation Check  (화장실 이동/ 배변도구 및 장루 상태 정보)
     * -----------------------------------------------------------------------------------------------------------------
     */

     const toiletCheckValidationMsg = () => {
        let {moveToilet, toiletType, stoma }= detailPlaceType === "edit" ? editData : careData;
        let checkMsg:string ="";
        if(moveToilet <= 0) {
            checkMsg = "화장실 이용 유/무를 선택해주세요."
        }else if(toiletType === 4){
            checkMsg = "배변도구를 선택해주세요."
        }else if(stoma <= 0){
            checkMsg = "장루설치 유/무를 선택해주세요."
        }

        return checkMsg;
    }


        
    /**
     * Validation Check  (화장실 이동/ 배변도구 및 장루 상태 정보)
     * -----------------------------------------------------------------------------------------------------------------
     */

     const eatConditionCheckValidationMsg = () => {
        let {eat, suction, feeding }= detailPlaceType === "edit" ? editData : careData;
        let checkMsg:string ="";
        if(eat <= 0) {
            checkMsg = "식사 가능 상태를 선택해주세요."
        }else if(suction <= 0){
            checkMsg = "석션 사용 유/무 선택해주세요."
        }else if(feeding <= 0){
            checkMsg = "피딩 사용 유/무를 선택해주세요."
        }

        return checkMsg;
    }


    /**
     * Validation Check  (화장실 이동/ 배변도구 및 장루 상태 정보)
     * -----------------------------------------------------------------------------------------------------------------
     */

         const rehabilitateCheckValidationMsg = () => {
            let {rehabilitate, dialysis, favoriteGender, isWantUniform }= detailPlaceType === "edit" ? editData : careData;
            let checkMsg:string ="";
            if(rehabilitate <= 0) {
                checkMsg = "재활 유/무 선택해주세요."
            }else if(dialysis <= 0){
                checkMsg = "투석 유/무 선택해주세요."
            }else if(favoriteGender <= 0){
                checkMsg = "우대하는 케어메이트 성별을 선택해주세요."
            }else if(Utils.isEmpty(isWantUniform)){
                checkMsg = "선호하는 케어메이트 복장을 선택해주세요."
            }
    
            return checkMsg;
        }
    






    /**
     * 금칙어 Check
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param words: 금칙어 체크 문자열 배열
     * @param careWord: 금칙어 체크 문자열 텍스트 배열
     */
         const badwordsCheck = (words: any[], careWord: any[]) => {
            let data = {
                words: words[0]
            };
    
            Utils.badwordsCheckApi(data, function (flag: boolean, badWords?: string[]) {
                if (flag) {
                    words.shift();
                    careWord.shift();
                    if (words.length > 0) {
                        badwordsCheck(words, careWord);
                    } else {
                        setNextStep();
                    }
                } else {
                    if (badWords) {
                        let badWord: string = `(${badWords.join(", ")})`;
                        let msg: string = `${careWord[0]}에 금칙어${badWord}가 포함되어 있습니다.`;
                        dispatch(showPopup({element:Popup, action:popupAction,content:msg}));
                    } else {
                        dispatch(showPopup({element:Popup, action:popupAction}));
                    }
                }
            });
        };


    /**
    * 이전 버튼 
    * -----------------------------------------------------------------------------------------------------------------
    */
    const prevStep = () => {
        if (step === 0 || detailPlaceType === "edit") {
            navigate(-1)
        } else {
            let moveStep: number;
            moveStep = (requestType === "home" && step === 4) ? step - 2 : step - 1;
            let paramFamilyId = familyId > 0 ? `/${familyId}` : "";
            navigate(`/care/write/register/${moveStep}/${jobType}/${requestType}${paramFamilyId}`, {replace: true});
            setStep(moveStep);
        }
        
    }


    /**
     * 다음 버튼 
     * -----------------------------------------------------------------------------------------------------------------
     */
    let validationCheckMsg: string ; //### 유효성 검사 메시지
    const moveNextStep = () => {
        // new Funtion 으로 대체 안됨 ( 대체시 호출하는 함수를 찾지 못함 )
        if(step === 0){
            validationCheckMsg = coronaValidationCheck();
        } else if(step === 1) {
            validationCheckMsg = careTimeValidationCheck();
        } else if(step === 2) {
            validationCheckMsg = patientInfoValidationMsg();
        } else if(step === 3) {
            validationCheckMsg = sickRoomValidationMsg();
        } else if(step === 4) {
            validationCheckMsg = infectiousCheckValidationMsg();
        } else if(step === 5) {
            validationCheckMsg = behaviorCheckValidationMsg();
        } else if(step === 6) {
            validationCheckMsg = cognitiveCheckValidationMsg();
        } else if(step === 7) {
            validationCheckMsg = toiletCheckValidationMsg();
        } else if(step === 8) {
            validationCheckMsg = eatConditionCheckValidationMsg();
        } else if(step === 9) {
            validationCheckMsg = rehabilitateCheckValidationMsg();
        }

        if (validationCheckMsg) {
            if (validationCheckMsg === "badwordsCheck") {
                return
            }
            dispatch(showPopup({ element: Popup, action: popupAction ,content: validationCheckMsg }))
        } else {
            if (step === 2) { //# [이름/성별/나이/몸무게] 입력 후 다음 버튼
                if (jobType === "day") { //# 기간제
                    if (requestType === "hospital") { //# 병원
                        Utils.adjustEvent("17l0yu");
                        Utils.analyticsEvent("care_dhos_p1");
                    } else { //# 집
                        Utils.adjustEvent("jchglk");
                        Utils.analyticsEvent("care_dhom_p1");
                    }
                } else { //# 시간제
                    if (requestType === "hospital") { //# 병원
                        Utils.adjustEvent("rwg1ju");
                        Utils.analyticsEvent("care_thos_p1");
                    } else { //# 집
                        Utils.adjustEvent("uuyplk");
                        Utils.analyticsEvent("care_thom_p1");
                    }
                }
            } else if (step === 5) { //# [마비/거동/욕창] 입력 후 다음 버튼
                if (jobType === "day") { //# 기간제
                    if (requestType === "hospital") { //# 병원
                        Utils.adjustEvent("6rvsio");
                        Utils.analyticsEvent("care_dhos_p2");
                    } else { //# 집
                        Utils.adjustEvent("2ai4tb");
                        Utils.analyticsEvent("care_dhom_p2");
                    }
                } else { //# 시간제
                    if (requestType === "hospital") { //# 병원
                        Utils.adjustEvent("y2nnx6");
                        Utils.analyticsEvent("care_thos_p2");
                    } else { //# 집
                        Utils.adjustEvent("66927b");
                        Utils.analyticsEvent("care_thom_p2");
                    }
                }
            } else if (step === 9) { //# [재활치료/투석치료/우대간병인성별] 입력 후 다음 버튼
                if (jobType === "day") { //# 기간제
                    if (requestType === "hospital") { //# 병원
                        Utils.adjustEvent("15vokz");
                        Utils.analyticsEvent("care_dhos_p3");
                    } else { //# 집
                        Utils.adjustEvent("bwnpnq");
                        Utils.analyticsEvent("care_dhom_p3");
                    }
                } else { //# 시간제
                    if (requestType === "hospital") { //# 병원
                        Utils.adjustEvent("40miwj");
                        Utils.analyticsEvent("care_thos_p3");
                    } else { //# 집
                        Utils.adjustEvent("ct7xl9");
                        Utils.analyticsEvent("care_thom_p3");
                    }
                }
            }

            setNextStep();

        }
    }

      /**
     * 다음 버튼 
     * -----------------------------------------------------------------------------------------------------------------
     */
    
    const setNextStep = () => {
        if(detailPlaceType === "edit") {
            dispatch(setCare({
                ...editData
            }));
        }

        if ((step === 9 || detailPlaceType === "edit") || (familyId > 0 && step === (requestType === "hospital" ? 3 : 1))){
            let paramType: string = jobId > 0 ? "edit" : "register";
            navigate(`/care/detail/${paramType}/${jobType}/${requestType}/${familyId}/${jobId}`);
        } else {
            let moveStep: number;
            moveStep = (requestType === "home" && step === 2) ? step + 2 : step + 1;
            setStep(moveStep);
            navigate(`/care/write/register/${moveStep}/${jobType}/${requestType}/${familyId}`, {replace: true})
        }


    }


   



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
                        dispatch(showPopup({ element: Popup, action: popupAction, type: "popup", content: data.message }));
                    }
                } else {
                    dispatch(showPopup({ element: Popup, action: popupAction, actionType: "complete" }));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({ element: Popup, action: popupAction, actionType: "complete" }));
            });
        } catch (e) {
            dispatch(showPopup({ element: Popup, action: popupAction, actionType: "complete" }));
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
    // 동적으로 컴포넌트를 호출 해서 불필요한 코드를 초기에 로드 하지 않는다
    // 0 ~ 9 까지 컴포넌트가 있고 필요한 컴포넌트만 import
    const RenderCare = useMemo(() => {
        return lazy(() => import(`./renderWrite/careRender0${step}`));
    }, [step]);

    /**
     * 하단 안내문 
     * -----------------------------------------------------------------------------------------------------------------
     */

    const renderBottomNotice = useMemo(() => {
        if (step === 0) {
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
        } else if (step === 1) {
            return (
                <>
                    {/* <div className="noticeInfo__agree">
                        <div className="noticeInfo__agree--tit">
                            <h2 className="txtStyle03">
                            개인정보 제3자 제공 동의서<span className="txtRed">필수</span>
                            </h2>
                            <a href="" className="secession">보기</a>
                        </div>
                        <div className="checkSelect__box">
                            <input type="checkbox" id="noticeAgree" name="noticeAgree" />
                            <label htmlFor="noticeAgree" className="mb0">네, 동의합니다.</label>
                        </div>
                    </div> */}
                    <div className="noticeInfo__txt">
                        <h2>선택 이후에 간병기간이 변동 된다면?</h2>
                        <p>
                            선택 이후에 간병기간이 변동되는 경우, 선택 된 간병인에게 고지하신 후에 케어네이션
                            고객센터(1811 - 5949)로 접수해 주시기 바랍니다.
                        </p>
                    </div>
                </>
            )
        } else if (step === 2) {
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
    }, [step])


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

                        {
                            step === 1 ?
                            <RenderCare01 
                                registerData={detailPlaceType === "register" ? careData : editData} 
                                setData={setData} 
                                jobType={jobType} 
                                careTimeCheckMsg={careTimeValidationCheck()} />
                            :
                            <Suspense fallback={null}>
                                <RenderCare 
                                    registerData={detailPlaceType === "register" ? careData : editData} 
                                    setData={setData} />
                            </Suspense>
                        }



                    </div>
                    {
                        // 스탭 3 이상부터 하단 알림글 없음
                        step < 3 ?
                            <div className="noticeInfo">
                                {renderBottomNotice}
                                <div className="btnWrap">
                                    <button type="button" className="btnBorder" onClick={prevStep}>이전</button>
                                    <button type="button" className="btnColor" onClick={moveNextStep}>{detailPlaceType === "register" ? "다음" : "적용"}</button>
                                </div>
                            </div>
                            :
                            <div className="btnWrap">
                                <button type="button" className="btnBorder" onClick={prevStep}>이전</button>
                                <button type="button" className="btnColor" onClick={moveNextStep}>{detailPlaceType === "register" ? "다음" : "적용"}</button>
                            </div>
                    }


                </div>
            </main>
        </>
    )
}

export default CareWrite;