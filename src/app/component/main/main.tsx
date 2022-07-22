import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import * as LocalStorage from '../../constants/localStorage'
import LoadWritePopup from '../../component/care/popup/loadWrite'
import { MainState } from '../../redux/states/main/main';
import { RootState } from '../../redux/store';
import { addMainData } from './../../redux/actions/main/main';

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const SERVER_TYPE = process.env.REACT_APP_SERVER_TYPE;


SwiperCore.use([Pagination, Autoplay]);


const Main = () => {
    
    const mainData: MainState = useSelector((state: RootState) => state.main); //## 메인 리덕스 데이터

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [lowestListFlag, setLowestListFlag] = useState(false)
    const [footerInfoFlag, setFooterInfoFlag] = useState(false)
    const [lowestPriceJobCountDownList, setLowestPriceJobCountDownList] = useState<any[]>([]); //## 최저가 현황 마감시간 안내 리스트
    const [mainBannerPosition, setMainBannerPosition] = useState(1) //## 메인 배너 포지션
    const [countUpCheck, setCountUpCheck] = useState<boolean>(false) // ## 누적 데이터 카운트업 시작 체크

    useEffect(() => {
        Utils.clearHistory();
        mainListApi()
    }, [])






    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################

    /**
     * 후기 작성 시간 비교
     * -----------------------------------------------------------------------------------------------------------------
     */

    const reviewCreatedDate = (time:any) => {
        let currentTime = moment();
        let createdTime = moment(time);
        let reviewDate = currentTime.diff(createdTime, "days") + 1;
        return reviewDate
    }

    /**
     * 최저가현황 카운트다운 Check
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param position : index
     * @param dateTime : 마감 시간 (expired_at)
     */
         const lowestPriceCountDown = (position: number, dateTime: string) => {
            let tempLowestPriceJobCountDownList = lowestPriceJobCountDownList;
    
            let t1 = moment(dateTime).add(1, 'minutes');
            let t2 = moment();
            let flag = moment.duration(t1.diff(t2)).asDays() >= 1;
    
            tempLowestPriceJobCountDownList[position] = (flag ? 24 : moment.duration(t1.diff(t2)).hours()) + "시간 " + moment.duration(t1.diff(t2)).minutes() + "분 " + moment.duration(t1.diff(t2)).seconds() + "초";
            setLowestPriceJobCountDownList(lowestPriceJobCountDownList.concat(tempLowestPriceJobCountDownList));
    
            if (moment.duration(t1.diff(t2)).seconds() < 0) {
                lowestPriceJobListApi(mainData);
            }
        };

    /**
     * 간병장소 선택
     * -----------------------------------------------------------------------------------------------------------------
     */

    const carePlaceSelect = () => {
    let eventToken = Utils.isAuthCheck() ? "eplqfg" : "kbmp4x"; //## Adjust Event Token
    let eventType = Utils.isAuthCheck() ? "care_req_g" : "care_req_m"; //## Analytics Event Type

    //### 간병서비스 신청하기
    Utils.adjustEvent(eventToken);
    Utils.analyticsEvent(eventType);

    if(Utils.isAuthCheck()){
        dispatch(showPopup({element:Popup,action:popupAction,actionType:"login",btnType:"two"}))
        return
    }
    
    //### 작성 중인 공고 있을 때 공고 불러오기 팝업 호출
    if (LocalStorage.getStorage(LocalStorage.LOAD_WRITE_DATA)) {
        dispatch(showPopup({element:LoadWritePopup, action:popupAction,type:"popup", actionType:"load"}));
    } else {
        if (mainData.patientsCnt === 0) {
            navigate("/care/select");
        } else {
            navigate("/care/family/list");
        }
    }


    }


    /**
     * 최저가 현황 마감시간 카운트 다운 처리
     * -----------------------------------------------------------------------------------------------------------------
     */
    useEffect(() => {
        if (mainData.lowestPriceJobList.length > 0) {
            const interval = setInterval(() => {
                for (let i = 0; i < mainData.lowestPriceJobList.length; i++) {
                    if (!Utils.isEmpty(mainData.lowestPriceJobList[i].expired_at)) {
                        lowestPriceCountDown(i, mainData.lowestPriceJobList[i].expired_at);
                    }
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [mainData.lowestPriceJobList]);

    /**
     * 최저가 현황 리스트 -> 공고 상세 페이지 이동
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param job : Object Data
     * @param tabPosition : Tab Position
    */
         const moveJobDetail = (job: any, tabPosition: number) => {
            navigate(`/care/detail/view/${job.job_type}/${job.request_type}/${job.ptr_patients_id}/${job.id}?tab=${tabPosition}`);
        };
    
    
        
    
    /**
     * CountUP 감시 (observer intersection)
     * -----------------------------------------------------------------------------------------------------------------
     */

    const observerRef = useRef(null);

    useEffect(() => {
        if (!countUpCheck) {
            window.scrollTo(0, 0)
        }
        if (observerRef.current) {
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
                setCountUpCheck(true)
            }
        });
    }, [mainData.careUseList, countUpCheck])
    
    


    //##################################################################################################################
    //##
    //## >> Method : Render
    //##
    //##################################################################################################################

    /**
     * 메인 베너 렌더링
     * -----------------------------------------------------------------------------------------------------------------
     */
    const renderMainbanner = () => {
        return (
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                className="mySwiper"
                loop={true}
                autoplay={{ delay: 2500 }}
                onSlideChange={(e) => {
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


    /**
     * 최저가 지원 현황 렌더링
     * -----------------------------------------------------------------------------------------------------------------
     */


    const renderLowstPriceApply = () => {
        let html: any[] = [];
        mainData.lowestPriceJobList.map((item: any, idx: any) => {
            // if (idx !== 0) {
                html.push(
                    <li 
                        key={idx}
                        onClick={()=> {
                            navigate(`/care/detail/view/${item.job_type}/${item.request_type}/${item.ptr_patients_id}/${item.id}?tab=1`)
                        }}
                    >
                        {/* <a href=""  onClick={() => moveJobDetail(item, 1)}> */}
                        <img
                            src={item.job_type === "day" ? "/images/timeCareUpLabel.svg" : "/images/timeCareDownLabel.svg"}
                            alt="시간제 간병"
                            className="timeCareLabel"
                            onError={Utils.imgSrcError}
                        />
                        <div className="Job__list--label">
                            {
                                !Utils.isEmpty(item.expired_at) &&
                                <span className="label RD">
                                    마감{lowestPriceJobCountDownList[0] ? lowestPriceJobCountDownList[0] : "진행중"}
                                </span>
                            }
                            <span className="label GY">
                                지원한 케어메이트 : {Utils.numberWithCommas(item.applicant_count)}명
                            </span>
                        </div>
                        <dl className="Job__list--info">
                            <div>
                                <dt>간병일</dt>
                                <dd>{moment(item.job_start_date).format("MM월 DD일 HH시")}</dd>
                            </div>
                            <div>
                                <dt>현재 최저가</dt>
                                {
                                    item.job_type === "day" ?
                                        <dd>
                                            {Utils.numberWithCommas(item.applicant_min_amount.amount_day_fee)}원
                                        </dd>
                                        :
                                        <dd>
                                            {Utils.numberWithCommas(item.applicant_min_amount.amount_time_fee)}원
                                        </dd>
                                }
                            </div>
                        </dl>
                        {/* </a> */}
                    </li>
                )
            // }
        })
        return html;
    }


   /**
     * 보호자 후기 렌더링
     * -----------------------------------------------------------------------------------------------------------------
     */

    const renderReview = () => {
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

        let listData: any[] = [];
        if (Utils.isEmpty(mainData.mainReviewList) || mainData.mainReviewList.length === 0) {
            return listData;
        }

        mainData.mainReviewList.forEach((item: any, index: any) => {
            listData.push(
                <a key={index}>
                    <div className="mainRev__link--tit">
                        {
                            Utils.isEmpty(item.prt_user) ?
                                <h3 className="txtStyle05-Wbold"><span className="txtStyle06-C777W500">탈퇴한 보호자</span></h3>
                                :
                                <h3 className="txtStyle05-Wbold">{item.prt_user.name}<span className="txtStyle06-C777W500">보호자</span></h3>
                        }
                        <time className="txtStyle06-C777">{reviewCreatedDate(item.created_at)}일 전</time>
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
    }, [mainData.mainReviewList]);


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
                        <dd><CountUp totalNumber={mainData.careUseList.jobCnt} countUpCheck={countUpCheck} /></dd>
                    </div>
                    <div>
                        <dt><span><CountUp totalNumber={mainData.careUseList.jobCareTimeYear} countUpCheck={countUpCheck} /></span></dt>
                        <dd>누적 간병시간</dd>
                    </div>
                </dl>
                <div className="mainItemWrap__history--acc">
                    <h3 className="txtStyle04-C333Wnoml">누적 승인 금액</h3>
                    <p className="txtStyle03-Bold"><CountUp totalNumber={mainData.careUseList.accumulatedAmount} countUpCheck={countUpCheck} /></p>
                </div>
            </React.Fragment>
        );
        return html;
    }, [mainData.careUseList, countUpCheck]);

    /**
     * 실시간 케어메이트 소식 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */

    //  랜덤으로 나타남
    //  노란색 : mainNews__list--YL
    //  초록색 : mainNews__list--GR
    //  파란색 : mainNews__list--BL

    const renderCareMate = () => {
        return (
            <Slider
                autoplay={true}
                autoplaySpeed={1000}
                arrows={false}
                infinite={true}
                touchMove={false}
                slidesToShow={1}
            >
                {
                    mainData.applicantList.map((item: any, index: any) => {
                        return (
                            <article className=
                                {
                                    "mainNews__list--" +
                                    (index < 6 ?
                                        (index % 3 === 0 ? "YL" : (index % 3 === 1 ? "GR" : "BL"))
                                        :
                                        (index % 3 === 0 ? "GR" : (index % 3 === 1 ? "BL" : "YL")))
                                }>
                                <h3 className="txtStyle03-Wnoml">
                                    보호자 <strong>{item.name}님</strong> 공고에<br />
                                    <strong>케어메이트 지원 완료!</strong>
                                </h3>
                                <p className="txtStyle04-C555Wnoml">
                                    {item.loc}
                                </p>
                                <div>
                                    <span className="txtStyle06-W500">총 지원</span>
                                    <p className="txtStyle01-Wbold">{Utils.numberWithCommas(item.cnt)}명</p>
                                </div>
                            </article>
                        )
                    })
                }
            </Slider>
        )
    }


    
    //##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################



    /**
     * 메인 리스트 Api
     * -----------------------------------------------------------------------------------------------------------------
     */

    const mainListApi = () => {
        Api.mainList().then((response: any) => {
            if (response.status === 200) {
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
                    dispatch(addMainData(jobj))
                    if (!Utils.isAuthCheck()) {
                        lowestPriceJobListApi(jobj);
                    }
                    else {
                        // dispatch(showPopup({element:Popup,action:popupAction,content:data.message}))
                    }
                }
            }
        }).catch(err => {
            console.log(err)
            dispatch(showPopup({ element: Popup, action: popupAction }));
        })
    }
    
    /**
     * 최저가 현황 리스트 Api
     * -----------------------------------------------------------------------------------------------------------------
     */
    const lowestPriceJobListApi = (mainData: any) => {
        try {
            Api.lowestPriceList().then((response: any) => {
                if (response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        dispatch(addMainData({
                            ...mainData,
                            lowestPriceJobList: data.data
                        }))
                    } else {
                        dispatch(showPopup({ element: Popup, content: data.massage }))
                    }
                } else {
                    dispatch(showPopup({ element: Popup }))
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({ element: Popup }))
            });
        } catch (e) {
            console.log(e);
            dispatch(showPopup({ element: Popup }))
        }
    }
    


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
        if(type === "login"){
            navigate("/care/login")
        }else if (type === "new") { //## 공고 불러오기 팝업 - 새로 등록
            LocalStorage.remove(LocalStorage.LOAD_WRITE_DATA);

            if (mainData.patientsCnt === 0) {
                navigate("/care/select");
            } else {
                navigate("/care/family/list");
            }
        } else if (type === "load") { //## 공고 불러오기 팝업 - 불러오기
            const tempLoadWriteData = LocalStorage.getStorage(LocalStorage.LOAD_WRITE_DATA);
            if (tempLoadWriteData) {
                let loadWriteData = JSON.parse(tempLoadWriteData);
                navigate(`/care/write/register/${loadWriteData.step}/${loadWriteData.jobType}/${loadWriteData.requestType}/${loadWriteData.familyId}`);
            }
        }
    }




    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################


    return (
        <>
            <Header
                login={true}
            />
            <main>
                <div className="subWrap">
                    <section className={`${!Utils.isAuthCheck() && "breakLine"}`}>
                        <div className="mainBanSlick">
                            {renderMainbanner()}
                            <div style={{ zIndex: 1 }} className="mainBanSlick__page"><span>{mainBannerPosition}</span> / 3</div>
                        </div>

                        <article className="mainBgGray">

                            {
                                !Utils.isAuthCheck() && mainData.lowestPriceJobList.length > 0 &&
                                <div className="commonWrap12">
                                {/* <!--
                                 모바일 웹일 때 : 공고 없을 경우 공고 없다는 메세지가 따로 보여지게 / 공고 리스트는 app과 같은 형식으로 진행
                                --> */}
                                {/* <div className="mainJobList">
                                    <div className="Job__tit">
                                        <h2 className="txtStyle02">공고 목록 (<span>0</span>/3)</h2>
                                    </div>
                                    <div className="mainJobList__none">
                                        <img src="../images/noneMainList.svg" alt="" />
                                        <p className="txtStyle04-W500">등록하신 공고가 없습니다.</p>
                                    </div>
                                </div> */}

                                    <div className="mainJobList">
                                        <div className="Job__tit">
                                            <h2 className="txtStyle02">최저가 지원 현황</h2>
                                        </div>
                                        <ul className="Job__list">
                                            {!lowestListFlag ? renderLowstPriceApply()[0] : renderLowstPriceApply()}
                                        </ul>
                                        {/* <!-- mainJob__btn 클릭시 open 추가 --> */}
                                        <button 
                                            type="button" 
                                            className={`mainJob__btn ${lowestListFlag && " open"}`}
                                            onClick={() => 
                                                {
                                                    setLowestListFlag(!lowestListFlag)
                                                    window.scrollTo(0,0)
                                                }}
                                        >
                                            <span>{!lowestListFlag ? mainData.lowestPriceJobList.length - 1  + "건의 간병 현황 더 보기" : "닫기"}</span>
                                        </button>
                                    </div>
                                </div>
                            }
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
                                            <MemoPiechart graph={mainData.pieChartData} />
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
                            <div className="mainRev__link">
                                {renderReview()}
                            </div>
                        </article>


                        {/* 실시간 공고 현황 데이터 붙이고 map 렌더링 */}

                        <article className="mainNews breakLine">
                            <div className="mainItemWrap__tit">
                                <h2 className="txtStyle02">실시간 케어메이트 소식 <span className="live">실시간</span></h2>
                            </div>
                            <div className="mainNews__list" style={{ overflow: "hidden" }}>
                                {renderCareMate()}
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
                {/* <!-- app : mainBtn__bottom   모바일 : mainBtn__bottom mobile  --> */}
                <section className={"mainBtn__bottom" + (SERVER_TYPE === "MOBILE" ? "mobile" : "")}>
                    <button
                        type="button"
                        onClick={() => carePlaceSelect()}
                    // 작성중인 데이터 확인
                    >간병 서비스 신청하기</button>
                </section>
                <section>
                    <h2 className="a11y-hidden">회사 법적 이슈 관련한 링크</h2>
                    <ul className="footer__link">
                        {/* <li><a href="">사업자 정보 확인</a></li> */}
                        <li><a onClick={() => window.open("https://ci_protector.app.carenation.kr/clause/detail?detailType=agree", "_blank")}>이용약관</a></li>
                        <li><a onClick={() => window.open("https://ci_protector.app.carenation.kr/clause/detail?detailType=user", "_blank")}>개인정보처리방침</a></li>
                    </ul>
                    <p className="txtStyle06-C777">
                        주식회사 에이치엠씨 네트웍스는 통신판매중개자로서 거래에 필요한 시스템을 운영 및
                        제공합니다. 보호자와 케어메이트 사이에 발생 분쟁에 대한 책임은 보호자와 케어메이트에게
                        있습니다.
                    </p>
                </section>
                {/* <!-- h2 클릭시 footer__company에 active 추가 --> */}
                <section className={"footer__company" + (footerInfoFlag ? " active" : "")}>
                    <h2 className="txtStyle06-C555Wnoml"
                        onClick={() => {
                            setFooterInfoFlag(!footerInfoFlag)
                        }}
                    >주식회사 에이치엠씨 네트웍스 사업자 정보</h2>
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