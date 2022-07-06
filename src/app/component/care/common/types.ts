//### 공고 등록 / 수정 / 상세 데이터
export interface CareType {
    jobType: string;              //## 간병 유형 (day: 기간제, time: 시간제)
    requestType: string;          //## 간병 장소(hospital: 병,의원 / home: 집)
    familyId: number;             //## 선택한 가족 Id
    startDate: string;            //## 시작날짜
    startTime: string;            //## 시작시간
    endDate: string;              //## 종료날짜
    endTime: string;              //## 종료시간
    selectOption: number;         //## 시간제 간병 시간 select 옵션
    selectDate: string;           //## 선택한 날짜 문자열
    coronaCheck: number;          //## 코로나 검사 유무
    favoriteGender: number;       //## 우대하는 케어메이트 성별
    name: string;                 //## 환자 이름
    gender: number;               //## 환자 성별 (1: 남자, 2: 여자)
    age: string;                  //## 환자 나이
    height: string;               //## 환자 키
    weight: string;               //## 환자 몸무게
    diagnosis: string;            //## 진단명
    sickroomType: number;         //## 병실 분류
    infectiousDisease: number;    //## 감염성 질환
    infectiousDiseaseEtc: string; //## 감염성 질환 기타사항
    paralysis: number;            //## 마비상태
    move: number;                 //## 거동
    changePosture: number;        //## 욕창
    consciousness: number;        //## 의식상태
    cognitive: number;            //## 인지상태
    cognitiveDementiaEtc: string; //## 치매 기타사항 (선택)
    cognitiveDeliriumEtc: string; //## 섬망 기타사항 (선택)
    somnipathy: number;           //## 수면장애
    somnipathyEtc: string;        //## 수면장애 기타사항 (선택)
    moveToilet: number;           //## 화장실 이동
    moveToiletEtc: string;        //## 화장실 이동 기타사항 (선택)
    toiletType: number;           //## 배뇨/배변
    toiletDiapersEtc: string;     //## 기저귀 기타사항 (선택)
    toiletLineEtc: string;        //## 소변줄 기타사항 (선택)
    stoma: number;                //## 장루
    eat: number;                  //## 식사
    suction: number;              //## 석션
    feeding: number;              //## 피딩
    rehabilitate: number;         //## 재활
    dialysis: number;             //## 투석
    hospitalizeReason: string;    //## 간병 유의사항
    isWantUniform: string;        //## 선호하는 케어메이트 복장
    hospitalId: number;           //## 병원 아이디
    info: string;                 //## 간병 장소
    detail: string;               //## 상세 주소
    address: string;              //## 주소
    addressNameArr: string;       //## 주소
    lat: number;                  //## 위도
    lon: number;                  //## 경도
    hosCode: string;
    locCode: string;
    siCode: string;
    guCode: string;
}

//### 공고 등록 / 수정 간병비 데이터
export interface AmountType {
    amountDay: number;            //## 간병 일 급여
    amountDayFee: number;         //## 간병 일 급여 (수수료 포함)
    amountTime: number;           //## 간병 시급
    amountTimeFee: number;        //## 간병 시급 (수수료 포함)
    total: number;                //## 총 간병비
    totalFee: number;             //## 총 간병비 (수수료 포함)
}

//### 지원한 케어메이트 데이터
export interface ApplicantDataType {
    applicantId: number;          //## 지원 Id
    detailType?: string;          //## 헤더 타입 (applicant: 지원 케어메이트 / payment: 결제 케어메이트)
    jobId?: number;               //## 공고 Id
    jobType?: string;             //## 시간제 공고 24시간 미만/이상 분기 (time: 24시간 미만 / day: 24시간 이상)
    amountDay: number;            //## 일 결제 금액
    amountTime: number;           //## 시간당 결제 금액
    totalAmount: number;          //## 총 결제 금액
    cgsUserId: number;            //## 간병인 Id
    avatar: string;               //## 대표사진 URL
    character: string;            //## 캐릭터 이미지 파일명
    imageType: string;            //## 대표 사진 타입 (character / avatar
    name: string;                 //## 이름
    nickname: string;             //## 외국인 이름
    gender: number;               //## 성별(1: 남자, 2: 여자)
    isForeigner: number;          //## 국적(0: 내국인, 1: 외국인)
    experience?: string;          //## 경력
    age: number;                  //## 나이
    phone?: string;               //## 휴대전화 번호
    license: number;              //## 자격증
    careToilet?: number;          //## 기저귀 환자(0: 없음 / 1: 있음)
    careFeeding?: number;         //## 피딩 환자(0: 없음 / 1: 있음)
    careSuction?: number;         //## 석션 환자(0: 없음 / 1: 있음)
    careBedsore?: number;         //## 욕창 환자(0: 없음 / 1: 있음)
    careTime?: {                  //## 완료한 간병 시간
        day: number,              //### 일
        hour: number,             //### 시
        minute: number            //### 분
    };
    jobCount: {                   //## 간병 상세 횟수
        accident: number,         //### 간병 사고
        cancel: number,           //### 간병 취소
        complete: number,         //### 간병 완료
        work_cnt: number          //### 총 간병 횟수
    };
    rating?: any;                 //## 한 줄 평 평점
    interview?: string;           //## 케어메이트 소개글
    appeal?: string;              //## 다짐 한마디
    graph?: any;                  //## Radar 차트 데이터
    ability_info?: any;           //## 케어메이트가 경험한 환자 상태
    covid19_vaccine_info: any;    //## 백신 접종 상태
}