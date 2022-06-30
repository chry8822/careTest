import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hidePopup } from '../../redux/actions/popup/popup';
import MainNavigator from './navigator/navigator'
import Header from '../common/header';


const Main = () => {
console.log("12")
    const dispatch = useDispatch();

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
                        <article className="mainInsur">
                            <p className="txtStyle05-C333">국내 최초 보험 가입 자동화</p>
                            <h2 className="txtStyle01">
                            삼성화재<br />
                            간병인배상책임보험 출시
                            </h2>
                            <img src="../images/mainInsurLogo.svg" alt="케어네이션 x 삼성화재" />
                        </article>
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
                        <article className="careMateBan"></article>
                        <div className="mainBanSlick__page"><span>1 </span> / 3</div>
                    </div>

                    <article className="mainBgGray">
                            {/* <!-- <div className="commonWrap02">
                                <div className="penaltyInfo">
                                <h2 className="txtStyle02">서비스 이용제한 안내</h2>
                                <p className="txtStyle04">
                                    이용약관에 의거하여 아래의 기간동안 <strong>공고등록이 불가</strong>합니다.
                                </p>
                                <p className="txtStyle05-C555">
                                    서비스 이용제한 기간동안 '탈퇴 후 재가입'을 하시는 경우, 추가적인 제재가
                                    가해집니다.
                                </p>
                                <dl className="penaltyInfo__detail">
                                    <div>
                                    <dt>제한 내용</dt>
                                    <dd>공고등록 금지</dd>
                                    </div>
                                    <div>
                                    <dt>제한 사유</dt>
                                    <dd>반복적인 당일 간병 취소</dd>
                                    </div>
                                    <div>
                                    <dt>제한 기간</dt>
                                    <dd>YY.MM.DD hh:mm ~ YY.MM.DD hh:mm</dd>
                                    </div>
                                </dl>
                                <p className="txtStyle05-C555">
                                    또한, 반복적인 위반행위적발 또는 회사의 판단에 따라 '회원자격상실' 제재가 가해질
                                    수 있으며, 회원 자격 상실된 회원은 재가입 및 서비스 이용이 불가합니다. 자세한
                                    사항은 이용약관을 확인해주세요.
                                </p>
                                <p className="txtStyle05-C555">
                                    서비스 제한과 관련 문의가 있으시면 고객센터로 문의해주세요.
                                </p>
                                <a href="">이용약관 보기</a>
                                </div>
                            </div> --> */}
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
                                </ul>
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
                                        <dd className="txtStyle03-Bold">000,000명</dd>
                                    </dl>
                                    <div className="mainChart">
                                        <div className="mainChart__pie">
                                        {/* 차트 넣는 자리 */}
                                        <canvas></canvas>
                                        </div>
                                        <div className="mainChart__legend">
                                        <dl>
                                            <div>
                                                <dt>내국인</dt>
                                                <dd>80.1</dd>
                                            </div>
                                            <div>
                                                <dt>외국인</dt>
                                                <dd>20.2</dd>
                                            </div>
                                        </dl>
                                        </div>
                                        <div className="mainChart__line">
                                            <div className="mainChart__line--chart">
                                                <div style={{width: "41%"}}></div>
                                            </div>
                                            <div className="mainChart__line--detail">
                                                <p>여성 : <span>41.2</span></p>
                                                <p>남성 : <span>59.1</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="txtStyle06-C777">* 인증 케어메이트 기준</p>
                                </article>
                                <dl className="mainItemWrap__history--list">
                                    <div>
                                        <dt>18,265</dt>
                                        <dd>누적 이용 건수</dd>
                                    </div>
                                    <div>
                                        <dt><span>19</span><span>000</span></dt>
                                        <dd>누적 간병시간</dd>
                                    </div>
                                </dl>
                                <div className="mainItemWrap__history--acc">
                                    <h3 className="txtStyle04-C333Wnoml">누적 승인 금액</h3>
                                    <p className="txtStyle03-Bold">5,104,291,700</p>
                                </div>
                            </div>
                        </article>
                        <article className="mainRev breakLine">
                            <div className="mainRev__Tit">
                                <h2 className="txtStyle02">보호자님이 남긴 후기</h2>
                                <a href="">전체보기</a>
                            </div>
                            <div className="mainRev__link">
                                <a href="">
                                    <div className="mainRev__link--tit">
                                        <h3 className="txtStyle05-Wbold">
                                        홍*동 <span className="txtStyle06-C777W500">보호자</span>
                                        </h3>
                                        <time className="txtStyle06-C777">1분전</time>
                                    </div>
                                    <figure className="ratingGroup">
                                        <img src="../images/reviewStar03.svg" alt="종합평점" />
                                        <figcaption className="txtStyle05">4.2</figcaption>
                                    </figure>
                                    <div className="mainRev__link--txt">
                                        <span className="txtStyle06-C333">김*자 케어메이트에게</span>
                                        <p className="txtStyle04-C333">엄마가 너무 마음 편해 하셨어요.</p>
                                    </div>
                                </a>
                                <a href="">
                                    <div className="mainRev__link--tit">
                                        <h3 className="txtStyle05-Wbold">
                                        홍*동 <span className="txtStyle06-C777W500">보호자</span>
                                        </h3>
                                        <time className="txtStyle06-C777">1분전</time>
                                    </div>
                                    <figure className="ratingGroup">
                                        <img src="../images/reviewStar03.svg" alt="종합평점" />
                                        <figcaption className="txtStyle05">4.2</figcaption>
                                    </figure>
                                    <div className="mainRev__link--txt">
                                        <span className="txtStyle06-C333">김*자 케어메이트에게</span>
                                        <p className="txtStyle04-C333">.</p>
                                    </div>
                                </a>
                                <a href="">
                                    <div className="mainRev__link--tit">
                                        <h3 className="txtStyle05-Wbold">
                                        홍*동 <span className="txtStyle06-C777W500">보호자</span>
                                        </h3>
                                        <time className="txtStyle06-C777">1분전</time>
                                    </div>
                                    <figure className="ratingGroup">
                                        <img src="../images/reviewStar03.svg" alt="종합평점" />
                                        <figcaption className="txtStyle05">4.2</figcaption>
                                    </figure>
                                    <div className="mainRev__link--txt">
                                        <span className="txtStyle06-C333">김*자 케어메이트에게</span>
                                        <p className="txtStyle04-C333">
                                        엄마가 너무 마음 편해 하셨어요. 감사 다 다음에도 이용할게요. 엄마가 너무 마음
                                        편해 하셨어요. 감사 다 다음에도 이용할게요. 엄마가
                                        </p>
                                    </div>
                                </a>
                                <a href="">
                                    <div className="mainRev__link--tit">
                                        <h3 className="txtStyle05-Wbold">
                                        홍*동 <span className="txtStyle06-C777W500">보호자</span>
                                        </h3>
                                        <time className="txtStyle06-C777">1분전</time>
                                    </div>
                                    <figure className="ratingGroup">
                                        <img src="../images/reviewStar03.svg" alt="종합평점" />
                                        <figcaption className="txtStyle05">4.2</figcaption>
                                    </figure>
                                    <div className="mainRev__link--txt">
                                        <span className="txtStyle06-C333">김*자 케어메이트에게</span>
                                        <p className="txtStyle04-C333">좋아요</p>
                                    </div>
                                </a>
                                <a href="">
                                    <div className="mainRev__link--tit">
                                        <h3 className="txtStyle05-Wbold">
                                        홍*동 <span className="txtStyle06-C777W500">보호자</span>
                                        </h3>
                                        <time className="txtStyle06-C777">1분전</time>
                                    </div>
                                    <figure className="ratingGroup">
                                        <img src="../images/reviewStar03.svg" alt="종합평점" />
                                        <figcaption className="txtStyle05">4.2</figcaption>
                                    </figure>
                                    <div className="mainRev__link--txt">
                                        <span className="txtStyle06-C333">김*자 케어메이트에게</span>
                                        <p className="txtStyle04-C333">별로</p>
                                    </div>
                                </a>
                            </div>
                        </article>
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
                        <article>
                            <div className="mainItemWrap__tit">
                                <h2 className="txtStyle02">케어네이션 간병정보</h2>
                            </div>
                            <div className="mainItemWrap__info">
                                <div className="mainItemWrap__info--item">
                                    <a href="" className="pink">
                                        <h3 className="txtStyle02">
                                        케어메이트와 따로<br />
                                        직거래하면 안되나요?
                                        </h3>
                                        <p className="txtStyle05-C555">정답 확인해보세요!</p>
                                    </a>
                                </div>
                                <div className="mainItemWrap__info--item">
                                    <a href="" className="purple">
                                        <h3 className="txtStyle02">
                                        간병인 구하기 전 <br />
                                        필수로 확인해야할 이것은?
                                        </h3>
                                        <p className="txtStyle05-C555">보호자 아보카도님의 사연 보기</p>
                                    </a>
                                </div>
                                <div className="todayEnt">
                                    <a href="">
                                        <p className="txtStyle04-W500">환자와 간병인의 이야기</p>
                                        <h3 className="txtStyle02">케어네이툰</h3>
                                        <span className="txtStyle05-C555W500">보러가기</span>
                                    </a>
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
        {/* <!-- // 본문 끝 --> */}

        {/* <!-- 푸터 --> */}
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