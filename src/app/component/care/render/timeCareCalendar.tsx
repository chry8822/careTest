import React from 'react';
import moment from "moment";
import * as Utils from "../../../constants/utils";
import {CareType} from "../common/types";

interface RenderCalendarProps {
    curDate: object | Date;
    jobData: any;
    selectCareDate?: (date: string) => void; //## 공고 등록 > 간병 기간 선택 메서드
}

/**
 * 기간제 공고 상세 달력 Rendering
 * -----------------------------------------------------------------------------------------------------------------
 */
const RenderTimeCalendar = ({curDate, jobData,selectCareDate}: RenderCalendarProps) => {
     //##################################################################################################################
    //##
    //## >> Method : Render
    //##
    //##################################################################################################################

    /**
     * 달력 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param date : 날짜 moment Data
     */
     const renderCalendar = (date: any) => {
        // 시작 날짜의 년도
        let year: number = moment(date).year();
        // 시작 날짜의 월
        let month: number = moment(date).month();
        // 시작 날짜 월에 1일
        let calendarDate = moment([year, month, 1]);
        // 시작 날짜의 월이 가진 주 갯수
        let lastWeek =  Utils.weeks(year, month);



        let items: React.ReactElement[] = [];
        // 시작 날짜의 월이 가진 주 의 갯수 만큼 렌더링(한주 마다 다시 요일 렌더링)
        // 7월이 6주를 가지면 해당 수 만큼 렌더링
        for (let i = 0; i < lastWeek; i++) {
            items.push(
                <div className="calendar__detail--col" key={Math.random()}>
                    {renderCalendarDate(calendarDate, i)}
                </div>
            );
        }
        return (
            <div className="calendar time">
                <h3 className="a11y-hidden">달력</h3>
                <div className="calendar__tit center">
                    <h4 className="txtStyle03">{moment(date).format('YYYY.MM')}</h4>
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
                    {items}
                </div>
            </div>
        );
    };

    /**
     * 달력 날짜 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param date : 날짜 moment Data
     * @param week : week Data (월의 주 렌더링 함수에서 넘겨준 index)
     */
    const renderCalendarDate = (date: any, week: number) => {
        let html: React.ReactElement[] = [];
        //간병 시작 날짜
        const startDate: string = jobData.startDate;
        //렌더링 종료 날짜 ( 간병 시작 날짜로 부터 + 29일 )
        const endDate: string = Utils.convertDateToString(moment(startDate).add(29, "days"));

        let year: number = moment(date).year();
        let month: number = moment(date).month();

        // 렌더링 되는게 첫번째 달력 인지 확인 / month = 0~11 (1월~12) 와 시작 날짜의 월 - 1 을해서 비교
        const isFirstCalendar: boolean = month === Number(moment(startDate).format("MM")) - 1;


        for (let i = 0; i < 7; i++) {
            
            // 주 안에 요일을 0~6 으로 가져옴 (일~토)
            let dayOfWeek = new Date(year, month, date.format("DD")).getDay();
            
            // 해당 월에 마지막 날짜
            let lastDate =  new Date(year, month + 1, 0);

            
            let className: string = "";
            
            //선택한 날짜와 date에 들어온 날짜가 선택한 날짜에 포함되거나 / 선택한날이 없고 시작 날짜와 date에 들어온 날짜가 같으면 select 추가
            if ((jobData.selectDate && jobData.selectDate.includes(Utils.convertDateToString(date))) //### 공고 등록, 상세 - 날짜 비교
                || (Utils.isEmpty(jobData.selectDate) && Utils.convertDateToString(startDate) === Utils.convertDateToString(date))) { //### 공고 상세 - 기존 공고 날짜 비교
                className = "select";
            }

            // 첫번째 주에 렌더링 되는 조건
            // week = index(주 렌더에서 넘겨준) 가 0이고 i 가 요일의 숫자 보다 작으면  (예를들어 7월 에 1일은 dayOfWeek로 5 이기 때문에 0 1 2 3 4 까지 비어진 span 렌더링)
            if (week === 0 && i < dayOfWeek) {
                //첫번째 렌더링 되는 달력이 맞고 현재 날짜가 가지는 week 빼기 현재 달의 첫번째 week 가 0 이 아닐때 까지 계속 그림
                // 예 7월 14일에 week() === 29 , 7월에 시작 하는 첫번째 week() === 27
                // 만약 1일이 일요일(0) 이면 해당 조건문을 안타고 아래 else문으로
                if (isFirstCalendar && moment(curDate).week() - moment(curDate).startOf("month").week() !== 0) {
                    continue;
                }
                html.push(
                    <span key={Math.random()}/>
                );
            } else {
                const currentDate: string = Utils.convertDateToString(date);

                //현재 날짜가 간병 시작 날짜보다 크거나 같고 , 현재 날짜가 월에 마지막 날짜보다 작거나 같고, 현재 날짜가 endDate 날짜보다 작거나 같으면 달력 렌더링
                // 예 간병 선택 날짜가 1일이면 30일 까지 렌더링 됨 2일 이면 다음달 1일까지 (시작 월 이 30일 까지 일 경우)
                if (((currentDate >= Utils.convertDateToString(startDate)) && currentDate <= Utils.convertDateToString(lastDate)) && currentDate <= endDate) {
                    html.push(
                        <span className={className} onClick={selectCareDate ? () => selectCareDate(currentDate) : undefined} key={Math.random()}>
                            {Number(date.format("DD"))}
                        </span>
                    );

                // 위 경우가 아닌경우
                } else if (currentDate >= Utils.convertDateToString(moment(startDate).subtract(moment(startDate).days(), "days"))
                    && currentDate <= Utils.convertDateToString(moment(endDate).add(6 - moment(moment(startDate).add(29, "days")).days(), "days"))) {
                    html.push(
                        <span key={Math.random()}/>
                    );
                }
                date.add(1, "days");
            }
        }
        return html;
    };
                     

   //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    let viewSecondCalendar: boolean; //## 공고 종료 날짜가 다음 달일 때 두번째 달력 노출
    if (selectCareDate) { //### 공고 등록
        viewSecondCalendar = moment(jobData.startDate).format("MM") !== moment(jobData.startDate).add(29, 'days').format("MM");
    } else { //### 공고 상세 / 결제하기
        if (jobData.startTime > jobData.endTime) {
            viewSecondCalendar = moment(jobData.startDate).format("MM") !== moment(jobData.endDate).subtract(1, "days").format("MM");
        } else {
            viewSecondCalendar = moment(jobData.startDate).format("MM") !== moment(jobData.endDate).format("MM");
        }
    }
    return (
        <>
            {
                renderCalendar(curDate)
            }
            {
                viewSecondCalendar &&
                renderCalendar(moment(curDate).add(1, "month"))
            }
        </>
    );
};

export default RenderTimeCalendar;
