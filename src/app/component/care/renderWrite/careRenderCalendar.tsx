import React from 'react';
import moment from "moment";
import * as Utils from "../../../constants/utils";
import {CareType} from "../common/types";

interface RenderTimeCalendarProps {
    curDate: object | Date;
    jobData: CareType;
    selectCareDate?: (date: string) => void; //## 공고 등록 > 간병 기간 선택 메서드
}

/**
 * 시간제 공고 상세 달력 Rendering
 * -----------------------------------------------------------------------------------------------------------------
 */
const CareRenderCalendar = ({curDate, jobData, selectCareDate}: RenderTimeCalendarProps) => {
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
        let year: number = moment(date).year();
        let month: number = moment(date).month();
        let calendarDate = moment([year, month, 1]);
        let lastWeek =  Utils.weeks(year, month);


        let items: React.ReactElement[] = [];
        for (let i = 0; i < lastWeek; i++) {
            items.push(
                <div className="calendar__detail--col" key={Math.random()}>
                    {renderCalendarDate(calendarDate, i)}
                </div>
            );
        }
        return (
            <div className="calendar">
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
     * @param week : week Data
     */

    // console.log(moment().week())
    // console.log("month",Number(moment("2022-07-08").format("MM")))
    // console.log("cal", moment("2022-07-08").month() + 1)
    // console.log("day",Utils.convertDateToString(moment("2022-07-15").add(29,"days")))
    // console.log( "date", Utils.convertDateToString(moment("2022-07-15").subtract(moment("2022-07-15").days(), "days")))
    let testdate:any = (moment("2022-07-08"))
    // console.log(`"moment("2022-07-15").days()"`,new Date(moment("2022-07-08").year(), moment("2022-07-08").month(), testdate.format("DD")).getDay())
    // console.log("week",moment(testdate).week())
    // console.log(moment("2022-07-08").week() - moment("2022-07-08").week())
    // console.log("jobDate",jobData.selectDate && jobData.selectDate.includes(Utils.convertDateToString("2022-07-08")))


    const renderCalendarDate = (date: any, week: number) => {
        //배열 변수
        let html: React.ReactElement[] = [];
        //startDate = 시작 날짜
        const startDate: string = jobData.startDate;
        //endDate = 보여질 다음달 날짜 시작 날짜로 부터 29일 더해진 날까지
        const endDate: string = Utils.convertDateToString(moment(startDate).add(29, "days"));

        // date 로 들어오는 날짜의 현재 년도와 현재 월(현재 월 에서 -1 된 값임) 
        let year: number = moment(date).year();
        let month: number = moment(date).month();

        // 첫번째 달력이 맞는지 확인 / 1월 = 0 부터 함 / month 와 시작날짜의 월 - 1  값이 같으면 현재 월
        const isFirstCalendar: boolean = month === Number(moment(startDate).format("MM")) - 1;
        // const isFirstCalendar: boolean = month === Number(moment(startDate).format("MM"));

        // 0~6 총 7일
        for (let i = 0; i < 7; i++) {
            //해당 주 의 요일 구하기
            let dayOfWeek = new Date(year, month, date.format("DD")).getDay();
            // 마지막 날짜 (다음달의 마지막 요일과 날짜)
            let lastDate =  new Date(year, month + 1 , 0);

            // 선택된 요소에 className 붙이기
            let className: string = "";
            // selectDate가 존재하고 selectDate가 data로 들어오값을 포함하거나 || selectDate가 빈값이고 시작 날짜와 date로 들어온 값이 같으면 select 클래스 부여
            // 기본값으로 시작 날짜는 select 되어있고 추가로 선택하면 select 클래스가 부여됨
            if ((jobData.selectDate && jobData.selectDate.includes(Utils.convertDateToString(date))) //### 공고 등록, 상세 - 날짜 비교
                || (Utils.isEmpty(jobData.selectDate) && Utils.convertDateToString(startDate) === Utils.convertDateToString(date))) { //### 공고 상세 - 기존 공고 날짜 비교
                className = "select";
            }
            // week가 0 이고(반복문에서 초기값이 0) i의 값이 dayOfWeek 보다 작을때
            if (week === 0 && i < dayOfWeek) {
                // 첫번째 주 에서 시작되는 날짜에 앞까지 빈 span 을 렌더링
                // 아래 if 문의 조건에 두번째 조건은 첫번째 주에만 적용되야 하기 때문에 현재 (주) 에서 현재 월에 시작 (주) 를 뺀값이 0이 아닌 조건이 있음
                // 만약 첫번째 (주) 이면 뺀값이 0 이 나오므로 해당 if 문을 타지 않음
                if (isFirstCalendar && moment(curDate).week() - moment(curDate).startOf("month").week() !== 0) {
                    continue;
                }
                html.push(
                    <span key={Math.random()}/>
                );
            } else {
                // 첫번째주 이후 currentDate는 date에 들어온 값
                const currentDate: string = Utils.convertDateToString(date);
                // currentDate 가 시작 날짜와 같거나 크고 lastDate 보다 작거나 같고 endDate 보다 작거나 같으면 날짜 렌더링
                if (((currentDate >= Utils.convertDateToString(startDate)) && currentDate <= Utils.convertDateToString(lastDate)) && currentDate <= endDate) {
                    html.push(
                        <span className={className} onClick={selectCareDate ? () =>  selectCareDate(currentDate) : undefined} key={Math.random()}>
                            {Number(date.format("DD"))}
                        </span>
                    );
                    // currentDate 가 startDate(시작날짜) 빼기 startDate에 요일의 숫자 와 같거나 크고, 
                    // currnetDate 가 endDate 더한값(6 빼기 (startDate에 29를 더하고 해당 값의 요일의 숫자) 보다 작거나 같을때
                    // 이해 안됨 다시 보기
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

    // console.log("selectDate",selectCareDate)
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

export default CareRenderCalendar;


