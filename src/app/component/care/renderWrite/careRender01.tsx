import React from 'react';
import moment from 'moment';
import TimePicker from "rc-time-picker";
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { CareType } from './../common/types';
import ko from "date-fns/locale/ko";
import Dompurify from "dompurify";
import * as Utils from '../../../constants/utils'
import CareRenderCalendar from './careRenderCalendar'
import * as LocalStorage from '../../../constants/localStorage'
// import CareRenderCalendarTest from './careRenderCalendarTest'

interface RenderCare01Props {
    registerData: CareType;
    setData: (data: any) => void;
    jobType: string;
    careTimeCheckMsg: string;    //## 간병 시간 유효성 검사 메시지
    reFlag?: boolean;            //## 재등록 상태 분기
    disabledHours?: number[];    //## 연장 공고 날짜 선택 분기값 배열
}
const CARE_TIME_ARRAY: number[] = [ //## 필요한 간병 시간 Array
1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
11, 12, 13, 14, 15, 16, 17, 18,
19, 20, 21, 22, 23
];


const formatDatePicker: string = "yyyy-MM-dd";
const formatDate: string = "YYYY-MM-DD";
const formatTime: string = "HH:mm";
const formatTimeSecond: string = "HH:mm:ss";
const formatHourTime: string = "HH:00";
const formatHaveTime: string = "H[시간]"
const formatSelectTime: string = "H"


/**
 * 간병 시간 선택 Rendering
 * -----------------------------------------------------------------------------------------------------------------
 */

const CareRender01 = ({ registerData, setData, jobType, careTimeCheckMsg, reFlag, disabledHours }: RenderCare01Props) => {
    const CARE_DAY_ARRAY: string[] = ["일", "월", "화", "수", "목", "금", "토"]; //## 시간제 간병 요일 선택 Array

    function disabledTime() {
        return [0]
    }



    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################
    
    /**
     * 시간제 간병 달력 날짜 선택 처리
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @params date : 선택한 날짜 문자열 (YYYY-MM-DD)
     */

    // 확인해보기
    const selectCareDate = (date: string) => {
        if (registerData.selectDate && date === registerData.startDate) { //### 간병 시작일 선택 시 수정 막기
            return;
        }
        let selectStr: string = registerData.selectDate;
        if (selectStr.includes(date)) {
            if (selectStr.includes(',' + date)) {
                selectStr = selectStr.replaceAll(',' + date, '');
            } else if (selectStr.includes(date + ',')) {
                selectStr = selectStr.replaceAll(date + ',', '');
            } else {
                selectStr = selectStr.replaceAll(date, '');
            }
        } else {
            selectStr += selectStr ? ',' + date : date;
        }
        changeCareDate(selectStr);
    };

    /**
     * 시간제 간병 날짜 선택 데이터 가공 및 액션 처리
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @params selectDate : 선택한 날짜 문자열
     */
    const changeCareDate = (selectDate: string) => {
        const {startDate, startTime, endTime, selectOption} = registerData;
        const curDate = moment(startDate);
        let selectDateArr: string[] = selectDate.split(",");
        selectDateArr = selectDateArr.filter((item: string, idx: number) => { //### 선택한 날짜 데이터 중복 제거
            return !Utils.isEmpty(item) && curDate.format(formatDate) <= item && selectDateArr.indexOf(item) === idx;
        });
        selectDateArr.sort((a: string, b: string) => {
            if (a < b) {
                return -1;
            } else {
                return 1;
            }
        });

        const endDate = Utils.convertDateToString(selectDateArr[selectDateArr.length - 1]) + ' ' + moment(startTime, formatTimeSecond).add(Number(selectOption), 'hours').format(formatTimeSecond);
        const tempLoadWriteData = LocalStorage.getStorage(LocalStorage.LOAD_WRITE_DATA);
        const tempData = (!reFlag && tempLoadWriteData && JSON.parse(tempLoadWriteData).familyId === 0) ? JSON.parse(tempLoadWriteData): {};
        setData({
            ...tempData,
            // step: registerData.step,
            startDate: selectDateArr[0],
            endDate: moment(endDate).add(startTime > endTime ? 1 : 0, "days").format(formatDate),
            selectDate: selectDateArr.join(),
        });
    };

    


    //##################################################################################################################
    //##
    //## >> Method : Render
    //##
    //##################################################################################################################

    /**
     * 총 간병시간 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */
    const renderTotalCareTime = () => {
        let totalTime: string;
        let dateStart =
            Utils.convertDateToString(registerData.startDate) + " " +
            moment(registerData.startTime, formatTimeSecond).
                format(formatTimeSecond);
        let dateEnd =
            Utils.convertDateToString(registerData.endDate) + " " +
            moment(registerData.endTime, formatTimeSecond).
                format(formatTimeSecond);
        if (jobType === "day") {
            let day = moment(dateEnd).diff(moment(dateStart), "days") //### 두 시간의 차
            let time = (moment(dateEnd).diff(moment(dateStart), "hours")) % 24 //### 두 시간의 차
            // let day = Math.floor(careTime / 24);
            // let time = Math.floor(careTime % 24);
            totalTime = "<strong>" + (day === 0 ? "" : day + "일 ") + (time === 0 ? "" : (time + "시간")) + "</strong>";
        } else { //### 시간제 공고
            let endDate = moment(dateStart).add(Number(registerData.selectOption), 'hours');

            totalTime = "<strong>" + moment(dateStart).format("HH시") + "</strong>" + " 부터&nbsp" +
                "<strong>" + (registerData.startTime > registerData.endTime ? "다음날 " : "") + moment(endDate).format("HH시") + "</strong>" + " 까지 진행됩니다.";
        }
        return <dd dangerouslySetInnerHTML={{ __html: Dompurify.sanitize(totalTime) }} />;
    }
      /**
     * 시간제 간병 - 간병 시작 시간 데이터 가공 및 액션 처리
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @params e : Time Picker Event
     */
       const changeStartCareTime = (e: any) => {
        const selectDateArr: any[] = registerData.selectDate.split(",");
        const endDate = Utils.convertDateToString(selectDateArr[selectDateArr.length - 1]) + ' ' + moment(e.format(formatTime), formatTimeSecond).format(formatTimeSecond);

        setData({
            startTime: e.format(formatTime),
            endDate: moment(endDate).add(Number(registerData.selectOption), 'hours').format(formatDate),
            endTime: moment(Utils.convertDateToString(registerData.startDate) + ' ' + moment(e).format("HH:mm:ss")).add(Number(registerData.selectOption), "hours").format(formatHourTime)
        });
    };


     /**
     * 시간제 간병 - 필요한 시간 데이터 가공 및 액션 처리
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @params e : select Option Event
     */
      const changeNeedCareTime = (e: any) => {
        const {startDate, startTime, selectDate} = registerData;
        const selectDateArr: string[] = selectDate.split(",");
        const endDate = Utils.convertDateToString(selectDateArr[selectDateArr.length - 1]) + ' ' + moment(startTime, formatTimeSecond).format(formatTimeSecond);
        // let selectOption = e.format(formatSelectTime)


        setData({
            selectOption: e.target.value,
            endDate: moment(endDate).add(Number(endDate), 'hours').format(formatDate),
            // endTime: moment(Utils.convertDateToString(startDate) + ' ' + moment(startTime, formatTimeSecond).format("HH:mm:ss")).add(Number(selectOption), "hours").format(formatHourTime)
            endTime: moment(Utils.convertDateToString(startDate) + ' ' + moment(startTime, formatTimeSecond).format("HH:mm:ss")).add(Number(e.target.value), "hours").format(formatHourTime)
        });
    };


    /**
     * 시간제 간병 달력 요일 버튼 처리
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @params position : Select Position (0 ~ 6)
     */
     const selectCareDayStatus = (position: number) => {
        const curDate: any = moment(registerData.startDate);
        let selectStr: string = registerData.selectDate;
        let isActive: boolean = true;  //### 해당 요일 버튼 상태 (true/false)
        let dayStr: string = "";       //### 추가할 날짜 문자열

        for (let i = 0; i <= 29; i++) {
            if (curDate.day() === position && curDate.format(formatDate) !== registerData.startDate) {
                dayStr += dayStr ? ',' + curDate.format(formatDate) : curDate.format(formatDate);
                if (!registerData.selectDate.includes(curDate.format(formatDate))) {
                    isActive = false;
                }
            }
            curDate.add(1, 'day',);
        }

        if (isActive) {
            const dayStrArr: any[] = dayStr.split(',');
            dayStrArr.map((item: any) => {
                if (selectStr.includes(',' + item)) {
                    selectStr = selectStr.replaceAll(',' + item, "");
                }
                if (selectStr.includes(item)) {
                    selectStr = selectStr.replaceAll(item, "");
                }
            });
        } else {
            selectStr += selectStr ? ',' + dayStr : dayStr;
        }
        changeCareDate(selectStr);
    };




    // console.log(
    //             moment(Utils.convertDateToString(registerData.startDate) + " " + 
    //             moment(registerData.startTime, formatTimeSecond).
    //             format(formatTimeSecond)).diff(moment( Utils.convertDateToString(registerData.endDate) + " " +
    //             moment(registerData.endTime, formatTimeSecond).
    //             format(formatTimeSecond))) / (1000 * 60 * 60),
    //             Math.floor(-168 / 24) + "일",
    //             Math.floor(-168 % 24)
    // )

    // console.log("registerData.startDate",registerData.startDate)

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
                        <h3 className="txtStyle03-txtBrown">간병 {jobType === "day" ? "기간" : "시간"} 선택</h3>
                    </div>

                    {
                        jobType === "day" ?
                            <ul className="basicInput">
                                <li className="basicInput__txt">
                                    <label htmlFor="startDate">시작</label>
                                    <div className="basicInput__txt--form">
                                        <div className="react-datepicker-wrapper">
                                            <div className="react-datepicker__input-container">
                                                <ReactDatePicker
                                                    className="startDate"
                                                    name="startDate"
                                                    minDate={new Date()}
                                                    selected={new Date(registerData.startDate)}
                                                    dateFormat={formatDatePicker}
                                                    onChange={(e) => setData({
                                                        startDate: moment(e).format(formatDate)
                                                    })}
                                                    onFocus={(e) => e.target.readOnly = true}
                                                    placeholderText="시간 선택"
                                                    dateFormatCalendar="yyyy LLLL"
                                                    locale={ko}
                                                />
                                            </div>
                                        </div>
                                        <div className="date-start">
                                            <TimePicker
                                                className=""
                                                showSecond={false}
                                                showMinute={false}
                                                value={moment().set("hour", Number(registerData.startTime.split(":")[0])).set("minutes", 0)}
                                                onChange={(e) => setData({
                                                    startTime: e.format(formatTime)
                                                })}
                                                format={formatTime}
                                                use12Hours={false}
                                                inputReadOnly
                                                placeholder="시간 선택"
                                                clearIcon={' '}
                                                disabledHours={disabledHours ? () => disabledHours : undefined}
                                            />
                                            <span className="rc-time-picker-icon"></span>
                                            <a role="button" className="rc-time-picker-clear" title="clear">
                                            </a>
                                            <div className="dataPickerBtn">
                                                <img src="/images/icon_timedown.svg" alt="선택박스" />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="basicInput__txt">
                                    <label htmlFor="finishDate">종료</label>
                                    <div className="basicInput__txt--form">
                                        <div className="react-datepicker-wrapper">
                                            <div className="react-datepicker__input-container">
                                                <ReactDatePicker
                                                    className="endDate"
                                                    name="endDate"
                                                    minDate={new Date(registerData.startDate) || new Date()}
                                                    selected={new Date(registerData.endDate) || new Date()}
                                                    dateFormat={formatDatePicker}
                                                    onChange={(e) => setData({
                                                        endDate: moment(e).format(formatDate)
                                                    })}
                                                    onFocus={(e) => e.target.readOnly = true}
                                                    placeholderText="종료 날짜 선택"
                                                    dateFormatCalendar="yyyy LLLL"
                                                    locale={ko}
                                                />
                                            </div>
                                        </div>
                                        <div className="date-start">
                                            <TimePicker
                                                className=""
                                                showSecond={false}
                                                showMinute={false}
                                                value={moment().set("hour", Number(registerData.endTime.split(":")[0])).set("minutes", 0)}
                                                onChange={(e) => setData({
                                                    endTime: e.format(formatTime)
                                                })}
                                                format={formatTime}
                                                use12Hours={false}
                                                inputReadOnly
                                                placeholder="시간 선택"
                                                clearIcon={' '}
                                                disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 21, 22, 23]}
                                            />
                                            <span className="rc-time-picker-icon"></span>
                                            <a role="button" className="rc-time-picker-clear" title="clear" >
                                            </a>
                                            <div className="dataPickerBtn">
                                                <img src="/images/icon_timedown.svg" alt="선택박스" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="txtStyle05-C777">
                                        ※ 종료일이 미정일 시 임시 예정 날짜를 선택해주세요.
                                    </p>
                                </li>
                            </ul>
                            :
                            <section className="select">
                                <div className="select__list breakLine">
                                    <div className="announcementAlert mt24">
                                        <p>시작 일을 변경하면, 선택 된 값이 초기화되니 참고해주세요.</p>
                                    </div>
                                    <div className="basicInput__txt mb0">
                                        <label htmlFor="careStart">간병 시작 일</label>
                                        <div className="basicInput__txt--form">
                                            <div className="react-datepicker-wrapper">
                                                <div className="react-datepicker__input-container">
                                                    <ReactDatePicker
                                                        className="startDate"
                                                        name="startDate"
                                                        minDate={new Date()}
                                                        selected={new Date(registerData.startDate)}
                                                        dateFormat={formatDatePicker}
                                                        onChange={(e) => setData({
                                                            startDate: moment(e).format(formatDate),
                                                            endDate: moment(e).add(registerData.startTime > registerData.endTime ? 1 : 0, "days").format(formatDate),
                                                            selectDate: moment(e).format(formatDate)
                                                        })}
                                                        onFocus={(e) => e.target.readOnly = true}
                                                        placeholderText="시간 선택"
                                                        dateFormatCalendar="yyyy LLLL"
                                                        locale={ko}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="select__list--reset">
                                        <button type="button" className="grayBtn reset">초기화</button>
                                    </div>
                                    <div className="select__list--timeTit">
                                        <h3 className="txtStyle03">
                                            간병 시작일 외에 간병이 <br />
                                            필요한 날을 선택해주세요.
                                        </h3>
                                    </div>
                                    
                                    <div className="select__list--timeCheck">
                                        {CARE_DAY_ARRAY.map((day: string, idx: number) => (
                                                    <button type="button" onClick={() => selectCareDayStatus(idx)}>{day}</button>
                                            )
                                        )}
                                    </div>

                                    <CareRenderCalendar
                                        curDate={moment(registerData.startDate)}
                                        jobData={registerData}
                                        selectCareDate={selectCareDate}
                                    />
                                    {/* <CareRenderCalendarTest 
                                        curDate={moment(registerData.startDate)}
                                        jobData={registerData}
                                        selectCareDate={selectCareDate}
                                    /> */}
                                    <p className="txtStyle05-C777">
                                        ※ 시작 일을 기준으로 최대 30일까지만 선택할 수 있습니다.
                                    </p>



                                </div>
                                <div className="select__list pt40">
                                    <ul className="basicInput">
                                        {/* <!-- 공고 등록 24시간 미만 간병 --> */}
                                        <li className="basicInput__txt timeCare">
                                            <div>
                                                <label htmlFor="startDate">간병 시작 시간</label>
                                                <div className="basicInput__txt--form">
                                                    <div className="date-start">
                                                        <TimePicker
                                                            className=""
                                                            showSecond={false}
                                                            showMinute={false}
                                                            value={moment().set("hour", Number(registerData.startTime.split(":")[0])).set("minutes", 0)}
                                                            // value={moment(Number(registerData.selectOption))}
                                                            onChange={(e) => changeStartCareTime(e)}
                                                            format={formatTime}
                                                            use12Hours={false}
                                                            inputReadOnly
                                                            placeholder="시간 선택"
                                                            clearIcon={' '}
                                                        />
                                                        <div className="dataPickerBtn">
                                                            <img src="/images/icon_timedown.svg" alt="선택박스" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="finishDate">필요한 간병 시간</label>
                                                <div className="basicInput__txt--form">
                                                    {/* <select id="finishDate" className="careTimeSelet"> */}
                                                        {/* <TimePicker
                                                            className=""
                                                            showSecond={false}
                                                            showMinute={false}
                                                            value={moment().set("hour", Number(registerData.selectOption))}
                                                            // value={moment(Number(registerData.selectOption)).set("minutes", 1)}
                                                            onChange={(e) => {
                                                                changeNeedCareTime(e)
                                                            }}
                                                            format={formatHaveTime}
                                                            use12Hours={false}
                                                            inputReadOnly
                                                            placeholder="시간 선택"
                                                            clearIcon={' '}
                                                            defaultValue={moment()}
                                                            disabledHours={disabledTime}
                                                        /> */}

                                                    <select id="haveTime" value={Number(registerData.selectOption)}
                                                                onChange={(e) => changeNeedCareTime(e)}>
                                                            {CARE_TIME_ARRAY.map((time: number, idx: number) => (
                                                                    <option value={time} key={idx}>{time}시간</option>
                                                                )
                                                            )}
                                                    </select>
                                                    {/* </select> */}
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                    }
                    <div className="select__list--totalTime">
                        <b className="txtStyle04-C333Wnoml">
                            {
                                jobType === "day"? 
                                "총 간병 기간" :
                                "해당 간병은 선택한 일에"
                            }
                        </b>
                        {/* <!-- 날짜 관련해서만 strong에 넣어주시고 나머지 안내말은 strong 밖으로 빼주세요. --> */}
                        {/* <h4 className="txtStyle03"> */}
                            {renderTotalCareTime()}
                        {/* </h4> */}
                    </div>

                    {
                        careTimeCheckMsg &&
                        <div className="select__list--wrong">
                            <p className="txtStyle04-W500">
                                {careTimeCheckMsg}
                            </p>
                        </div>

                    }

                </div>
            </section>
        </>
    )
}

export default CareRender01;