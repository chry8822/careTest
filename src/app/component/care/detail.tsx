import React,{ useState, useEffect, useMemo } from 'react';
import Header from '../common/header';
import moment from 'moment'
import {useLocation, useNavigate, useParams, createSearchParams} from "react-router-dom";
import {CareType, AmountType} from "./common/types";
import * as Utils from '../../constants/utils'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store';
import Popup from '../common/popup';
import { showPopup, hidePopup } from '../../redux/actions/popup/popup';
import {setCare} from "../../redux/actions/care/care";
import Api from '../../api/api'
import * as LocalStorage from '../../constants/localStorage'
import * as CareUtils from '../care/common/careUtils'
import SocketIO from "../../constants/socket";
import RenderDayCalendar from './render/dayCareCalendar'
import * as HelpInfo from '../../component/care/popup/helpInfo'

let phone: string = "";
let userId: string = "";
let snsLoginType: string = "";

interface HelpInfoType {
    img: string;
    title: string;
    content: string;
}

const formatDate: string = "YYYY-MM-DD";
const formatTime: string = "HH:mm";
const formatHourTime: string = "HH:00";

let socket: SocketIO;
const CareDetail = () => {

    //### Query String
    const queryString = require('query-string');
    const parsed = queryString.parse(location.search);
    
    const careData: CareType = useSelector((state: RootState) => state.care); //## 공고 등록 스토어 데이터
    // console.log(careData.sickroomType)

    const getParam = useParams();
    const navigate = useNavigate();
    const dispatch =  useDispatch();

    
    const [detailType, setDetailType] = useState<string>(getParam.type || "register");    //## register / edit / view
    const [tabPosition, setTabPosition] = useState<number>(Utils.isEmpty(parsed.tab) ? 0 : Number(parsed.tab)); //## 탭 0: 간병 상세 /  1: 지원한 케어메이트, 결제 정보
    const [agreeCheck, setAgreeCheck] = useState<boolean>(false);  //## 개인정보 제3자 제공 동의서 이전 체크 유/무
    const [reFlag] = useState<boolean>(parsed.reFlag === "true" || false); //## 재등록 분기
    const [curDate, setCurDate] = useState<any>();                          //## 달력 날짜 데이터
    const [jobId] = useState<number>(Number(getParam.jobId) || 0); //## 수정 중인 공고 ID
    const [detailData, setDetailData] = useState<CareType>({ //## 공고 상세 데이터
        jobType: getParam.time || "day",
        requestType: getParam.place || "hospital",
        familyId: Number(getParam.familyId) || 0,
        startDate: moment().format(formatDate),
        startTime: moment(moment().subtract(-1, "hours")).format(formatHourTime),
        endDate: moment(moment().add(7, "days")).format(formatDate),
        endTime: moment(moment().subtract(-1, "hours")).format(formatHourTime),
        selectOption: 1,
        selectDate: "",
        coronaCheck: 0,
        favoriteGender: 0,
        name: "",
        gender: 0,
        age: "",
        height: "",
        weight: "",
        diagnosis: "",
        sickroomType: 0,
        infectiousDisease: 64,
        infectiousDiseaseEtc: "",
        move: 0,
        changePosture: 0,
        paralysis: 0,
        consciousness: 0,
        cognitive: 4,
        cognitiveDementiaEtc: "",
        cognitiveDeliriumEtc: "",
        somnipathy: 0,
        somnipathyEtc: "",
        moveToilet: 0,
        moveToiletEtc: "",
        toiletType: 4,
        toiletDiapersEtc: "",
        toiletLineEtc: "",
        stoma: 0,
        eat: 0,
        suction: 0,
        feeding: 0,
        rehabilitate: 0,
        dialysis: 0,
        hospitalizeReason: "",
        isWantUniform: "N",
        hospitalId: 0,
        info: "",
        detail: "",
        address: "",
        addressNameArr: "",
        lat: 0,
        lon: 0,
        hosCode: "",
        locCode: "",
        siCode: "",
        guCode: ""
    });
    const [amountData, setAmountData] = useState<AmountType>({ //## 계산 된 간병비 데이터
        amountDay: 0,
        amountDayFee: 0,
        amountTime: 0,
        amountTimeFee: 0,
        total: 0,
        totalFee: 0
    });
    const [jobStatus, setJobStatus] = useState<any>({
        status: 0,          //## 공고 진행 상태
        cancelStatus: "N",  //## 공고 취소 상태
        payment: null,      //## 공고 결제 상태
        users: [],          //## 지원한 케어메이트 / 결제 케어메이트
        totalCgsCnt: 0,     //## 총 케어메이트 수
        graphData: null,    //## 그래프 데이터
        relayPtrJobId: 0,   //## 간병 연장 대상 공고 Id
        insurance: null
    });
    const [calrendarDateFlag, setCalrendarDateFlag] = useState<any>({
        preFlag: false,
        nextFlag: false
    }) 

    //##################################################################################################################
    //##
    //## >> Override
    //##
    //##################################################################################################################

    useEffect(() => {
        //### 로컬 스토리지 데이터 삭제
        LocalStorage.remove(LocalStorage.IS_EXTEND_PAYMENT);

        if (detailType === "register") { //## 공고 등록
            if (detailData.jobType === "day") { //# 기간제
                if (detailData.requestType === "hospital") { //# 병원
                    Utils.adjustEvent("f8cf92");
                    Utils.analyticsEvent("care_dhos_sm");
                } else { //# 집
                    Utils.adjustEvent("pkfkjo");
                    Utils.analyticsEvent("care_dhom_sm");
                }
            } else { //# 시간제
                if (detailData.requestType === "hospital") { //# 병원
                    Utils.adjustEvent("slit8v");
                    Utils.analyticsEvent("care_thos_sm");
                } else { //# 집
                    Utils.adjustEvent("39mmp3");
                    Utils.analyticsEvent("care_thom_sm");
                }
            }

            userApi();
            let jobReCallFlag = LocalStorage.getStorage(LocalStorage.JOB_RE_CALL_FLAG);
            // if (reFlag && jobId > 0) {
            //     if (jobReCallFlag === "on" && tabPosition === 0) {
            //         LocalStorage.setStorage(LocalStorage.JOB_RE_CALL_FLAG, "off");
            //         dispatch(showPopup({element:Popup, action:popupAction}));
            //         // dispatch(showPopup({CareCallPopup, popupAction}));
            //     }
            //     careDetailApi("reFlag");
            // }
        } else if (detailType === "view" && jobId > 0) { //## 공고 상세
            careDetailApi();
        }

        if ((detailType === "register" || detailType === "edit") && careData) {
            if (careData.jobType === "day") {
                careCostGraphApi(careData);
            }
            //## 공고 등록 데이터 Set
            setDetailData({
                ...careData
            });
        }

        socket = new SocketIO("");
        return () => {
            if (socket != null) {
                socket.viewStay();
            }
        }
    }, []);

    

 //##################################################################################################################
    //##
    //## >> Method : Private
    //##
    //##################################################################################################################

    /**
     * 탭 변경 (간병 상세/ 지원한 케어메이트, 결제정보)
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param position : tab Position
     */
     const changeTab = (position: number) => {
        window.scrollTo(0, 0);

        navigate(`/care/detail/view/${detailData.jobType}/${detailData.requestType}/${detailData.familyId}/${jobId}?tab=${position}`);
    };

    /**
     * 수정하기 (페이지 이동)
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param position : 등록 단계 (step)
     */
    const editData = (position: number) => {
        const {jobType, requestType, familyId} = detailData;

        let step: number = position === 10 ? position - 1 : position;
        let paramReFlag: string = (Utils.isEmpty(reFlag) || !reFlag) ? "" : `?reFlag=true`;
        let scrollBottom: string = position === 10 ? "?scrollBottom=true" : "";

        window.scrollTo(0,0);

        if (position === -1) { //### 간병장소 수정
            navigate(`/care/place/edit/${jobType}/${requestType}/${familyId}/${reFlag ? 0 : jobId}${paramReFlag}`);
        } else {
            navigate(`/care/write/edit/${step}/${jobType}/${requestType}/${familyId}/${reFlag ? 0 : jobId}${paramReFlag}${scrollBottom}`);
        }
    };

   
    /**
     * Set Map
     * -----------------------------------------------------------------------------------------------------------------
     */
    const setMap = () => {
        // if (detailData.lat === 0 || detailData.lon === 0) {
        //     return;
        // }

        if (Utils.isEmpty(detailData) || Utils.isEmpty(detailData.lat) || Utils.isEmpty(detailData.lon)) {
            return;
        }

        const lat: number = Number(detailData.lat);
        const lon: number = Number(detailData.lon);
        let container = document.getElementById("map");
        let options = {
            center: new window.kakao.maps.LatLng(lat, lon),
            level: 4
        };

        let markerPosition = new window.kakao.maps.LatLng(lat, lon);

        let marker = new window.kakao.maps.Marker({
            position: markerPosition,
        });

        let map = new window.kakao.maps.Map(container, options);

        map.setDraggable(false);
        map.setZoomable(false);
        window.kakao.maps.event.addListener(map, 'dblclick', null);
        if (lat !== 37.504942) {
            marker.setMap(map);
        }

        window.scrollTo(0, 0);
    };

     /**
     * 공고 상세 탭 변경 시 호출
     * -----------------------------------------------------------------------------------------------------------------
     */
      useEffect(() => {
        window.scrollTo(0, 0);

        if (tabPosition === 0) { //## 지도 불러오기
            setMap();
        }
    }, [tabPosition]);
    
    
    /**
     * 공고 데이터 수정 시 호출
     * -----------------------------------------------------------------------------------------------------------------
     */
    useEffect(() => {
        setCurDate(moment(detailData.startDate));

        if (tabPosition === 0) { //## 지도 불러오기
            setMap();
        }
    }, [detailData]);


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

        if (type === "list") {
            navigate("/care/list?historyBackInterface=true");
        } else if (type === "reload") {
            navigate(0);
        } else if (type === "needValue") {
            editData(2);
        } else if (type === "needPlace") {
            editData(-1);
        // } else if (type === "saveFamily") { //## 작성한 환자 정보 저장
        //     submitFamily("register");
        // } else if (type === "saveCancel") {// ## 저장 안함
        //     careRegister(detailData.familyId);
        // }
        }
    };


    /**
     * 간병 달력 구분 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */

    const renderSelectCareCalrendar = () => {
        
    }
    //##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################

    /**
     * User 정보 Api
     * -----------------------------------------------------------------------------------------------------------------
     */
    const userApi = (status?: string) => {
        try {
            Api.userInfo().then((response: any) => {
                if (response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        phone = data.data.phone;
                        userId = data.data.id;
                        snsLoginType = data.data.type_social;
                        setAgreeCheck(data.data.privacy_agree === 1);
                    } else {
                        dispatch(showPopup({element:Popup,action:popupAction,content:data.messgae}));
                    }
                } else {
                    dispatch(showPopup({element:Popup,action:popupAction}));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup,action:popupAction}));
            });
        } catch (e) {
            dispatch(showPopup({element:Popup,action:popupAction}));
        }
    };



    /**
     * 공고 상세 정보 조회 Api
     * -----------------------------------------------------------------------------------------------------------------
     */
    const careDetailApi = (type?: string) => {
        try {
            Api.careDetail(jobId).then((response: any) => {
                if (response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        const diff = moment(data.data.job_end_date).diff(moment(data.data.job_start_date));
                        const diffDuration = moment.duration(diff);
                        const jobj: CareType = {
                            jobType: data.data.job_type === "term" ? "time" : data.data.job_type,
                            requestType: data.data.request_type,
                            familyId: data.data.ptr_patients_id ? data.data.ptr_patients_id : 0,
                            startDate: moment(data.data.job_start_date).format(formatDate),
                            startTime: moment(data.data.job_start_date).format(formatTime),
                            endDate: moment(data.data.job_end_date).format(formatDate),
                            endTime: moment(data.data.job_end_date).format(formatTime),
                            selectOption: data.job_type === "day" ? 0 : diffDuration.hours(),
                            selectDate: data.data.job_type === "day" ? "" : data.data.date_time_range,
                            coronaCheck: data.data.ability_corona,
                            favoriteGender: data.data.favorite_gender,
                            name: data.data.patient_name,
                            gender: data.data.patient_gender,
                            age: data.data.patient_age,
                            height: data.data.patient_height,
                            weight: data.data.patient_weight,
                            dialysis: data.data.ability_dialysis,
                            sickroomType: data.data.ability_sickroom_type,
                            infectiousDisease: data.data.ability_infectious_disease,
                            infectiousDiseaseEtc: data.data.infectious_disease_etc,
                            paralysis: data.data.ability_paralysis,
                            move: data.data.ability_move,
                            changePosture: data.data.ability_change_posture,
                            consciousness: data.data.ability_consciousness,
                            cognitive: data.data.ability_cognitive,
                            cognitiveDementiaEtc: data.data.cognitive_dementia_etc,
                            cognitiveDeliriumEtc: data.data.cognitive_delirium_etc,
                            somnipathy: data.data.ability_somnipathy,
                            somnipathyEtc: data.data.somnipathy_etc,
                            moveToilet: data.data.ability_move_toilet,
                            moveToiletEtc: data.data.move_toilet_etc,
                            toiletType: data.data.ability_toilet,
                            toiletDiapersEtc: data.data.toilet_diapers_etc,
                            toiletLineEtc: data.data.toilet_line_etc,
                            stoma: data.data.ability_stoma,
                            eat: data.data.ability_eat,
                            suction: data.data.ability_suction,
                            feeding: data.data.ability_feeding,
                            rehabilitate: data.data.ability_rehabilitate,
                            diagnosis: data.data.diagnosis,
                            hospitalizeReason: data.data.reason,
                            isWantUniform: data.data.is_want_uniform,
                            hospitalId: data.data.com_hospitals_id,
                            info: data.data.info,
                            detail: data.data.info_detail,
                            address: data.data.address,
                            addressNameArr: data.data.address,
                            lat: data.data.lat,
                            lon: data.data.lon,
                            hosCode: data.data.hos_code,
                            locCode: data.data.loc_code,
                            siCode: data.data.si_code,
                            guCode: data.data.gu_code
                        };
                        setDetailData({
                            ...jobj
                        });
                        if (type === "reFlag") { //## 재등록 시 데이터 Store Set
                            dispatch(setCare({
                                ...jobj
                            }));
                        } else { //### 상세 데이터 Set
                            setAmountData({
                                ...amountData,
                                amountDay: data.data.amount_day,
                                amountDayFee: data.data.amount_day_fee,
                                amountTime: data.data.amount_time,
                                amountTimeFee: data.data.amount_time_fee,
                                total: data.data.total,
                                totalFee: data.data.total_fee
                            });
                            setJobStatus({
                                ...jobStatus,
                                status: data.data.status,
                                cancelStatus: data.data.cancel_status,
                                payment: data.data.payment,
                                users: data.data.users,
                                totalCgsCnt: data.data.total_cgs_cnt ? data.data.total_cgs_cnt : 0,
                                graphData: data.data.data,
                                relayPtrJobId: data.data.relay_ptr_job_id,
                                insurance: data.data.insurance
                            });
                        }
                    } else {
                        dispatch(showPopup({element:Popup,action:popupAction,content:data.messgae}));
                    }
                } else {
                    dispatch(showPopup({element:Popup,action:popupAction}));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup,action:popupAction}));
            });
        } catch (e) {
            dispatch(showPopup({element:Popup,action:popupAction}));
        }
    };

      /**
     * 예상 간병비용 Api
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param item : Object Data
     */
       const careCostGraphApi = (item: any) => {
        let params = {
            ability_infectious_disease: item.infectiousDisease,
            ability_paralysis: item.paralysis,
            ability_change_posture: item.changePosture,
            ability_cognitive: item.cognitive,
            ability_somnipathy: item.somnipathy,
            ability_suction: item.suction,
            ability_feeding: item.feeding,
        };

        try {
            Api.jobGraph(params).then((response: any) => {
                if (response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        setJobStatus({
                            ...jobStatus,
                            graphData: data.data
                        });
                    } else {
                        dispatch(showPopup({element:Popup,action:popupAction,content:data.messgae}));
                    }
                } else {
                    dispatch(showPopup({element:Popup,action:popupAction}));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup,action:popupAction}));
            });
        } catch (e) {
            dispatch(showPopup({element:Popup,action:popupAction}));
        }
    };

console.log("jobStatus.status",detailData.jobType)

    
    /**
     * 간병 달력 구분 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */
     const renderCareCalendar = () => {
        const {jobType, startDate} = detailData;

        return (
                <>
                    <div className="announcementTime__careType">
                        <p className="txtStyle05">*간병유형은 수정할 수 없습니다.</p>
                        <dl className="announcementTime__careType--detail">
                            <dt>{jobType === "day" ? "기간" : "시간"}제 간병</dt>
                            <dd>
                                {
                                    jobType === "day" ?
                                        "24시간 이상의 간병이 필요해요."
                                        :
                                        "신청한 시간에만 간병하러 와주세요."
                                }
                            </dd>
                        </dl>
                    </div>
                    <div className="bubbleInfo">
                        <p>달력에 표시된 날은 간병요청한 날입니다.</p>
                    </div>
                        {
                            jobType === "day" ?
                                <>
                                    <div className="careCalWrap__list">
                                        <RenderDayCalendar
                                            curDate={curDate}
                                            setCurDate={setCurDate}
                                            jobData={detailData}
                                            dateFlag={calrendarDateFlag}
                                        />
                                    </div>
                                    <div className="careDay">
                                        {
                                            detailType !== "view" &&
                                            <div className="leftModifyWrap">
                                                <span className="modifyBtn">수정하기</span>
                                            </div>
                                        }
                                        {renderTotalCareTime()}
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        detailType !== "view" &&
                                        <div className="leftModifyWrap">
                                            <span className="modifyBtn">수정하기</span>
                                        </div>
                                    }
                                    <div className="careCalWrap__list">
                                        {/* <RenderTimeCalendar
                                            curDate={moment(startDate)}
                                            jobData={detailData}
                                        /> */}
                                    </div>
                                    <div className="careTime">
                                        {renderTotalCareTime()}
                                    </div>
                                </>
                        }
                </>
        );
    };

    /**
     * 공고 총 간병 시간 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */
    const renderTotalCareTime = () => {
        const {jobType, startDate, startTime, endDate, endTime} = detailData;
        const dateStart: string = startDate + " " + startTime;
        const dateEnd: string = endDate + " " + endTime;

        return (
            <dl className={"basicInfoSt" + (jobType === "day" ? " titSM" : "")}>
                {
                    jobType === "day" ?
                        <>
                        <div className="announcementTime__Info">
                          <dl className="careListTxt">
                            <div className='announcementTime__Info--start'>
                                <dt>간병 시작 시간</dt>
                                <dd>{moment(dateStart).format('YYYY년 MM월 DD일 HH시')}</dd>
                            </div>
                            <div className="announcementTime__Info--finish">
                                <dt>간병 종료 시간</dt>
                                <dd>{moment(dateEnd).format('YYYY년 MM월 DD일 HH시')}</dd>
                            </div>
                            <div className="announcementTime__Info--total">
                                <dt>총 간병기간</dt>
                                <dd>{CareUtils.careDayHour(dateStart, dateEnd, "detail")}</dd>
                            </div>
                          </dl>
                        </div>
                        </>
                        :
                        <div>
                            <dt>해당 간병은 선택한 일에</dt>
                            <dd><strong>{moment(dateStart).format("HH")}시</strong>부터 <strong>{startTime > endTime ? "다음날 " : ""} {moment(dateEnd).format("HH")}시</strong>까지 진행됩니다.</dd>
                        </div>
                }
            </dl>
        );
    };


    /**
     * 감염성 질환 선택 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */


    let { infectiousDisease, infectiousDiseaseEtc } = careData;
    const diseaseCheckArr = [
        infectiousDisease === 0,
        (infectiousDisease & 1) > 0,
        (infectiousDisease & 2) > 0,
        (infectiousDisease & 4) > 0,
        (infectiousDisease & 8) > 0,
        (infectiousDisease & 16) > 0,
        (infectiousDisease & 32) > 0,
    ];


    const renderInfectiousDiseaseSelect = useMemo(()=> {
        let html:any[] = [];
        diseaseCheckArr.forEach((item:any, idx:any) => {
            if(diseaseCheckArr[idx + 1]) {
                html.push(
                    <li>
                        <div className="announcementItem__list--detail">
                            <figure>
                                <button type="button">도움말 보기</button>
                                <img src={HelpInfo.careHelpInfo01[idx].img}alt="코로나" />
                            </figure>
                            <div>
                                <h4 className="txtStyle04-W500">{HelpInfo.careHelpInfo01[idx].title}</h4>
                                <p className="txtStyle05-C333">
                                {HelpInfo.careHelpInfo01[idx].content}
                                </p>
                            </div>
                        </div>
                    </li>
                    )
            }
            })
            return html
    },[])

    /**
     * 마비 / 거동 / 욕창 선택 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */

    
    
    const renderMoveBodySelect = useMemo(() => {
        let selectPosition01: number = careData.paralysis - 1;
        let selectPosition02: number = careData.move === 1 ? 2 : careData.move === 2 ? 1 : 0;
    
        let html:any[] = [];
        if(careData.paralysis > 0){
            html.push(
                <li>
                    <div className="announcementItem__list--detail">
                        <figure>
                            <button type="button">도움말 보기</button>
                            <img src={HelpInfo.careHelpInfo02[selectPosition01].img}alt="코로나" />
                        </figure>
                        <div>
                            <h4 className="txtStyle04-W500">{HelpInfo.careHelpInfo02[selectPosition01].title}</h4>
                            <p className="txtStyle05-C333">
                            {HelpInfo.careHelpInfo02[selectPosition01].content}
                            </p>
                        </div>
                    </div>
                </li>
            )
        }
        if(careData.move > 0){
            html.push(
                <li>
                    <div className="announcementItem__list--detail">
                        <figure>
                            <button type="button">도움말 보기</button>
                            <img src={HelpInfo.careHelpInfo03[selectPosition02].img}alt="코로나" />
                        </figure>
                        <div>
                            <h4 className="txtStyle04-W500">{HelpInfo.careHelpInfo03[selectPosition02].title}</h4>
                            <p className="txtStyle05-C333">
                            {HelpInfo.careHelpInfo03[selectPosition02].content}
                            </p>
                        </div>
                    </div>
                </li>
            )
        }
            html.push(
                <li>
                    <div className="announcementItem__list--detail">
                        <figure>
                            <button type="button">도움말 보기</button>
                            <img src={HelpInfo.careHelpInfo04[careData.changePosture - 1].img}alt="코로나" />
                        </figure>
                        <div>
                            <h4 className="txtStyle04-W500">{HelpInfo.careHelpInfo04[careData.changePosture - 1].title}</h4>
                            <p className="txtStyle05-C333">
                            {HelpInfo.careHelpInfo04[careData.changePosture - 1].content}
                            </p>
                        </div>
                    </div>
                </li>
            )
        return html
    },[])


    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################


    return (
        <>
            <Header
                historyBack={true}
                title="환자 정보"
                headerClass={true}
            />
            <main>
                <div className="subWrap">
                    <div className="subWrap__flex">
                        {
                            (detailType === "view" && jobStatus.status !== (9 || 10)) &&
                            <ul role="tablist" className="headerTab">
                                <li role="tab" className="active">간병 상세</li>
                                <li role="tab" >지원한 케어메이트</li>
                            </ul>
                        }
                        {/* <!-- 위에 탭 없을 때에는 mt0 추가 --> */}
                        <section role="tabpanel" className={`announcementDetails ${detailType === "view" ? "" : "mt0"}`}>
                            <article className="commonWrap breakLine">
                                <div className="announcementDetails__address">
                                {
                                    (detailType === "view" && jobStatus.status !== (9 || 10)) && Utils.isEmpty(jobStatus.payment) &&
                                    <div className="announcementAlert">
                                        <p>지원한 케어메이트가 있기 때문에 수정이 불가능합니다</p>
                                        <button 
                                            type="button"
                                            onClick={()=>
                                                dispatch(showPopup({element:Popup,action:popupAction,content:"이미 지원한 케어메이트가 있기 때문에<br/>해당 공고를 수정할 수 없습니다."}))
                                            }    
                                        >보기</button>
                                    </div>
                                }


                                    <div className={`announcementTit ${careData.requestType === "home" ? " home" : " hospital"}`}>
                                        <h2 className="txtStyle03-txtBrown">간병 정보</h2>
                                    </div>
                                    <div className="map">
                                        <div className="map__wrap" id='map'></div>
                                        <div 
                                            className="zoom"
                                            onClick={()=>{}}
                                        >zoom</div> 
                                    </div>
                                    {
                                        (jobId > 0 && !reFlag) &&
                                        <div className="careNumber">
                                            <h3 className="txtStyle04-W500">
                                                간병 번호 : HMC_{jobId.toString().padStart(10, "0")}
                                            </h3>
                                        </div>
                                    }

                                    <div className="announcementAdrees">
                                        <div className="leftModifyWrap">
                                            <span className="modifyBtn">수정하기</span>
                                        </div>
                                        <dl className="careListTxt">
                                            <div>
                                                <dt>간병 장소</dt>
                                                {
                                                    Utils.isEmpty(careData.info) ? 
                                                    <dd>&nbsp;</dd>
                                                    :
                                                    <dd>{careData.info + " " +careData.detail}</dd>
                                                }
                                            </div>
                                            <div>
                                                <dt>기타 상세정보</dt>
                                                {
                                                    Utils.isEmpty(careData.address) ? 
                                                    <dd>&nbsp;</dd>
                                                    :
                                                    <dd>{careData.address}</dd>
                                                }
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                                    {renderCareCalendar()}
                            
                            </article>
                            <article className="commonWrap breakLine">
                                <h2 className="a11y-hidden">코로나 일정 논의</h2>
                                <div className="announcementTit">
                                    <h3 className="txtStyle03-txtBrown">코로나 19 검사 유/무</h3>
                                </div>
                                <div className="leftModifyWrap">
                                <div className="leftModifyWrap">
                                    <span className="modifyBtn">수정하기</span>
                                </div>
                                </div>
                                <div className="announcementItem">
                                    <ul className="announcementItem__list">
                                        <li>
                                            <div className="announcementItem__list--detail">
                                                <figure>
                                                    <img src="/images/covid.svg" alt="코로나" />
                                                </figure>
                                                <div>
                                                    <h4 className="txtStyle04-W500">코로나 19 검사 {careData.coronaCheck === 1 ? "필요" : "불필요"}</h4>
                                                    <p className="txtStyle05-C333">
                                                        매칭 이후, 검사 일정과 관련하여 케어메이트와 논의해주세요.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </article>
                            <article className="commonWrap">
                                <div className="announcementTit">
                                    <h2 className="txtStyle03-txtBrown">환자 정보</h2>
                                </div>
                                <div className="announcementAlert">
                                    <p>각 카테고리에서 보호자가 선택한 환자의 정보만 노출됩니다.</p>
                                </div>
                                <div className="announcementPersInfo">
                                    <div className="leftModifyWrap">
                                        <span className="modifyBtn">수정하기</span>
                                    </div>
                                    <div className="announcementPersInfo__info">
                                        <dl className="careListTxt">
                                            <dt>환자 이름</dt>
                                            <dd>{Utils.maskingName(careData.name)}</dd>
                                        </dl>
                                        <dl className="careListTxt">
                                            <div>
                                                <dt>성별</dt>
                                                <dd>{careData.gender === 1 ? "남자": "여자"}</dd>
                                            </div>
                                            <div>
                                                <dt>나이</dt>
                                                <dd>{careData.age}세</dd>
                                            </div>
                                            <div>
                                                <dt>키</dt>
                                                <dd>{careData.height}cm</dd>
                                            </div>
                                            <div>
                                                <dt>몸무게</dt>
                                                <dd>{careData.weight}kg</dd>
                                            </div>
                                        </dl>
                                        <dl className="careListTxt">
                                            <dt>진단명</dt>
                                            <dd>
                                                {
                                                    !Utils.isEmpty(careData.diagnosis) && careData.diagnosis
                                                }
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="announcementItem">
                                    <div className="announcementItem__Tit">
                                        <h3 className="txtStyle03-W500">* 병실</h3>
                                        <span className="modifyBtn">수정하기</span>
                                    </div>
                                    <ul className="announcementItem__list">
                                        <li>
                                            <div className="announcementItem__list--detail">
                                                <figure>
                                                    <button type="button">도움말 보기</button>
                                                    <img src={HelpInfo.careHelpInfo00[careData.sickroomType - 1].img} alt="병실" />
                                                </figure>
                                                <div>
                                                    <h4 className="txtStyle04-W500">{HelpInfo.careHelpInfo00[careData.sickroomType - 1].title}</h4>
                                                    <p className="txtStyle05-C333">
                                                    {HelpInfo.careHelpInfo00[careData.sickroomType - 1].extendContent}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="announcementItem">
                                    <div className="announcementItem__Tit">
                                        <h3 className="txtStyle03-W500">* 감염성 질환</h3>
                                        <span className="modifyBtn">수정하기</span>
                                    </div>
                                    <ul className="announcementItem__list">
                                    {renderInfectiousDiseaseSelect}
                                    </ul>
                                </div>

                                <div className="announcementItem">
                                    <div className="announcementItem__Tit">
                                        <h3 className="txtStyle03-W500">* 전신</h3>
                                        <span className="modifyBtn">수정하기</span>
                                    </div>
                                    <ul className="announcementItem__list">
                                    {renderMoveBodySelect}
                                    </ul>
                                </div>


                                <div className="announcementItem">
                                    <div className="announcementItem__Tit">
                                        <h3 className="txtStyle03-W500">* 재활/투석/기타</h3>
                                        <span className="modifyBtn">수정하기</span>
                                    </div>
                                    <ul className="announcementItem__list">
                                        <li>
                                            <div className="announcementItem__list--detail">
                                                <figure>
                                                    <button type="button">도움말 보기</button>
                                                    <img src="../images/uniform.svg" alt="유니폼 착용 여부" />
                                                </figure>
                                                <div>
                                                    <h4 className="txtStyle04-W500">선호하는 케어메이트 복장</h4>
                                                    <p className="txtStyle05-C333">케어네이션 유니폼</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="announcementItem">
                                    <div className="announcementItem__Tit">
                                        <h3 className="txtStyle03-W500">환자의 입원 사유와 기타 사항</h3>
                                        <span className="modifyBtn">수정하기</span>
                                    </div>
                                    <textarea>
                                        XXXXXXX XXXXXXXXXXXXXXXXXX XXXXXXXXXXXX XXXXXXXXXXXXX XXXXXXXXXXXXXX.</textarea
                                    >
                                </div>
                            </article>
                            <article className="bigData">
                                <div className="bigData__tit">
                                    <h2 className="a11y-hidden">케어네이션에서 예상한 간병비</h2>
                                    <img src="../images/bigDataLogo.svg" alt="CARENATION DATA LAB." />
                                    <p className="txtStyle05">빅데이터 통계를 통해 예상 지원 금액을 보여드려요.</p>
                                </div>
                                <div className="bigData__chart">
                                    <span>기준 : 일 간병비</span>
                                    <div className="areaChart">꺾은선 그래프 넣는 자리</div>
                                    <div className="rangeAxis">
                                        <p>
                                            <span>80,000원</span>
                                            <span>115,000원</span>
                                        </p>
                                    </div>
                                    <p className="txtStyle05-C333">
                                        현재 공고와 비슷한 공고의 지원 금액은<br />
                                        <strong><span>80,000</span>원 ~ <span>115,000</span>원</strong> 입니다.
                                    </p>
                                </div>
                                <div className="bigData__info">
                                    <p className="txtStyle05-C333">
                                        예상 지원 금액 정보는 참고용 자료입니다. 실제 지원 금액과 다를 수 있습니다.
                                    </p>
                                </div>
                            </article>
                        </section>
                    </div>
                    <div className="noticeInfo">
                        <div className="noticeInfo__agree">
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
                        </div>
                        <div className="noticeInfo__txt">
                            <h2>환자 정보 설명글에 대한 참고사항</h2>
                            <p>
                                해당 정보는 최종적인 의학적 소견이 아니며, 다양한 환경적 요인에 따라 이견이 발생할
                                수 있습니다. 이를 제공한 개인 및 사업자는 법률적 책임이 없음을 안내해 드립니다.
                            </p>
                        </div>
                        <div className="btnWrap">
                            <button type="button" className="btnBorder">취소하기</button>
                            <button type="button" className="btnColor">수정하기</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CareDetail;