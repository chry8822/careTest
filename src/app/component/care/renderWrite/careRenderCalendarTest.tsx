import React, { useState } from 'react'
import { CareType } from "../common/types";
import * as Utils from "../../../constants/utils";
import moment from "moment";

interface RenderTimeCalendarProps {
    curDate: object | Date; // 시작 날짜
    jobData: CareType;      // registerData
    selectCareDate?: (date: string) => void; //## 공고 등록 > 간병 기간 선택 메서드
}

const CareRenderCalendarTest = ({ curDate, jobData, selectCareDate }: RenderTimeCalendarProps) => {
    
    let count = 0;
    let calendarData = []; 
    let weekData = [];
    let totalCount = 0;
    const startDay = Number(moment(curDate).format('DD'))
    let year: number = moment(curDate).year();
    let month: number = moment(curDate).month();
    const startDayIndex = new Date(year, month, startDay).getDay()


    let calendarDate = moment([year, month, 1]);
    let startCurDay = Utils.convertDateToString(startDay)




    // 현재 달
    for (let i = startDay - startDayIndex; i <= 31; i++) {
        count++;
        if (i >= startDay) {
            totalCount++;
        }
        weekData.push(i);
        if (count === 7) {
            calendarData.push(weekData.join(','));
            weekData = [];
            count = 0;
        }

        // 다돌았는데, weekData에 데이터가 남아있는경우
        if (i == 31 && count !== 7) {
            calendarData.push(weekData.join(','));
            weekData = [];
            count = 0;
        }
    }

    let nextCalendarDate = [];
    if (totalCount < 30) {
        const nextMonthDayIndex = 1;
        for (let i = 1 - nextMonthDayIndex; i <= 31; i++) {
            count++;
            if (i >= 1) {
                totalCount++;
            }
            weekData.push(i);

            if (totalCount === 30) {
                nextCalendarDate.push(weekData.join(','));
                break;
            }

            if (count === 7) {
                nextCalendarDate.push(weekData.join(','));
                weekData = [];
                count = 0;
            }

            if (i == 31 && count !== 7) {
                nextCalendarDate.push(weekData.join(','));
            }

        }
    }


    
    let className: string = "";

    return (
        <>
          {
            calendarData.map((item) => {
                item.split(',').forEach(() => {
                    <div>asdf</div>
                })
            })
        }
        </>
    )
}

export default CareRenderCalendarTest;