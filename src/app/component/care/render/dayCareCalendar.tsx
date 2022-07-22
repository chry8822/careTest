import React from 'react';
import moment from "moment";
import * as Utils from "../../../constants/utils";

interface RenderCalendarProps {
    curDate: object | Date;
    setCurDate: (date: object) => void;
    jobData: any;
    dateFlag: {
        preFlag: boolean,
        nextFlag: boolean
    };
}

/**
 * 기간제 공고 상세 달력 Rendering
 * -----------------------------------------------------------------------------------------------------------------
 */
const RenderDayCalendar = ({curDate, setCurDate, jobData, dateFlag}: RenderCalendarProps) => {
    let year: number = moment(curDate).year();
    let month: number = moment(curDate).month();
    // 0부터 1월 11 은 12월

    
    //##################################################################################################################
    //##
    //## >> Method : Private
    //##
    //##################################################################################################################

    /**
     * 달력 달(Month) 변경
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param type : pre / next / empty
     */
    const changeCalendarStatus = (type: string) => {
        if (Utils.isEmpty(type)) {
            return
        }
        month = type === 'pre' ? month - 1 : month + 1;
        // 현재 1월달(month === 0) 이고 pre 타입이면 작년 12월달로 이동 ( month === 11 )
        if (month < 0 && type === 'pre') {
            month = 11;
            year = year -1;
        }
        if (month >= 12 && type === 'next') {
            month = 0;
            year = year + 1;
        }
        setCurDate(moment([year, month]));
    };

    //##################################################################################################################
    //##
    //## >> Method : Render
    //##
    //##################################################################################################################

    /**
     * 달력 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */
    const renderCalendar = () => {
        let html: any[] = [];

        // 현재 월에 1 일
        let date:any = moment([year, month, 1]);
        //해당 월에 마지막 주(6 이면 7월은 총 6주이고 마지막 주는 6)
        let lastWeek =  Utils.weeks(year, month);
        
        // lastWeek 만큼의 열을 만들고 하나의 열 안에 요일(월~일)을 렌더링함 
        for (let i = 0; i < lastWeek; i++) {
            html.push(
                <div className="calendar__detail--col" key={Math.random()}>
                    {renderCalendarDate(date, i)}
                </div>
            );
        }
        return html;
    };
    
    let date:any = moment([year, month, 1]);
    

    
    /**
     * 달력 날짜 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param date : 날짜 moment Data
     * @param week : week Data
     */
    const renderCalendarDate = (date: any, week: number) => {
        let html: React.ReactElement[] = [];
        // 한 주(7일)에 들어갈 렌더링 요일
        for (let i = 0; i < 7; i++) {
            // 해당 주의 요일을 0~6까지
            let dayOfWeek = new Date(year, month, date.format('DD')).getDay();
            // 해당 월에 마지막 날짜
            let lastDate =  new Date(year, month + 1, 0);

            let className: string = "";
            //시작 날짜와 같은 날짜가 렌더링 되면 className = "start" / 시작 날짜와 마지막 날짜가 다르면 "start" + "ing"
            if (jobData.startDate === Utils.convertDateToString(date)) {
                className = "start";
                if (jobData.startDate !== jobData.endDate) {
                    className = className + " ing";
                }

            //마지막 날짜와 같은 날짜가 렌더링 되면 className = "finish ing" 
            } else if (jobData.endDate === Utils.convertDateToString(date)) {
                className = "finish ing";
            } 
            //렌더링 날짜가 시작 날짜보다 크고 마지막 날짜보다 작으면
            //해당주의 요일이 일요일이면 className = "ing sun"
            //해당주의 요일이 토요일이면 className = "ing sat"
            //위에 조건들이 아니면 className = "ing"   
            else if (date > moment(jobData.startDate) && date < moment(jobData.endDate)) {
                if (dayOfWeek === 0) {
                    className = "ing sun";
                } else if (dayOfWeek === 6) {
                    className = "ing sat";
                } else {
                    className = "ing";
                }
            }
            //첫번째로 렌더링 되는 주 이고 index가 해당 주의 요일의 숫자보다 작으면 빈 span 렌더링 
            //금요일 = 5 부터 시작 하고 i = 0 부터 시작해서 0(일요일) 부터 4(목요일) 까지는 빈 span
            if (week === 0 && i < dayOfWeek) {
                html.push(
                    <span key={Math.random()}/>
                )
            } 
            // 또는 해당 날짜가 마지막 날보다 작거나 크면 날짜를 가진 span 을 렌더링
            // 1일이 들어오면 1~ lastDate 까지 렌더링
            // lastDate가 넘어가면 다시 빈 span 렌더링
            else {
                if (Utils.convertDateToString(date) <= Utils.convertDateToString(lastDate)) {
                    html.push(
                        <span className={className} key={Math.random()}>
                            {Number(date.format('DD'))}
                        </span>
                    );
                } else {
                    html.push(
                        <span key={Math.random()}/>
                    );
                }
                //매번 반복 끝날때 마다 date(들어온 날짜)에 + 1 (다음주로 넘어감)
                date.add(1, 'd');
            }
        }
        return html;
    };

    //##################################################################################################################
    //##
    //## >> Method : Default Render
    //##
    //##################################################################################################################
    return (
        <>
            <div className="calendar">
                <h3 className="a11y-hidden">달력</h3>
                <div className="calendar__tit">
                    <button 
                        type="button" 
                        className={`prev ${dateFlag.preFlag ? "" : " disabled"}`}
                        disabled={!dateFlag.preFlag} 
                        onClick={() => changeCalendarStatus(dateFlag.preFlag ? 'pre' : '')}>이전달</button>
                    <h4 className="txtStyle03">{Utils.isEmpty(curDate) ? '' : moment(curDate).format('YYYY.MM')}</h4>
                    <button 
                        type="button" 
                        className={`next ${dateFlag.nextFlag ? "" : " disabled"}`}
                        disabled={!dateFlag.nextFlag} 
                        onClick={() => changeCalendarStatus(dateFlag.nextFlag ? 'next' : '')}>다음달</button>
                </div>
                <div className="calendar__head">
                    <span>일</span>
                    <span>월</span>
                    <span>화</span>
                    <span>수</span>
                    <span>목</span>
                    <span>금</span>
                    <span>토</span>
                </div>
                <div className="calendar__detail">
                    {renderCalendar()}
                </div>
            </div>
        </>
    );
};

export default RenderDayCalendar;
