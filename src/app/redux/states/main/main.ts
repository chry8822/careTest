export type MainState = {
    jobs: any[];
    applicantList: any[];
    lowestPriceJobList: any[];
    careUseList: {
        jobCnt: number,
        jobMatchingCnt: number,
        jobCareTimeYear: number,
        jobCareTimeMonth: number,
        jobAmountTotal: number,
        accumulatedAmount: number
    };
    patientsCnt: number;
    userRate: {
        localRate: number,
        foreignerRate: number,
        manRate: number,
        womanRate: number,
        cgsUsersTotal: number
    };
    pieChartData: {
        data: number[],
        backgroundColor: string[],
        borderWidth: number
    };
    mainReviewList: any[];
}

export const InitialMain: MainState = {
    jobs: [],                 //## 모바일용 공고 목록
    applicantList: [],        //## 실시간 케어메이트 소식 리스트
    lowestPriceJobList: [],   //## 최저가 현황 리스트
    careUseList: {            //## 케어네이션 이용 현황
        jobCnt: 0,            //## 누적 공고 수
        jobMatchingCnt: 0,    //## 누적 거래 건수
        jobCareTimeYear: 0,   //## 누적 간병 시간(일)
        jobCareTimeMonth: 0,  //## 누적 간병 시간(월)
        jobAmountTotal: 0,    //## 누적 거래 금액
        accumulatedAmount: 0  //## 누적 승인 금액
    },
    patientsCnt: 0,       //## 마이페이지 > 환자 목록에 등록한 환자 수
    userRate: {           //## 간병 중인 케어메이트 정보
        localRate: 0,     //## 내국인 비율
        foreignerRate: 0, //## 외국인 비율
        manRate: 0,       //## 남자 비율
        womanRate: 0,     //## 여자 비율
        cgsUsersTotal: 0  //## 가입 케어메이트
    },
    pieChartData: {      //## 간병 중인 케어메이트 정보 차트 데이터
        data: [0, 0],
        backgroundColor: ["", ""],
        borderWidth: 0
    },
    mainReviewList: []    //## 보호자님이 남긴 후기
};
