import Item from 'antd/lib/list/Item';
import React, { useState, useMemo } from 'react'
import * as Utils from '../../constants/utils'
import AmountGraphChart from '../common/amountGraphChart'
import moment from 'moment';
import * as CareUtils from "../care/common/careUtils"

interface ApplicantDetailProps {
    detailData: any;
    jobStatus: any;
}

const ApplicantDetail = ({ detailData, jobStatus }: ApplicantDetailProps) => {

    const { status, users, graphData, payment, } = jobStatus;
    const { jobType, startDate, startTime, endDate, endTime } = detailData
    const [ noticeFlag, setNoticeFlag ] = useState<any>({
        paymentNotice: false,
        cancelNotice: false
    })

    console.log(!noticeFlag.paymentNotice)

    const renderApplicantGraph = () => {
        const usersArr: number[] = graphData.user.graph;
        const maxPercent = Math.max(...usersArr);

        return (
            usersArr.map((item: any, idx: any) => {
                return (
                    <div style={{ height: `${maxPercent === 0 ? 0 : item / maxPercent * 100}%` }} key={idx} className={item === maxPercent ? "max" : "zero"}>
                        <img src={`/images/barTooltip${item === 0 ? "01" : item === maxPercent ? "02" : "01"}.svg`} alt="tooltip" />
                        <span>{item}명</span>
                    </div>
                )
            })
        )
    }

    const renderApplicanMate = useMemo(() => {
        return (
            users.map((item: any, idx: any) => {
                let awardTitle: string = Utils.isEmpty(jobStatus.payment) ? CareUtils.awardsPersonCheck(item.info.id) : CareUtils.awardsPersonCheck(jobStatus.payment.cgs_user.id);
                let hourlyWage: number = Math.floor(item.user.amount_day / 24);

                return (
                    <>
                        <li className={Utils.isEmpty(payment) ? "mt40" : ""}>
                            <div className="Job__list--name">
                                <div>
                                    <div className="nameTit">
                                        <h3 className="txtStyle03">{item.user.name}
                                            {
                                                Utils.isEmpty(awardTitle) ?
                                                    <span>프리랜서</span>
                                                    :
                                                    <img src="/images/ic_busyOneself.svg" />
                                            }
                                        </h3>
                                    </div>
                                    <p className="txtStyle02">
                                        <span>{jobType === "day" ? "일급" : "시급"}</span>
                                        <strong>{jobType === "day" ? Utils.numberWithCommas(item.user.amount_day) : Utils.numberWithCommas(item.user.amount_time)}원</strong>
                                    </p>
                                    <p className="txtStyle05-C333">시간 당<strong>약 {Utils.numberWithCommas(hourlyWage)}원</strong>입니다.</p>
                                </div>
                                <figure
                                    className="basicChr"
                                    style={{ backgroundImage: `url(/images/${item.user.character}.svg)` }}
                                >
                                    <figcaption className="a11y-hidden">케어메이트가 선택한 이미지</figcaption>
                                </figure>
                            </div>
                            <dl className="Job__list--reputation">
                                <div>
                                    <dt>나이</dt>
                                    <dd><img src="/images/age.svg" alt="" />
                                        {item.user.age}세
                                    </dd>
                                </div>
                                <div>
                                    <dt>성별</dt>
                                    <dd><img src={`/images/icon_${item.user.gender === "1" ? "man" : "woman"}.svg`} alt="" />
                                        {item.user.gender === "1" ? "남자" : "여자"}
                                    </dd>
                                </div>
                                <div>
                                    <dt>국적</dt>
                                    <dd><img src={`/images/nationality${item.user.is_foreigner === 0 ? "02" : "01"}.svg`} alt="" />
                                        {item.user.is_foreigner === 0 ? "내국인" : "외국인"}
                                    </dd>
                                </div>
                            </dl>
                            <div className="Job__list--trade">
                                <dl>
                                    <div className={`careComple ${item.job_count.complete <= 0 ? "disabled" : ""}`}>
                                        <dt>간병 완료</dt>
                                        <dd>{item.job_count.complete}건</dd>
                                    </div>
                                    <div className={`certifi ${item.profile.license_check <= 0 ? "disabled" : ""}`}>
                                        <dt>자격증</dt>
                                        <dd>{item.profile.license_check}개</dd>
                                    </div>
                                    <div className={`totalCare ${item.job_count.work_cnt <= 0 ? "disabled" : ""}`}>
                                        <dt>총 간병기간</dt>
                                        <dd>{CareUtils.workDayHour(item.job_count.work_cnt)}시간</dd>
                                    </div>
                                    <div className={`vaccine ${Utils.isEmpty(item.user.covid19_vaccine_info) ? "disabled" : ""}`}>
                                        <dt>백신 접종</dt>
                                        <dd>{CareUtils.vaccinatonCheck(JSON.parse(item.user.covid19_vaccine_info))}</dd>
                                    </div>
                                </dl>
                            </div>
                        </li>
                    </>
                )
            })

        )

    }, [users])

    // const renderPayer = useMemo(()=>{
    //     let html:any[] = []
    //         payment.users.forEach((item:any, idx:any) => {
    //             html.push (
    //                 <li className="careWrap__box--payer">
    //                     <div>
    //                         <h4 className="txtStyle04-C333W500">{item.name}</h4>
    //                         <p className="txtStyle05-C555">결제 금액 : <span>{Utils.numberWithCommas(item.total)}</span>원</p>
    //                     </div>
    //                     <button type="button" className={payment.paymentStatus === "stay" ? "payComplete" : "payRequest" }>결제 완료</button>
    //                 </li>
    //             )
    //         })
    //     return html
    // },[payment])

    // console.log(payment.users)

    const addHyphen = (num: any) => {
        return num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3")
    }

    return (
        <>
            {
                graphData ?
                <>
                    {
                        status <= 2 && Utils.isEmpty(payment) ?
                            <section role="tabpanel" className="supportCare">
                                {
                                    users.length !== 0 &&
                                    <>
                                        <article className="supportCare__chart">
                                            <div className="supportCare__chart--tit">
                                                <h2 className="txtStyle03">지원 케어메이트 현황</h2>
                                            </div>
                                            <div className="supportCare__chart--con">
                                                <span>기준 : 금액별</span>
                                                <div className="areaChart">
                                                    
                                                    <AmountGraphChart
                                                        graph={graphData.graph}
                                                    />
                                                </div>
        
                                                <div className="vertiChart">
                                                    <div className="vertiChart__basic">
                                                        {renderApplicantGraph()}
                                                    </div>
                                                    <div className="rangeAxis">
                                                        <p>
                                                            <span
                                                            >{Utils.numberWithCommas(graphData.break_point.min)}원 <br />
                                                                이하</span
                                                            >
                                                            <span
                                                            >{Utils.numberWithCommas(graphData.break_point.max)}원 <br />
                                                                이상</span
                                                            >
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="supportCare__chart--price">
                                                <h3 className="txtStyle04">지원 금액</h3>
                                                <p>최저<strong>{Utils.numberWithCommas(graphData.user.min)}원</strong>
                                                    <span>~</span>
                                                    최고<strong>{Utils.numberWithCommas(graphData.user.max)}원</strong></p>
                                            </div>
                                        </article>
                                    </>
                                }
                                <article className="supportCare__list mt40">
                                    {
                                        users.length !== 0 &&
                                        <>
                                            <h2 className="txtStyle03">지원 케어메이트 프로필</h2>
                                            <ul className="Job__list ">
                                                {renderApplicanMate}
                                            </ul>
                                        </>
                                    }
                                </article>
                            </section>
                            :
                            <section role="tabpanel">
                                <h2 className="a11y-hidden">지원한 케어메이트 프로필 보기</h2>
                                <ul className="Job__list breakLine bgGray">
                                    {renderApplicanMate}
                                </ul>
                                <article className="breakLine">
                                    <div className="careWrap">
                                        <h3 className="txtStyle03"><mark>간병인배상책임보험 증서</mark></h3>
                                        <p className="txtStyle05-C555 pb20">
                                            전문직업배상책임보험 가입증서 간병인업무(개인간병)
                                        </p>
                                        <div className="Job__list--detailBtn without">
                                            <button type="button" className="arrowBtn">간병인배상책임보험 증서 보기</button>
                                        </div>
                                    </div>
                                </article>
                                <article className="breakLine">
                                    <article className="careWrap">
                                        <h3 className="txtStyle03"><mark>결제 정보</mark><span>(수수료 6% 포함)</span></h3>
        
                                        {/* <!-- 기간제 간병 --> */}
                                        {
                                            jobType === "day" ?
                                                <div className="pay__box">
                                                    <dl className="Job__list--info">
                                                        <div>
                                                            <dt>시작일</dt>
                                                            <dd>{moment(payment.info.job_start_date).format("YYYY-MM-DD HH:mm")}</dd>
                                                        </div>
                                                        <div>
                                                            <dt>종료일</dt>
                                                            <dd>{moment(payment.info.job_end_date).format("YYYY-MM-DD HH:mm")}</dd>
                                                        </div>
                                                        {/* <div>
                                                        <dt>간병비</dt>
                                                        <dd>000,000,000원</dd>
                                                    </div>
                                                    <div>
                                                        <dt>유급 휴가비</dt>
                                                        <dd>000,000,000원</dd>
                                                    </div> */}
                                                        <div className="total">
                                                            <dt>총 결제 금액</dt>
                                                            <dd>{Utils.numberWithCommas(payment.info.total)} 원</dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                                :
                                                <div className="pay__box mt20">
                                                    <h4 className="a11y-hidden">시간제 간병 총 금액</h4>
                                                    <dl className="Job__list--info partTime">
                                                        <div>
                                                            <dt>해당 간병은 선택한 일에</dt>
                                                            <dd><strong>01</strong>시 부터 <strong>01</strong>시까지 진행됩니다.</dd>
                                                        </div>
                                                        <div className="total">
                                                            <dt>총 결제 금액</dt>
                                                            <dd>{Utils.numberWithCommas(payment.info.total)} 원</dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                        }
        
        
        
                                    </article>
                                </article>
                                <article>
                                    <div className="careWrap">
                                        <h3 className="txtStyle03"><mark>결제자 정보</mark></h3>
                                        <ul className="careWrap__box">
                                            <li className="careWrap__box--payer">
                                                <div>
                                                    <h4 className="txtStyle04-C333W500">{payment.users[0].name}{`(${addHyphen(payment.users[0].phone)})`}</h4>
                                                    <p className="txtStyle05-C555">결제 금액 : <span>{Utils.numberWithCommas(payment.users[0].total)}</span>원</p>
                                                </div>
                                                <button type="button" className="payComplete">결제 완료</button>
                                            </li>
                                            {/* <!--
                                                결제 완료 시 : payComplete
                                                결제 재요청 시 : payRequest
                                                --> */}
                                            {/* {renderPayer} */}
                                        </ul>
                                    </div>
                                </article>
                            </section>
        
                    }
                </>
                :
                   <section role="tabpanel">
                        <h2 className="a11y-hidden">지원한 케어메이트 프로필 보기</h2>
                        <ul className="Job__list bgGray">
                            {renderApplicanMate}
                        </ul>
                   </section>
            }
            {
                users.length <= 0 &&
                <div className="supportCare__none case">
                    <h2 className="txtStyle03">
                        보호자님의 공고가<br />
                        케어메이트님들에게 전달되었습니다.
                    </h2>
                    <p className="txtStyle04-C333Wnoml">케어메이트가 지원할 때까지 대기해주세요.</p>
                </div>
            }
            {
                payment && graphData &&
                <div className="noticeInfo pb100">
                    <article className="noticeInfo__aco">
                        {/* <!--
                        버튼 오픈 시에는 mustRed on 추가 & mustRed__detail none 삭제
                        버튼 닫을 시에는 mustRed on 삭제 & mustRed__detail none 추가 
                --> */}
                        <div className={`mustRed${noticeFlag.paymentNotice ? " on": ""}`}>
                            <button 
                                id="paymentTit" 
                                className="mustRed__tit" 
                                aria-controls="paymentCon"
                                onClick={() => 
                                    {
                                        setNoticeFlag({...noticeFlag, paymentNotice: !noticeFlag.paymentNotice})
                                    }
                                }    
                            >
                                <span>필독</span>결제 시 꼭 읽어주세요!
                            </button>
                        </div>
                        <div
                            id="paymentCon"
                            role="region"
                            aria-labelledby="paymentTit"
                            className={`mustRed__detail${noticeFlag.paymentNotice ? "": " none"}`}
                        >
                            <p>이미 제공된 간병서비스에 대한 환불은 불가능합니다.</p>
                            <p>
                                결제하신 간병비 정산은 24시간 단위로 하여 정산하는 방식을 취하며, 공고에 등록된
                                간병시작시간을 기준으로 만 24시간 마다 정산이 이루어 집니다.
                            </p>
                            <p>간병중단을 원하시는 경우, 아래의 절차에 따라 진행해주세요.</p>
                            <ol>
                                <li>어플리케이션 간병내역 누르기</li>
                                <li>진행내역 누르기</li>
                                <li>간병 취소 버튼을 누르기</li>
                            </ol>
                            <i
                            >간병 취소 버튼을 누르지 않는 경우 계속해서 간병비가 발생되며 이 금액은 보호자에게
                                환불되지 않습니다.</i
                            >
                            <p>
                                케어메이트가 제안한 일 간병비에는 케어메이트의 식대가 포함되어 있습니다. 매칭
                                이후, 케어메이트은 보호자에게 추가 식대를 요구 할 수 없습니다.
                            </p>
                            <p>
                                유급휴가는 당사자인 케어메이트와 보호자 간에 별도로 합의하여 직접 지급하실 수
                                있습니다. (당사는 유급휴가 혹은 유급휴일과 관련된 건에 대하여 관여하지 않습니다.)
                            </p>
                            <p>
                                간병 시작 24시간 이내 혹은 간병 당일에 보호자의 귀책사유 (단순변심 포함)로 인하여
                                간병이 취소된 경우, 케어메이트의 간병 업무가 시작되지 않았다면 간병비는 발생하지
                                않으나 교통비 혹은 위약금이 보호자에게 청구됩니다. 해당 금액은 보호자에게 반환될
                                환불 예정금액에서 공제됩니다.
                            </p>
                            <p>할부결제에 따른 할부수수료율은 카드사에 따라 다를 수 있습니다.</p>
                            <p>결제 금액에는 결제 수수료 6%가 포함됩니다.</p>
                            <p>
                                간병비는 소득공제 대상이 아닙니다. 다만, 신용카드로 “케어네이션”어플리케이션에서
                                간병비를 결제하는 경우 신용카드 사용금액에 대한 공제가 적용될 수 있습니다.
                            </p>
                            <p>
                                회원은 반드시 본인 명의의 결제수단을 사용하여야 하며, 타인의 결제수단을 사용하여
                                회사 또는 결제대행사에 손실이 발생한 경우 모든 책임은 회원에게 귀속합니다
                            </p>
                            <p>자세한 사항은 케어네이션 이용약관을 확인해 주시기 바랍니다.</p>
                        </div>
                    </article>
                    <article className="noticeInfo__aco">
                        {/* <!--
                        버튼 오픈 시에는 mustRed on 추가 & mustRed__detail none 삭제
                        버튼 닫을 시에는 mustRed on 삭제 & mustRed__detail none 추가 
                --> */}
                        <div className={`mustRed${noticeFlag.cancel ? " on": ""}`}>
                            <button 
                                id="careCanTit" 
                                className="mustRed__tit" 
                                aria-controls="careCanCon"
                                onClick={() => 
                                    {
                                        setNoticeFlag({...noticeFlag, cancel: !noticeFlag.cancel})
                                    }
                                }    
                            >
                                <span>필독</span>취소 수수료 및 취소 페널티 안내
                            </button>
                        </div>
                        <div
                            id="careCanCon"
                            role="region"
                            aria-labelledby="careCanTit"
                            className={`mustRed__detail${noticeFlag.cancel ? "": " none"}`}
                            
                        >
                            <p>
                                회사는 보호자 회원과 케어메이트 회원 간의 안정적이고 건전한 전자상거래환경 조성을
                                위하여 아래와 같이 취소 수수료 및 취소 페널티 제도를 운영합니다.
                            </p>
                            <p>
                                ① 매칭된 간병이 시작되기 전, 또는 진행 중인 간병을 보호자 회원의 요청이나 보호자
                                회원이 공고에 기재한 내용 (예시：간병 기간, 환자 상태, 간병 장소 등)이 사실과 다른
                                것으로 밝혀져 해당 간병이 취소되는 경우, 회사는 보호자 회원에게 취소 수수료를
                                부과합니다. 회사는 보호자 회원에게 부과된 취소 수수료 중 일부(PG 수수료, 위약금
                                수수료, 기타 지출 등)를 제외한 나머지 금액을 케어메이트 회원에게 정산하며, 보호자
                                회원에게는 취소 수수료가 차감된 금액으로 환불을 진행합니다. 간병 취소 요청 접수
                                일시가 촉박할수록 취소 수수료가 증액되오니, 간병 일정을 잘 고려하여 진행해 주시기
                                바랍니다.
                            </p>
                            <p>취소 수수료</p>
                            <ol>
                                <li>매칭된 간병을 시작 일시 기준 3일 전에 취소하는 경우:취소 수수료 없음</li>
                                <li>
                                    매칭된 간병을 시작 일시 기준 2일 전에 취소하는 경우 : 취소 수수료 10,000원
                                </li>
                                <li>
                                    매칭된 간병을 시작 일시 기준 1일 전에 취소하는 경우 : 취소 수수료 20,000원
                                </li>
                                <li>매칭된 간병을 시작 일시 기준 당일에 취소하는 경우 : 취소 수수료 30,000원</li>
                            </ol>
                            <p>진행 중인 간병의 간병 취소 요청 접수 일시 기준</p>
                            <ol>
                                <li>케어메이트 회원에게 보장 된 간병 일이 3일 이상인 경우: 취소 수수료 없음</li>
                                <li>
                                    케어메이트 회원에게 보장 된 간병 일이 2일 이상 3일 미만인 경우: 취소 수수료
                                    10,000원
                                </li>
                                <li>
                                    케어메이트 회원에게 보장 된 간병 일이 1일 이상 2일 미만인 경우: 취소 수수료
                                    20,000원
                                </li>
                                <li>
                                    케어메이트 회원에게 보장 된 간병 일이 1일 미만인 경우: 취소 수수료 30,000원
                                </li>
                            </ol>
                            <p>
                                단, 환자의 상태(위독, 사망, 퇴원 등) 또는 불가항력적으로 발생한 사건 및 사고에
                                의해 발생한 취소 요청건에 한해서는 페널티 담당자의 결정으로 취소 수수료가 발생하지
                                않을 수 있습니다.
                            </p>
                            <p>
                                ② 회사는 필요하다고 판단되는 경우, 위에 명시 된 취소 수수료와 함께 보호자 회원의
                                자격을 제한 및 정지시킬 수 있으며, 이로 인해 보호자 및 케어메이트 회원에게 발생한
                                모든 책임과 손해에 대해서 회사는 면책함을 명시합니다.
                            </p>
                        </div>
                    </article>
                    <div className="btnWrap fixed">
                        <button 
                            type="button" 
                            className="btnColor tel"
                        >케어메이트와 통화하기</button>
                    </div>
                </div>
            }
        </>
    )
}

export default ApplicantDetail;