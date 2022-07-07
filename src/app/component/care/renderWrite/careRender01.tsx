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

interface RenderCare01Props {
    registerData: CareType;
    setData: (data: any) => void;
    jobType: string;
    careTimeCheckMsg: string;    //## 간병 시간 유효성 검사 메시지
    reFlag?: boolean;            //## 재등록 상태 분기
    disabledHours?: number[];    //## 연장 공고 날짜 선택 분기값 배열
}


const formatDatePicker: string = "yyyy-MM-dd";
const formatDate: string = "YYYY-MM-DD";
const formatTime: string = "HH:mm";
const formatTimeSecond: string = "HH:mm:ss";
const formatHourTime: string = "HH:00";


const CareRender01 = ({registerData, setData, jobType, careTimeCheckMsg, reFlag, disabledHours}:RenderCare01Props) => {

    console.log(moment(registerData.startDate))


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
        if(jobType === "day") {
            let day = moment(dateEnd).diff(moment(dateStart), "days") //### 두 시간의 차
            let time = (moment(dateEnd).diff(moment(dateStart),"hours")) % 24 //### 두 시간의 차
            // let day = Math.floor(careTime / 24);
            // let time = Math.floor(careTime % 24);
            console.log(time)
            totalTime = "<strong>" + (day === 0 ? "" : day + "일 ") + (time === 0 ? "" : (time + "시간")) + "</strong>";
        } else { //### 시간제 공고
            let endDate = moment(dateStart).add(Number(registerData.selectOption), 'hours');

            totalTime = "<strong>" + moment(dateStart).format("HH시") + "</strong>" + " 부터&nbsp" +
                "<strong>" + (registerData.startTime > registerData.endTime ? "다음날 " : "") + moment(endDate).format("HH시") + "</strong>" + " 까지 진행됩니다.";
        }
        return <dd dangerouslySetInnerHTML={{__html: Dompurify.sanitize(totalTime)}}/>;
    }

  


    // console.log(
//             moment(Utils.convertDateToString(registerData.startDate) + " " + 
//             moment(registerData.startTime, formatTimeSecond).
//             format(formatTimeSecond)).diff(moment( Utils.convertDateToString(registerData.endDate) + " " +
//             moment(registerData.endTime, formatTimeSecond).
//             format(formatTimeSecond))) / (1000 * 60 * 60),
//             Math.floor(-168 / 24) + "일",
//             Math.floor(-168 % 24)
// )


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
                  <h3 className="txtStyle03-txtBrown">간병 기간 선택</h3>
                </div>
                <ul className="basicInput">
                  <li className="basicInput__txt">
                    <label htmlFor="startDate">시작</label>
                    <div className="basicInput__txt--form">
                      <div className="react-datepicker-wrapper">
                        <div className="react-datepicker__input-container">
                          {/* <input
                            type="text"
                            name="startDate"
                            id="startDate"
                            placeholder="시작 날짜 선택"
                            className="startDate"
                            value="2021-01-29"
                          /> */}
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
                        {/* <input
                          className="rc-time-picker-input"
                          type="text"
                          placeholder="시간 선택"
                          value="23:00"
                        /> */}
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
                          {/* <input
                            type="text"
                            name="finishDate"
                            id="finishDate"
                            placeholder="시작 날짜 선택"
                            className="startDate"
                            value="2021-01-29"
                          /> */}
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
                        {/* <input
                          className="rc-time-picker-input"
                          type="text"
                          placeholder="시간 선택"
                          value="23:00"
                        /> */}
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
                <div className="select__list--totalTime">
                  <b className="txtStyle04-C333Wnoml">총 간병시간</b>
                  {/* <!-- 날짜 관련해서만 strong에 넣어주시고 나머지 안내말은 strong 밖으로 빼주세요. --> */}
                  <h4 className="txtStyle03">
                  {renderTotalCareTime()}
                  </h4>
                </div>
                <div className="select__list--wrong">
                  <p className="txtStyle04-W500">
                    오후 9시부터 오전 6시까지는 간병 종료시간으로 신청하실 수 없습니다.
                  </p>
                </div>
              </div>
            </section>
        </>
    )
}

export default CareRender01;