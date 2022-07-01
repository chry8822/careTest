import React,{ useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showPopup, hidePopup } from '../../redux/actions/popup/popup';
import Popup from "../common/popup";
import MainNavigator from './navigator/navigator'
import Header from '../common/header';
import { MemoPiechart } from '../common/chart'
import Api from '../../api/api'
import { CountUp } from './../common/countUp';
import * as Utils from '../../constants/utils'
import moment from 'moment'
import Slider from "react-slick";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

SwiperCore.use([Pagination, Autoplay]);

type mainStateType = {
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
        pieChartData: any[];
        mainReviewList: any[];
}


const Main = () => {

   

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ mainBannerPosition, setMainBannerPosition ] = useState(1) //## 메인 배너 포지션
    const [ countUpCheck, setCountUpCheck ] = useState<boolean>(false) // ## 누적 데이터 카운트업 시작 체크
    const [ mainData, setMainData ] = useState<mainStateType>({ //## 메인 데이터
        jobs: [],
        applicantList: [],        
        lowestPriceJobList: [],   
        careUseList: {            
            jobCnt: 0,           
            jobMatchingCnt: 0,    
            jobCareTimeYear: 0,   
            jobCareTimeMonth: 0,  
            jobAmountTotal: 0,    
            accumulatedAmount: 0  
        },
        patientsCnt: 0,       
        userRate: {           
            localRate: 0,     
            foreignerRate: 0, 
            manRate: 0,       
            womanRate: 0,     
            cgsUsersTotal: 0  
        },
        pieChartData: [],     
        mainReviewList: []    
    }
)

// const graphData = {
//     ...mainData.pieChartData
// }

console.log("job",mainData.jobs)

    useEffect(() => {
        mainListApi()
    },[])

    const mainListApi = () => {
        Api.mainList().then((response: any) => {
            if(response.status === 200) {
                let data = response.data;
                if (data.code === 200) {
                    let tempCareUseList: any = {};
                    if (data.data.use_list) {
                        let jobCareTime: number = Number(data.data.use_list.job_care_time);
                        tempCareUseList = {
                            jobCnt: data.data.use_list.job_cnt,
                            jobMatchingCnt: data.data.use_list.job_matching_cnt,
                            jobCareTimeYear: Math.floor(jobCareTime / 365),
                            jobCareTimeMonth: jobCareTime % 365,
                            jobAmountTotal: data.data.use_list.job_amount_total,
                            accumulatedAmount: data.data.use_list.accumulated_amount
                        };
                    }
                    let jobj: any = {
                        ...mainData,
                        jobs: data.data.jobs,
                        applicantList: data.data.applicant,
                        lowestPriceJobList: Utils.isAuthCheck() ? [] : mainData.lowestPriceJobList,
                        careUseList: tempCareUseList,
                        patientsCnt: data.data.patients_cnt,
                        userRate: {
                            localRate: parseFloat(Number(data.data.user_rate.local_rate).toFixed(1)),
                            foreignerRate: parseFloat(Number(data.data.user_rate.foreigner_rate).toFixed(1)),
                            manRate: parseFloat(Number(data.data.user_rate.man_rate).toFixed(1)),
                            womanRate: parseFloat(Number(data.data.user_rate.woman_rate).toFixed(1)),
                            cgsUsersTotal: Number(data.data.user_rate.cgs_users_total)
                        },
                        pieChartData: {
                            data: [parseFloat(Number(data.data.user_rate.local_rate).toFixed(1)), parseFloat(Number(data.data.user_rate.foreigner_rate).toFixed(1))],
                            backgroundColor: ["#bc8877", "#e8bdaf"],
                            borderWidth: 0
                        },
                        mainReviewList: data.data.rating
                    }
                    setMainData(jobj)
                    // if(!Utils.isAuthCheck()) {
                        lowestPriceJobListApi(jobj);
                    // }
                }
            }
        }).catch(err => {
            console.log(err)
            dispatch(showPopup({element:Popup, action:popupAction}));
        })
    }


    console.log(mainData.jobs)
    /**
     * 최저가 현황 리스트 Api
     * -----------------------------------------------------------------------------------------------------------------
     */
    const lowestPriceJobListApi = (mainData: any) => {
        try {
            Api.lowestPriceList().then((response:any) => {
                if(response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        setMainData({
                            ...mainData,
                            lowestPriceJobList: data.data
                        })
                    } else {
                        dispatch(showPopup({element:Popup,content:data.massage}))
                    }
                } else {
                    dispatch(showPopup({element:Popup}))
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup}))
            });
        } catch(e) {
            console.log(e);
            dispatch(showPopup({element:Popup}))
        }
    }


 
 
    // 메인 배인 렌더링
    const renderMainbanner = () => {
        return (
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                className="mySwiper"
                loop={true}
                autoplay={{ delay: 2500 }}
                onSlideChange={(e)=> {
                    setMainBannerPosition(e.realIndex + 1)
                }}
                allowTouchMove={true}
            >
                <SwiperSlide>
                    <article className="mainInsur">
                        <p className="txtStyle05-C333">국내 최초 보험 가입 자동화</p>
                        <h2 className="txtStyle01">
                        삼성화재<br />
                        간병인배상책임보험 출시
                        </h2>
                        <img src="../images/mainInsurLogo.svg" alt="케어네이션 x 삼성화재" />
                   </article>
                </SwiperSlide>
                <SwiperSlide>
                    <article className="mainImg">
                        <div className="mainImg__txt">
                        <img src="../images/loginTit.svg" alt="대한민국 1등 간병앱" />
                        <h2 className="txtStyle01">
                            <strong>서울</strong>에서 <strong>제주</strong>까지<br />
                            24시간 <strong>실시간</strong> 매칭 중!
                        </h2>
                        <p className="txtStyle05-C333">가장 많은 간병인이 선택했어요!</p>
                        </div>
                    </article>
                </SwiperSlide>
                <SwiperSlide>
                    <article className="careMateBan"></article>
                </SwiperSlide>
            </Swiper>
        )
    } 

    // 보호자 후기 렌더링 (swiper 라이브러리는 vertical 시 자동으로 높이를 가지고 있는데 커스텀 안되서 react-slick 사용)

    const renderReview = () =>  {
        let settings = {
            infinite: true,
            autoplaySpeed: 1000,
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            vertical: true,
            arrows: false,
            touchMove: false
        };
        return (
            <Slider {...settings}>
                {reviewList}
            </Slider>
        )
    }
     
    
    const reviewList = useMemo(() => {

        let listData :any[] = [];
        console.log("listData",listData)
        if (Utils.isEmpty(mainData.mainReviewList) || mainData.mainReviewList.length === 0) {
            return listData;
        }
        
        mainData.mainReviewList.forEach((item:any, index:any) => {
            listData.push(
                        <a href="" key={index}>
                            <div className="mainRev__link--tit">
                                {
                                    Utils.isEmpty(item.prt_user) ?
                                        <h3 className="txtStyle05-Wbold"><span className="txtStyle06-C777W500">탈퇴한 보호자</span></h3>
                                        :
                                        <h3 className="txtStyle05-Wbold">{item.prt_user.name}<span className="txtStyle06-C777W500">보호자</span></h3>
                                }
                                <time className="txtStyle06-C777">{(item.created_at)}</time>
                            </div>
                            <figure className="ratingGroup">
                                <img src="../images/reviewStar03.svg" alt="종합평점" />
                                <figcaption className="txtStyle05">{item.rating.toFixed(1)}</figcaption>
                            </figure>
                            <div className="mainRev__link--txt">
                                <span className="txtStyle06-C333">{Utils.isEmpty(item.cgs_user) ? "탈퇴한 케어메이트에게" : item.cgs_user.name + " 케어메이트에게"}</span>
                                <p className="txtStyle04-C333">{item.content}</p>
                            </div>
                        </a>
            ) 
        });
        return listData;
    },[mainData.mainReviewList]);



      /**
     * 보호자님이 남긴 후기 작성 시간 계산
     * -----------------------------------------------------------------------------------------------------------------
     */
       const formatSubmitDate = (createdAt: string) => {
        const curDate = moment();
        const diffSecond = curDate.diff(moment(createdAt), 'seconds');

        if (diffSecond < 60) {
            return diffSecond + "초 전";
        } else if (diffSecond < 60 * 60) {
            return Math.floor(moment.duration(curDate.diff(moment(createdAt))).asMinutes()) + "분 전";
        } else if (diffSecond < 60 * 60 * 24) {
            return Math.floor(moment.duration(curDate.diff(moment(createdAt))).asHours()) + "시간 전";
        } else {
            return Math.floor(moment.duration(curDate.diff(moment(createdAt).format("YYYY-MM-DD"))).asDays()) + "일 전";
        }
    };


      /**
     * 케어네이션 이용 현황 카운트 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */
       const renderUsageCount = useMemo(() => {
        let html: any[] = [];
        html.push(
            <React.Fragment key={Math.random()}>
                  <dl className="mainItemWrap__history--list">
                    <div>
                        <dt>누적 이용 건수</dt>
                        <dd><CountUp totalNumber={mainData.careUseList.jobCnt} countUpCheck={countUpCheck}/></dd>
                    </div>
                    <div>
                        <dt><span><CountUp totalNumber={mainData.careUseList.jobCareTimeYear} countUpCheck={countUpCheck}/></span></dt>
                        <dd>누적 간병시간</dd>
                    </div>
                </dl>
                <div className="mainItemWrap__history--acc">
                    <h3 className="txtStyle04-C333Wnoml">누적 승인 금액</h3>
                    <p className="txtStyle03-Bold"><CountUp totalNumber={mainData.careUseList.accumulatedAmount} countUpCheck={countUpCheck}/></p>
                </div>
            </React.Fragment>
        );
        return html;
    }, [mainData.careUseList, countUpCheck]);





    //옵저버

    const observerRef = useRef(null);

    useEffect(() => {
       if(!countUpCheck) {
           window.scrollTo (0,0)
       }
        if (observerRef.current) {
        console.log("등록")
          let options = {
            root: null,
            rootMargin: '0px',
            threshold: 0
          }
          
          const observer = new IntersectionObserver(callback, options);
          observer.observe(observerRef.current)  
        }
      }, [observerRef.current])

      const callback = useCallback((entries: any, observer: any) => { 
        entries.forEach((entry: any) => {
          if (entry.intersectionRatio) {
              observer.unobserve(observerRef.current); 
              console.log("셋팅")
              console.log("해제")
            setCountUpCheck(true)
          }
        });
      }, [mainData.careUseList,countUpCheck])



          /**
     * Scroll Listener
     * -----------------------------------------------------------------------------------------------------------------
     */
    // const scrollListener = useCallback(() => {
    //     const scrollTop = document.documentElement.scrollTop; //## 이미 스크롤되어서 보이지 않는 구간의 높이
    //     const clientHeight = document.documentElement.clientHeight; //## 사용자에게 보여지는 페이지의 높이

    //     //## 케어네이션 이용 현황 스크롤 위치에 닿으면 number scrolling 처리
    //     if (observerRef.current && observerRef.current?.offsetTop + ((observerRef.current?.offsetHeight) - 70) < (scrollTop + clientHeight)) {
    //         countUpCheck(true);
    //     }
    // }, []);



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
    }


    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################


    return (
        <>
            <Header
            />
            <main>
                <div className="subWrap">
                    <section className="breakLine">
                        <div className="mainBanSlick">
                            {renderMainbanner()} 
                            <div style={{zIndex: 1}} className="mainBanSlick__page"><span>{mainBannerPosition}</span> / 3</div>
                        </div>

                        <article className="mainBgGray">
                        
                            <div className="commonWrap12">
                                {/* <!--
                            모바일 웹일 때 : 공고 없을 경우 공고 없다는 메세지가 따로 보여지게 / 공고 리스트는 app과 같은 형식으로 진행
                            --> */}
                                <div className="mainJobList">
                                    <div className="Job__tit">
                                        <h2 className="txtStyle02">공고 목록 (<span>2</span>/3)</h2>
                                    </div>
                                    <div className="mainJobList__none">
                                        <img src="../images/noneMainList.svg" alt="" />
                                        <p className="txtStyle04-W500">등록하신 공고가 없습니다.</p>
                                    </div>
                                    {/* <ul className="Job__list">
                                        <li>
                                            <a href="">
                                                <img
                                                    src="../images/timeCareDownLabel.svg"
                                                    alt="시간제 간병"
                                                    className="timeCareLabel"
                                                />
                                                <div className="Job__list--label">
                                                    <span className="label RD">진행중</span>
                                                    <span className="label GY">지원한 케어메이트 : 2명</span>
                                                </div>
                                                <dl className="Job__list--info">
                                                    <div>
                                                        <dt>간병일</dt>
                                                        <dd>06월 24일 21시</dd>
                                                    </div>
                                                    <div>
                                                        <dt>현재 최저가</dt>
                                                        <dd>80,000원</dd>
                                                    </div>
                                                </dl>
                                            </a>
                                        </li>
                                    </ul> */}
                                </div>
                                <div className="mainJobList">
                                    <div className="Job__tit">
                                        <h2 className="txtStyle02">최저가 지원 현황</h2>
                                    </div>
                                    <ul className="Job__list">
                                        <li>
                                            <a href="">
                                                <img
                                                    src="../images/timeCareDownLabel.svg"
                                                    alt="시간제 간병"
                                                    className="timeCareLabel"
                                                />
                                                <div className="Job__list--label">
                                                    <span className="label RD">진행중</span>
                                                    <span className="label GY">지원한 케어메이트 : 2명</span>
                                                </div>
                                                <dl className="Job__list--info">
                                                    <div>
                                                        <dt>간병일</dt>
                                                        <dd>06월 24일 21시</dd>
                                                    </div>
                                                    <div>
                                                        <dt>현재 최저가</dt>
                                                        <dd>80,000원</dd>
                                                    </div>
                                                </dl>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="">
                                                <img
                                                    src="../images/timeCareUpLabel.svg"
                                                    alt="시간제 간병"
                                                    className="timeCareLabel"
                                                />
                                                {/* <!-- 마감 시간 있는 것만 strong 태그 추가--> */}
                                                <div className="Job__list--label">
                                                    <span className="label RD"><strong>마감 00시간 00분 00초</strong></span>
                                                    <span className="label GN">지원한 케어메이트 : 5명</span>
                                                </div>
                                                <dl className="Job__list--info">
                                                    <div>
                                                        <dt>간병일</dt>
                                                        <dd>06월 24일 21시</dd>
                                                    </div>
                                                    <div>
                                                        <dt>현재 최저가</dt>
                                                        <dd>80,000원</dd>
                                                    </div>
                                                </dl>
                                            </a>
                                        </li>
                                    </ul>
                                    {/* <!-- mainJob__btn 클릭시 open 추가 --> */}
                                    <button type="button" className="mainJob__btn open">
                                        <span>00</span>건의 간병 현황 더 보기
                                    </button>
                                </div>
                            </div>
                        </article>
                    </section>
                    <section className="mainItemWrap">
                        <article className="mainStatus breakLine pt28">
                            <div className="mainItemWrap__tit">
                                <h2 className="txtStyle02">케어네이션 이용 현황</h2>
                                <p className="txtStyle05-Cbrown">서비스 출시부터 현재까지의 기록입니다.</p>
                            </div>
                            <div className="mainItemWrap__history">
                                <article className="mainItemWrap__history--chart">
                                    <h3 className="txtStyle03">케어네이션 케어메이트 현황</h3>
                                    <dl>
                                        <dt className="txtStyle04-C333">가입 케어메이트</dt>
                                        <dd className="txtStyle03-Bold">{mainData.userRate.cgsUsersTotal}명</dd>
                                    </dl>


                                    <div className="mainChart">
                                        <div className="mainChart__pie">
                                            {/* 차트 넣는 자리 */}
                                            <div style={{padding:"16px 0 20px", margin:"16px 0 20px"}}>
                                                {/* <MemoPiechart graph={mainData.pieChartData}/> */}
                                            </div>
                                        </div>
                                        <div className="mainChart__legend">
                                            <dl>
                                                <div>
                                                    <dt>내국인</dt>
                                                    <dd>{mainData.userRate.localRate}</dd>
                                                </div>
                                                <div>
                                                    <dt>외국인</dt>
                                                    <dd>{mainData.userRate.foreignerRate}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <div className="mainChart__line">
                                            <div className="mainChart__line--chart">
                                                <div style={{ width: "41%" }}></div>
                                            </div>
                                            <div className="mainChart__line--detail">
                                                <p>여성 : <span>{mainData.userRate.womanRate}</span></p>
                                                <p>남성 : <span>{mainData.userRate.manRate}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="txtStyle06-C777">* 인증 케어메이트 기준</p>
                                </article>
                                    {renderUsageCount}
                            </div>
                        </article>
                        <article className="mainRev breakLine">
                            <div className="mainRev__Tit">
                                <h2 className="txtStyle02"
                                   ref={observerRef}
                                >보호자님이 남긴 후기</h2>
                                <a href="">전체보기</a>
                            </div>

                            {/* 보호자 후기 데이터 붙이고 map으로 렌더링 */}
                            <div className="mainRev__link" style={{overflow:"hidden"}}>
                              {/* <div className="mainRev__link"> */}
                              {renderReview()}
                            </div>
                        </article>


                        {/* 실시간 공고 현황 데이터 붙이고 map 렌더링 */}

                        <article className="mainNews breakLine">
                            <div className="mainItemWrap__tit">
                                <h2 className="txtStyle02">실시간 케어메이트 소식 <span className="live">실시간</span></h2>
                            </div>
                            <div className="mainNews__list">
                                {/* <!-- 
                                랜덤으로 나타남
                                노란색 : mainNews__list--YL
                                초록색 : mainNews__list--GR
                                파란색 : mainNews__list--BL
                                --> */}
                                <article className="mainNews__list--YL">
                                    <h3 className="txtStyle03-Wnoml">
                                        보호자 <strong>홍*동님</strong> 공고에<br />
                                        <strong>케어메이트 지원 완료!</strong>
                                    </h3>
                                    <p className="txtStyle04-C555Wnoml">
                                        서울 대학교 병원 서울 대학교 병원 서울 대학교 병원 서울 대학교 병원
                                    </p>
                                    <div>
                                        <span className="txtStyle06-W500">총 지원</span>
                                        <p className="txtStyle01-Wbold">2명</p>
                                    </div>
                                </article>
                                <article className="mainNews__list--GR">
                                    <h3 className="txtStyle03-Wnoml">
                                        보호자 <strong>홍*동님</strong> 공고에<br />
                                        <strong>케어메이트 지원 완료!</strong>
                                    </h3>
                                    <p className="txtStyle04-C555Wnoml">서울 대학교 병원</p>
                                    <div>
                                        <span className="txtStyle06-W500">총 지원</span>
                                        <p className="txtStyle01-Wbold">2명</p>
                                    </div>
                                </article>
                                <article className="mainNews__list--BL">
                                    <h3 className="txtStyle03-Wnoml">
                                        보호자 <strong>홍*동님</strong> 공고에<br />
                                        <strong>케어메이트 지원 완료!</strong>
                                    </h3>
                                    <p className="txtStyle04-C555Wnoml">서울 대학교 병원</p>
                                    <div>
                                        <span className="txtStyle06-W500">총 지원</span>
                                        <p className="txtStyle01-Wbold">2명</p>
                                    </div>
                                </article>
                            </div>
                        </article>



                        {/* 간병정보 링크 연결*/}
                        <article>
                            <div className="mainItemWrap__tit">
                                <h2 className="txtStyle02">케어네이션 간병정보</h2>
                            </div>
                            <div className="mainItemWrap__info">
                                <div className="mainItemWrap__info--item">
                                    <a onClick={() => window.open('https://ci_protector.app.carenation.kr/guide/trade-info', '_blank')} className="pink">
                                        <h3 className="txtStyle02">
                                            케어메이트와 따로<br />
                                            직거래하면 안되나요?
                                        </h3>
                                        <p className="txtStyle05-C555">정답 확인해보세요!</p>
                                    </a >
                                </div>
                                <div className="mainItemWrap__info--item">
                                    <a onClick={() => window.open('https://ci_protector.app.carenation.kr/guide/insurance', '_blank')} className="purple">
                                        <h3 className="txtStyle02">
                                            간병인 구하기 전 <br />
                                            필수로 확인해야할 이것은?
                                        </h3>
                                        <p className="txtStyle05-C555">보호자 아보카도님의 사연 보기</p>
                                    </a >
                                </div>
                                <div className="todayEnt">
                                    <a onClick={() => window.open('https://ci_protector.app.carenation.kr/community/carenatoon', '_blank')}>
                                        <p className="txtStyle04-W500">환자와 간병인의 이야기</p>
                                        <h3 className="txtStyle02">케어네이툰</h3>
                                        <span className="txtStyle05-C555W500">보러가기</span>
                                    </a >
                                </div>
                            </div>
                            <div className="mainItemWrap__comu">
                                <h3 className="a11y-hidden">간병케어백과로 들어가기</h3>
                                <a href="">
                                    <h4 className="txtStyle03">간병노하우 대방출!</h4>
                                    <p>간병케어백과를 <strong>100% 무료</strong> 공개 합니다!</p>
                                    <span>보러가기</span>
                                </a>
                            </div>
                        </article>
                    </section>
                </div>
            </main>



            {/* <!-- 푸터  링크 연결  간병 서비스 신청 버튼 연결 , 사업자 정보 토글설정 --> */}
            <footer>
                {/* <!-- 
            app : mainBtn__bottom
            모바일 : mainBtn__bottom mobile
            --> */}
                <section className="mainBtn__bottom">
                    <button type="button">간병 서비스 신청하기</button>
                </section>
                <section>
                    <h2 className="a11y-hidden">회사 법적 이슈 관련한 링크</h2>
                    <ul className="footer__link">
                        <li><a href="">사업자 정보 확인</a></li>
                        <li><a href="">이용약관</a></li>
                        <li><a href="">개인정보처리방침</a></li>
                    </ul>
                    <p className="txtStyle06-C777">
                        주식회사 에이치엠씨 네트웍스는 통신판매중개자로서 거래에 필요한 시스템을 운영 및
                        제공합니다. 보호자와 케어메이트 사이에 발생 분쟁에 대한 책임은 보호자와 케어메이트에게
                        있습니다.
                    </p>
                </section>
                {/* <!-- h2 클릭시 footer__company에 active 추가 --> */}
                <section className="footer__company active">

                    <h2 className="txtStyle06-C555Wnoml">주식회사 에이치엠씨 네트웍스 사업자 정보</h2>
                    <dl className="footer__company--open">
                        <dt>서비스명</dt>
                        <dd>케어네이션</dd>
                        <dt>서비스 주소지</dt>
                        <dd>서울 강남구 테헤란로8길 37 한동빌딩 5층</dd>
                        <dt>회사명</dt>
                        <dd>주식회사 에이치엠씨네트웍스</dd>
                        <dt>사업장 주소지</dt>
                        <dd>충청남도 천안시 동남구 삼룡1길 50</dd>
                        <dt>사업자등록번호</dt>
                        <dd>212-86-05451</dd>
                        <dt>대표자명</dt>
                        <dd>김견원</dd>
                        <dt>개인정보관리책임자</dt>
                        <dd>서대건</dd>
                        <dt>통신판매업신고</dt>
                        <dd>2019-경기광주-1399호</dd>
                        <dt>이메일</dt>
                        <dd>help@carenation.kr</dd>
                        <dt>고객센터 전화번호</dt>
                        <dd>1811-5949</dd>
                        <dt>
                            고객센터, <br />
                            카카오톡 운영 시간
                        </dt>
                        <dd>
                            월 ~ 목요일(오전 10시 ~ 오후 5시 30) <br />
                            금요일(오전 10시 ~ 오후 5시)<br />
                            법정공휴일 휴무
                        </dd>
                        <dt>호스팅 사업자</dt>
                        <dd>Amazon Web Services(AWS)</dd>
                    </dl>
                </section>
            </footer>

            <MainNavigator />
        </>
    )
}

export default Main;