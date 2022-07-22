import React, { useState, useEffect, useRef, useMemo } from 'react'
import Header from '../common/header';
import Navigator from '../main/navigator/navigator';
import { throttle } from 'lodash';
import { CareType, ApplicantDataType } from './common/types';
import { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import * as Utils from '../../constants/utils'
import Api from '../../api/api'
import { useParams, useNavigate } from 'react-router-dom';
import Popup from '../common/popup';
import { showPopup, hidePopup } from '../../redux/actions/popup/popup';
import * as CareUtils from '../care/common/careUtils'
import moment from 'moment';

const CareHistory = () => {

    const getParams = useParams();
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    
    const [scrollFlag, setScrollFlag] = useState(false); //## 스크롤 시 scroll 클래스 동적 추가
    const [careTypeTap, setCareTypeTap] = useState("all") // ## 전체: "", 시간제:time, 기간제:day
    const [careHistory, setCareHistory] = useState(getParams.tab || "process") 
    const [careList, setCareList] = useState<any[]>([]);
    

    //##################################################################################################################
    //##
    //## >> Override
    //##
    //##################################################################################################################

    useEffect(()=> {
        const params = {
            status : getParams.tab || "process" ,
            job_type : getParams.type
        };
        //최초 간병 리스트 불러오기
        careListApi(params)

    },[getParams.tab,getParams.type])


    /**
     * 스크롤 이동시 동적 클래스네임 부여
     * -----------------------------------------------------------------------------------------------------------------
     */
    const throttledScroll = useMemo(
        () =>
            throttle(() => {
                window.scrollY > 50 ? setScrollFlag(true) : setScrollFlag(false)
            }, 150),
        [window.scrollY]
    )


    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => {
            window.removeEventListener('scroll', throttledScroll);
        }
    }, [throttledScroll])


    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################


    /**
     * 전체/ 시간제/ 기간제 보기 탭
     * -----------------------------------------------------------------------------------------------------------------
     */
    const changeCareTypeTab = (type:any) => {
        setCareTypeTap(type);
        // navigate("/care/job/list/" + getParams.tab + '/' + type)
        navigate("/job/list/" + careHistory + '/' + type)
    }


    /**
     *  진행 내역/ 완료 내역 이동 탭
     * -----------------------------------------------------------------------------------------------------------------
     */
    const changeTab = (type:any) => {
        if(getParams.tab === type){
            return
        }else{
            setCareHistory(type)
            // navigate("/care/job/list/" + type)
            navigate("/job/list/" + type)
        }
    }


    const jobSelectAction = (e: any, type: string, job: any) => {
        e.stopPropagation();

        if (type === "view") { //### 공고 보기
            navigate(`/care/detail/view/${job.job_type}/${job.request_type}/${job.ptr_patients_id || 0}/${job.id}?tab=0`)
        }
    }


    //##################################################################################################################
    //##
    //## >> Method : rendering
    //##
    //##################################################################################################################


    const renderCareList = useMemo(() => {
        let html:any[] = [];
            careList.forEach((item:any, idx:any) => {
                html.push(
                    <li key={idx} 
                        onClick={(e)=> 
                            {
                                jobSelectAction(e, 'view', item)
                            }
                            // navigate(`/care/detail/view/${item.job_type}/${item.request_type}/${item.ptr_patients_id || 0}/${item.id}?tab=0`)
                        }
                    >
                        {   
                            <img src={`/images/timeCare${careTypeTap === "all" || careTypeTap === "day" ? "UpLabel" : "DownLabel"}.svg`}  alt=".." aria-hidden onError={Utils.imgSrcError} className="timeCareLabel" />
                        }
                        <div className="Job__list--label">
                            {/* <!-- BU : 파란색 GY 회색 GN 초록색 RD 빨간색 BU 파란색 --> */}
                            <span className={"label " + (CareUtils.jobStatusColor(item))}>{item.status_str}</span>
                            {
                                item.relay_ptr_job_id &&
                                <span className="label extension">
                                    <img src="../images/icon_exten.svg" alt="" />연장신청
                                </span>
                            }

                            {
                                item.status_str !== "간병 대기" && item.status_str !== "취소요청완료" &&
                                <span className={`label ${item.applicant.length > 0 ? "GN" : "GY"}`}>
                                    지원한 케어메이트 : {item.applicant.length} 명
                                </span>
                            }


                        </div>
                        <div className={"Job__list--tit " + (item.request_type)}>
                            <h3>{item.info}{item.info_detail}</h3>
                        </div>
                        <dl className="Job__list--info">
                            <div>
                                <dt>위치</dt>
                                <dd>{item.address}</dd>
                            </div>
                            <div>
                                <dt>환자 성별</dt>
                                <dd>{item.patient_gender === 1 ? "남성" : "여성"}</dd>
                            </div>
                            <div>
                                <dt>담당 케어메이트</dt>
                                <dd>{Utils.isEmpty(item.cgs_user) ? "미정" : Utils.isEmpty(item.cgs_user.nickname) ? item.cgs_user.name : item.cgs_user.nickname}</dd>
                            </div>
                            <div>
                                <dt>간병 시작일</dt>
                                <dd>{moment(item.job_start_date).format("MM월 DD일 HH시") }</dd>
                            </div>
                        </dl>
                    </li>
                )
            })
        return html;
    },[careList])

    //##################################################################################################################
    //##
    //## >> Method : Popup
    //##
    //##################################################################################################################

    const popupAction = () => {
        hidePopup();
    }


    //##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################

    /**
     * 공고 등록 API
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param data : Object Data
     */

    const careListApi = (params: any) => {
        Api.jobList(params).then((response:any) => {
            if(response.status === 200 && response.data.code === 200) {
                let data = response.data;
                setCareList(data.data)
            }else{
                dispatch(showPopup({element:Popup,action:popupAction,content: response.data.message}))
            }
        }).catch(err => {
            console.log(err)
            dispatch(showPopup({element:Popup,action:popupAction}))
        })
    }

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################


    return (
        <>
            <Header
                historyBack={true}
                title='간병 내역'
            />
            <main>
                <div className="basicTopBottom">
                    <ul role="tablist" className="headerTab">
                        <li 
                            role="tab" 
                            className={getParams.tab === "process"  ? "active" : ""}
                            onClick={() => 
                                changeTab("process")
                            }
                        >진행 내역</li>
                        <li 
                            role="tab" 
                            className={getParams.tab === "complete"  ? "active" : ""}
                            onClick={()=>
                                changeTab("complete")
                            }
                        >완료 내역</li>
                    </ul>
                    {/* <!-- scroll시에 slideFilter에 scroll 추가 --> */}
                    <article className={`slideFilter + ${scrollFlag && " scroll"} `}>
                        <h2 className="a11y-hidden">맞춤 간병 탭 선택하기</h2>
                        <div className="slideFilter__tab">
                            {/* <!--
                            input에 checked 됐을 때 label에 active
                            --> */}
                            <input
                                type="radio"
                                className="slideFilter__tab--option"
                                id="firstToggle"
                                name="careTimeOption"
                                checked={careTypeTap === "all"}
                                onChange={() =>{
                                    changeCareTypeTab("all")
                                    }
                                }
                            />
                            <input
                                type="radio"
                                className="slideFilter__tab--option"
                                id="secondToggle"
                                name="careTimeOption"
                                checked={careTypeTap === "time"}
                                onChange={() =>
                                    changeCareTypeTab("time")
                                }
                            />
                            <input
                                type="radio"
                                className="slideFilter__tab--option"
                                id="thirdToggle"
                                name="careTimeOption"
                                checked={careTypeTap === "day"}
                                onChange={() =>
                                    changeCareTypeTab("day")
                                }
                            />
                            <label htmlFor="firstToggle" className={careTypeTap === "all" ? "active" : ""}>전체</label>
                            <label htmlFor="secondToggle" className={careTypeTap === "time" ? "active" : ""}>시간제</label>
                            <label htmlFor="thirdToggle" className={careTypeTap === "day" ? "active" : ""}>기간제</label>
                            <div className="slideFilter__tab--slider"></div>
                        </div>
                    </article>

                    <section role="tabpanel" className="navHavebgGrayList pt114">
                        <h2 className="a11y-hidden">간병 내역 진행 내역 목록</h2>
                        {
                            careList.length < 0 ?
                                <div className="contentNone">
                                    <img src="/images/noneCareList.svg" alt="간병 내역이 없음" />
                                    <p>지원한 케어메이트가 없습니다.</p>
                                </div>
                                :
                                <ul className="Job__list">
                                  {renderCareList}
                                </ul>
                        }
                    </section>
                </div>
            </main>
        </>
    )
}

export default CareHistory;