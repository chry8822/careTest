import moment from "moment";
import {CareType, AmountType} from "./types";
import * as Utils from "../../../constants/utils";

//##################################################################################################################
//##
//## >> Method : Amount Check
//##
//##################################################################################################################

const TIME_DEFAULT_AMOUNT = 0;              //## 시간제 Default 금액
const TIME_AMOUNT = 13000;                  //## 시간제 간병 최대 금액
const DAY_DEFAULT_AMOUNT = 95000;           //## 기간제 Default 금액
const DAY_MAX_AMOUNT = 150000;              //## 기간제 간병 최대 금액
const TWENTY_THOUSAND = 20000;              //## 추가 금액
const TEN_THOUSAND = 10000;                 //## 추가 금액
const SIX_THOUSAND = 6000;                  //## 추가 금액
const FIVE_THOUSAND = 5000;                 //## 추가 금액
const THREE_THOUSAND = 3000;                //## 추가 금액
const TWO_THOUSAND = 2000;                  //## 추가 금액
const ONE_THOUSAND = 1000;                  //## 추가 금액
const CARE_FEE = 0.06;                      //## 간병 서비스 수수료 6%

/**
 * 기간제 간병 환자 간병비 계산
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param careData : Object Data
 */
export function dayAmountCheck(careData: CareType) {
    let careTimeVal = careTime(careData); //## 환자 간병시간
    let amount = DAY_DEFAULT_AMOUNT + dayOptionAmount(careData);
    amount = amount > DAY_MAX_AMOUNT ? DAY_MAX_AMOUNT : amount; //## 일 간병비가 15만원을 넘는다면 15만원으로 고정

    let totalAmount = amount * Math.floor(careTimeVal / 24);
    let totalAmountFee = checkFee(amount) * Math.floor(careTimeVal / 24);

    let extraTime = careTimeVal % 24; //## 잔여시간 > 24시간이 안되는 남는 시간

    if (extraTime > 0) {
        totalAmount = totalAmount + (extraTime * FIVE_THOUSAND > DAY_DEFAULT_AMOUNT ? DAY_DEFAULT_AMOUNT : extraTime * FIVE_THOUSAND);
        totalAmountFee = totalAmountFee + (extraTime * SIX_THOUSAND > checkFee(DAY_DEFAULT_AMOUNT) ? checkFee(DAY_DEFAULT_AMOUNT) : extraTime * SIX_THOUSAND);
    }

    return ({
        amountDay: amount,
        amountDayFee: checkFee(amount),
        amountTime: extraTime > 0 ? FIVE_THOUSAND : 0,
        amountTimeFee: extraTime > 0 ? SIX_THOUSAND : 0,
        total: totalAmount,
        totalFee: totalAmountFee
    });
}

/**
 * 시간제 간병 환자 간병비 계산
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param careData : Object Data
 */
export function timeAmountCheck(careData: CareType) {
    let careTimeVal = careTime(careData); //## 환자 간병시간
    let amount = TIME_DEFAULT_AMOUNT + timeOptionAmount(careData);
    amount = amount > TIME_AMOUNT ? TIME_AMOUNT : amount; //## 시간 간병비가 13,000원을 넘는다면 13,000원으로 고정
    amount = amount < 10000 ? 10000 : amount; //## 시간 간병비가 10,000원 이하라면 10,000원으로 고정

    return ({
        amountDay: 0,
        amountDayFee: 0,
        amountTime: amount,
        amountTimeFee: checkFee(amount),
        total: amount * careTimeVal,
        totalFee: checkFee(amount) * careTimeVal
    });
}

/**
 * 환자 간병 시간 계산
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param careData : Object Data
 */
export function careTime (careData: CareType) {
    if (careData.jobType === "time" && careData.selectDate) { //### 시간제 간병
        const jobCount: number = careData.selectDate.split(",").length; //## 총 간병 횟수
        let startDate = moment().format("YYYY-MM-DD") + ' ' + careData.startTime;
        let endDate = moment().add(careData.endTime > careData.startTime ? 0 : 1, 'days').format("YYYY-MM-DD") + ' ' + careData.endTime;

        return Math.abs(Number(moment.duration(moment(endDate).diff(moment(startDate))).hours())) * jobCount;
    } else { //### 기간제 간병
        let startDateTime = moment(careData.startDate + ' ' + careData.startTime);
        let endDateTime = moment(careData.endDate + ' ' + careData.endTime);

        return Math.floor(endDateTime.diff(startDateTime) / (1000 * 60 * 60));
    }
}

/**
 * 시간제 간병 환자 옵션 선택에 따른 추가금 계산
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param careData : Object Data
 */
function timeOptionAmount (careData: CareType) {
    let optionAmount = 0;
    let weight = Number(careData.weight); //## 환자 몸무게
    let paralysis = careData.paralysis === 0 ? 3 : careData.paralysis; //## 마비상태
    let consciousness = careData.consciousness; //## 의식상태
    let move = careData.move; //## 거동상태
    let suction = careData.suction === 0 ? 2 : careData.suction; //## 석션
    let changePosture = careData.changePosture === 0 ? 2 : careData.changePosture; //## 욕창
    let feeding = careData.feeding === 0 ? 2 : careData.feeding; //## 식사
    let stoma = careData.stoma === 0 ? 2 : careData.stoma; //## 장루

    if (!isNaN(weight) && weight >= 65) { //# 몸무게가 65kg 이상이면
        optionAmount = optionAmount + TWO_THOUSAND;
    }

    //### 환자증상 선택에 따른 optionAmount
    optionAmount = paralysis === 1 ? optionAmount + THREE_THOUSAND : (paralysis === 2 ? optionAmount + TWO_THOUSAND : optionAmount); //## 마비상태 중 전신마비 추가 할증(3,000원) / 편마비 추가 할증(2,000원)
    optionAmount = consciousness === 2 ? optionAmount + TWO_THOUSAND : optionAmount;                                                 //## 의식상태 중 의식이 없으면 추가 할증(2,000원)
    optionAmount = (careData.cognitive & 1) > 0 ? optionAmount + THREE_THOUSAND : optionAmount;                                  //## 치매가 있으면 추가 할증(3,000원)
    optionAmount = (careData.cognitive & 1) > 0 ? optionAmount : ((careData.cognitive & 2) > 0 ? optionAmount + THREE_THOUSAND : optionAmount); //## 섬망이 있으면 추가 할증(3,000원)
    optionAmount = move === 3 ? optionAmount + ONE_THOUSAND : optionAmount;                                                          //## 거동상태중 거동이 불가능이면 추가 할증(1,000원)
    optionAmount = (careData.toiletType & 1) > 0 ? optionAmount + THREE_THOUSAND : optionAmount;                                 //## 배뇨/배변(기저귀) 추가 할증(3,000원)
    optionAmount = (careData.toiletType & 2) > 0 ? optionAmount + TWO_THOUSAND : optionAmount;                                   //## 배뇨/배변(소변줄) 추가 할증(2,000원)
    optionAmount = stoma === 1 ? optionAmount + THREE_THOUSAND : optionAmount;                                                       //## 장루 추가할증 (3,000원)
    optionAmount = suction === 1 ? optionAmount + THREE_THOUSAND : optionAmount;                                                     //## 석션이 있으면 추가 할증(3,000원)
    optionAmount = changePosture === 1 ? optionAmount + TWO_THOUSAND : optionAmount;                                                 //## 욕창이 있으면 추가 할증(2,000원)
    optionAmount = feeding === 1 ? optionAmount + TWO_THOUSAND : optionAmount;                                                       //## 식사 > 피딩 추가 할증(2,000원)
    //## 감염 질환이 있으면 추가 할증(3,000원)
    for (let i = 0; i < 6; i++) {
        if ((careData.infectiousDisease & Math.pow(2, i)) > 0) {
            optionAmount = optionAmount + THREE_THOUSAND;
            break;
        }
    }
    return optionAmount;
}

/**
 * 기간제 간병 환자 옵션 선택에 따른 추가금 계산
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param careData : Object Data
 */
function dayOptionAmount (careData: CareType) {
    let optionAmount = 0;
    let sickroomType = careData.sickroomType === 0 ? 1 : careData.sickroomType; //## 병실 분류
    let paralysis = careData.paralysis === 0 ? 3 : careData.paralysis; //## 마비상태
    let somnipathy = careData.somnipathy === 0 ? 2 : careData.somnipathy; //## 수면장애
    let suction = careData.suction === 0 ? 2 : careData.suction; //## 석션
    let changePosture = careData.changePosture === 0 ? 2 : careData.changePosture; //## 욕창
    let feeding = careData.feeding === 0 ? 2 : careData.feeding; //## 식사
    let stoma = careData.stoma === 0 ? 2 : careData.stoma; //## 장루

    if (careData.weight) {
        if (careData.gender === 1 && Number(careData.weight) >= 76) { //# 성별이 남자이면서 몸무게가 76kg 이상이면
            optionAmount = optionAmount + THREE_THOUSAND;
        } else if (careData.gender === 2 && Number(careData.weight) >= 66) { //# 성별이 여자이면서 몸무게가 66kg 이상이면
            optionAmount = optionAmount + THREE_THOUSAND;
        }
    }

    //### 환자증상 선택에 따른 optionAmount 변경
    optionAmount = sickroomType === 5 ? optionAmount + TEN_THOUSAND : optionAmount;                                                            //## 병실분류 중 폐쇄병실 추가 할증(10,000원)
    optionAmount = paralysis === 1 ? optionAmount + TEN_THOUSAND : (paralysis === 2 ? optionAmount + FIVE_THOUSAND : optionAmount);            //## 마비상태 중 전신마비 추가 할증(10,000원) / 편마비 추가 할증(5,000원)
    optionAmount = (careData.cognitive & 1) > 0 ? optionAmount + TEN_THOUSAND : optionAmount;                                              //## 치매/섬망이 있으면 추가 할증(10,000원)
    optionAmount = (careData.cognitive & 1) > 0 ? optionAmount : ((careData.cognitive & 2) > 0 ? optionAmount + TEN_THOUSAND : optionAmount);                        //## 치매/섬망이 있으면 추가 할증(10,000원)
    optionAmount = ((careData.cognitive & 1) > 0 || (careData.cognitive & 2) > 0) ? optionAmount : (somnipathy === 1 ? optionAmount + FIVE_THOUSAND : optionAmount); //## 수면장애가 있으면 추가 할증(5,000원) => 단 치매/섬망 체크되어있으면 추가할증 x
    optionAmount = suction === 1 ? optionAmount + TEN_THOUSAND : optionAmount;                                                                 //## 석션이 있으면 추가 할증(10,000원)
    optionAmount = suction === 1 ? optionAmount : (feeding === 1 ? optionAmount + FIVE_THOUSAND : optionAmount);                               //## 식사 > 피딩 추가 할증(5,000원) => 단 석션 체크되어있으면 추가할증 x
    optionAmount = changePosture === 1 ? optionAmount + TEN_THOUSAND : optionAmount;                                                           //## 욕창이 있으면 추가 할증(10,000원)
    optionAmount = stoma === 1 ? optionAmount + TEN_THOUSAND : optionAmount;                                                                   //## 장루 추가할증 (10,000원)

    let infectiousDiseaseFlag: boolean = false; //## 감염질환
    //## 감염 질환이 있으면 추가 할증(20,000원)
    for (let i = 0; i < 6; i++) {
        if ((careData.infectiousDisease & Math.pow(2, i)) > 0) {
            infectiousDiseaseFlag = true;
            optionAmount = optionAmount + TWENTY_THOUSAND;
            break;
        }
    }

    let checkFlag = infectiousDiseaseFlag ? false : ((careData.toiletType & 1) > 0);
    optionAmount = checkFlag ? optionAmount + FIVE_THOUSAND : optionAmount;                                                                    //## 배뇨/배변(기저귀) 추가 할증(5,000원) => 단 감염질환이 선택되어 있을 경우 추가할증 x
    if (!infectiousDiseaseFlag && (careData.toiletType & 2) > 0) {
        //## 배뇨/배변(소변줄) 추가 할증(5,000원) => 감염질환이 선택되어 있을 경우 기저귀 유무와 상관없이 소변줄 체크되어 있으면 추가할증, 감염질환이 없을 경우 기저귀가 선택되어 있다면 추가할증 X
        optionAmount = optionAmount + FIVE_THOUSAND;
    }

    return optionAmount;
}

/**
 * 수수료 계산 (간병 서비스 : 6%)
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param value : amount Value
 */
export function checkFee (value: number) {
    return Math.ceil((value + (value * CARE_FEE)) / 100) * 100;
}

//##################################################################################################################
//##
//## >> Method : private
//##
//##################################################################################################################

/**
 * 환자 간병 일 / 시간 계산
 * -----------------------------------------------------------------------------------------------------------------
 */
export function careDayHour(startDate: string, endDate: string, type?: string) {
    let content: string = "";

    //### 시작/종료시간
    let startDateTime = moment(startDate, "YYYY-MM-DD HH:mm");
    let endDateTime = moment(endDate, "YYYY-MM-DD HH:mm");

    //### 두 시간의 차
    let careTime = endDateTime.diff(startDateTime) / (1000 * 60 * 60);

    let day = Math.floor(careTime / 24);
    let time = Math.floor(careTime % 24);

    if (type === "detail" && (day < 0 || time < 0)) {
        content = '종료일은 시작일보다 작을 수 없습니다.';
    } else {
        content = (day === 0 ? "" : day + "일 ") + (time === 0 ? "" : (time + "시간")) + (careTime.toString().includes(".5") ? (" 30분") : "");
    }

    return content;
}

/**
 * 공고 등록/수정 데이터 가공 작업
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param careData : 공고 등록/수정 데이터
 * @param amountData : 공고 등록/수정 간병비 데이터
 */
export function careDataProcessing(careData: CareType, amountData: AmountType) {
    //### 간병 기간 Set
    let tempTimeFormat = "HH:mm:ss";
    let dateStart = Utils.convertDateToString(careData.startDate) + ' ' + moment(Utils.convertTimeToString(careData.startTime).replace(" ", "T"), tempTimeFormat).format(tempTimeFormat);
    let dateEnd = Utils.convertDateToString(careData.endDate) + ' ' + moment(Utils.convertTimeToString(careData.endTime).replace(" ", "T"), tempTimeFormat).format(tempTimeFormat);

    let requestData: any = {
        ptr_user_type: "protector",
        is_unknown: "N",
        com_hospitals_id: careData.hospitalId,
        info: careData.info,
        info_detail: careData.detail,
        address: careData.address,
        address_name: careData.address,
        address_name_arr: Utils.isEmpty(careData.addressNameArr) ? "" : careData.addressNameArr,
        lat: careData.lat,
        lon: careData.lon,
        hos_code: careData.hosCode,
        loc_code: careData.locCode,
        si_code: careData.siCode,
        gu_code: careData.guCode,
        request_type: careData.requestType,
        job_type: careData.jobType === "time" ? "term" : careData.jobType,
        date_start: dateStart,
        date_end: dateEnd,
        date_time_range: careData.jobType === "day" ? "" : careData.selectDate,
        ptr_patients_id: careData.familyId,
        patient_name: careData.name,
        patient_gender: careData.gender,
        patient_weight: careData.weight,
        patient_height: Number(careData.height),
        patient_age: careData.age,
        ability_sickroom_type: careData.sickroomType,
        ability_paralysis: careData.paralysis,
        ability_consciousness: careData.consciousness,
        ability_cognitive: careData.cognitive,
        cognitive_dementia_etc: Utils.trimData(careData.cognitiveDementiaEtc),
        cognitive_delirium_etc: Utils.trimData(careData.cognitiveDeliriumEtc),
        ability_move_toilet: careData.moveToilet,
        move_toilet_etc: Utils.trimData(careData.moveToiletEtc),
        ability_stoma: careData.stoma,
        ability_somnipathy: careData.somnipathy,
        somnipathy_etc: Utils.trimData(careData.somnipathyEtc),
        ability_suction: careData.suction,
        ability_rehabilitate: careData.rehabilitate,
        ability_dialysis: careData.dialysis,
        ability_change_posture: careData.changePosture,
        ability_move: careData.move,
        ability_eat: careData.eat,
        ability_feeding: careData.feeding,
        ability_toilet: careData.toiletType,
        toilet_diapers_etc: Utils.trimData(careData.toiletDiapersEtc),
        toilet_line_etc: Utils.trimData(careData.toiletLineEtc),
        favorite_gender: careData.favoriteGender,
        reason: Utils.trimData(careData.hospitalizeReason),
        ability_infectious_disease: careData.infectiousDisease,
        infectious_disease_etc: Utils.trimData(careData.infectiousDiseaseEtc),
        ability_corona: careData.coronaCheck,
        diagnosis: Utils.trimData(careData.diagnosis),
        is_want_uniform: careData.isWantUniform,
        amount_day: amountData.amountDay,
        amount_day_fee: amountData.amountDayFee,
        amount_time: amountData.amountTime,
        amount_time_fee: amountData.amountTimeFee,
        total: amountData.total,
        total_fee: amountData.totalFee
    };

    return requestData;
}

/**
 * 가족 정보 등록/수정 데이터 가공 작업
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param tempData : 공고 등록 / 수정 데이터
 */
export function patientDataProcessing(tempData: any) {
    let patientData: any = {
        patient_name: tempData.name,
        patient_gender: tempData.gender,
        patient_weight: tempData.weight,
        patient_height: Number(tempData.height),
        patient_age: tempData.age,
        ability_paralysis: tempData.paralysis,
        ability_consciousness: tempData.consciousness,
        ability_cognitive: tempData.cognitive,
        cognitive_dementia_etc: Utils.trimData(tempData.cognitiveDementiaEtc),
        cognitive_delirium_etc: Utils.trimData(tempData.cognitiveDeliriumEtc),
        ability_move_toilet: tempData.moveToilet,
        move_toilet_etc: Utils.trimData(tempData.moveToiletEtc),
        ability_stoma: tempData.stoma,
        ability_somnipathy: tempData.somnipathy,
        somnipathy_etc: Utils.trimData(tempData.somnipathyEtc),
        ability_suction: tempData.suction,
        ability_rehabilitate: tempData.rehabilitate,
        ability_dialysis: tempData.dialysis,
        ability_change_posture: tempData.changePosture,
        ability_move: tempData.move,
        ability_eat: tempData.eat,
        ability_feeding: tempData.feeding,
        ability_toilet: tempData.toiletType,
        toilet_diapers_etc: Utils.trimData(tempData.toiletDiapersEtc),
        toilet_line_etc: Utils.trimData(tempData.toiletLineEtc),
        favorite_gender: tempData.favoriteGender,
        reason: Utils.trimData(tempData.hospitalizeReason),
        ability_infectious_disease: tempData.infectiousDisease,
        infectious_disease_etc: Utils.trimData(tempData.infectiousDiseaseEtc),
        diagnosis: Utils.trimData(tempData.diagnosis),
        is_want_uniform: tempData.isWantUniform
    };

    return patientData;
}

/**
 * 간병인 백신 접종 상태 확인
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param vaccineData : 해당 간병인 백신 데이터
 */
export function vaccinatonCheck(vaccineData: any){
    if (Utils.isEmpty(vaccineData)) { //# 백신 접종 데이터가 없을 시 미접종
        return "미접종";
    }

    const vaccination: any = { //## 백신 접종 상태별 문구
        first: 1,
        second: 2,
        booster_first: 3,
        booster_second: 4
    };

    return vaccination[Object.keys(vaccineData)[Object.keys(vaccineData).length - 1]] + "차 접종 완료"; //### 백신값 설정
}

/**
 * 케어메이트어워즈 대상자인지 체크
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param id : 케어메이트 ID
 */
export function awardsPersonCheck(id: number) {
    const AWARDS_TITLE = ["열일상", "수입상", "리뷰상", "동분서주상", "터줏대감상", "노력상", "인기상", "좋은이웃상", "아차상"];
    const awardsPersonListArr: {[index: number]: any} = {
        1: [5850, 4720, 5308, 5184, 2843],
        2: [2624, 1008, 7090, 5317, 2993],
        3: [5939, 5935, 5968, 6746],
        4: [2767, 6460, 10953, 8479],
        5: [9400, 5724, 7953, 11705],
        6: [3056, 12886, 7887, 13059],
        7: [14140, 7927, 8997, 6488, 7603],
        8: [2264, 5726, 14709, 4020],
        9: [12241, 9698, 4925, 21989, 11783, 7844, 9098, 11289, 2389]
    };

    let awardTitle: string = "";
    AWARDS_TITLE.map((title: string, idx: number) => {
        if (awardsPersonListArr[idx + 1].includes(id)) {
            awardTitle = title;
        }
    });
    return awardTitle;
}

/**
 * 공고 진행 상태에 따라 클래스 이름 변경
 * -----------------------------------------------------------------------------------------------------------------
 *
 * @param list : Object
 */
export function jobStatusColor(list: any) {
    /*
        1. 매칭 대기 / 결제대기 / 간병대기 : 노랑색
        2. 취소 요청/ 취소완료 : 빨강색
        3. 간병 중 : 파랑색
        4. 간병완료 : 회색
        5. 공고닫힘 : 빨간색
    */
    let colorName;
    if (list.status === 1 || list.status === 2 || list.status === 3) {
        colorName = "YW";
    } else if (list.status === 4) {
        colorName = "BU";
    } else if (list.status === 5) {
        colorName = 'GY';
    } else if (list.status === 9 || list.status === 10) {
        colorName = 'RD';
    }
    if (list.cancel_status === 'R' || list.cancel_status === 'Y') {
        colorName = 'RD';
    }
    return colorName;
}

/**
 * 총 간병 기간 계산
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param workCount : time(minute)
 */
export function workDayHour(workCount: number) {
    let day = Math.floor(workCount / 60 / 24);
    let hour = Math.floor((workCount / 60) % 24);
    let minute = workCount % 60;

    let content = (day === 0 ? "" : day + "일 ") + (hour === 0 ? "" : (hour + "시간 ")) + (minute === 0 ? "" : (minute + "분"));

    return content;
}

/**
 * 존재하지 않는 이미지 확인
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param character : image value
 */
export function nullCharacterCheck(character: string) {
    return Utils.isEmpty(character) || character === "default_img05" || character === "chrDefault" || character === "male_character10" || character === "female_character10";
}