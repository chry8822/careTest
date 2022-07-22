import React from 'react';
import Header from '../common/header';

const FindMate = () => {
    return (
        <>
            <Header
                title='간병 정보'
            />
            <main>
                <div className="subWrap">
                    <div className="subWrap__flex">
                        <section className="breakLine scroll">
                            <h2 className="a11y-hidden">커뮤니티 리스트 탭</h2>
                            <ul role="tablist" className="scrollTab__menu">
                                <li role="tab"><button>전체</button></li>
                                <li role="tab" className="active"><button>간병 준수사항</button></li>
                                <li role="tab"><button>케어메이트의 역할</button></li>
                                <li role="tab"><button>간병 준비물</button></li>
                            </ul>
                        </section>
                        <section className="slideFilter community">
                            <div className="slideFilter__tab">
                                {/* <!--
                                input에 checked 됐을 때 label에 active
                                  -->    */}
                                 <input
                                    type="radio"
                                    className="slideFilter__tab--option"
                                    id="firstToggle"
                                    name="careTimeOption"
                                    checked
                                />
                                <input
                                    type="radio"
                                    className="slideFilter__tab--option"
                                    id="secondToggle"
                                    name="careTimeOption"
                                />
                                <label htmlFor="firstToggle" className="active">목록형</label>
                                <label htmlFor="secondToggle">앨범형</label>
                                <div className="slideFilter__tab--slider"></div>
                            </div>
                        </section>
                        <section className="communityDetail" role="tabpanel">
                            <h3 className="a11y-hidden">커뮤니티 리스트 목록</h3>
                            <div className="contentNone">
                                <img src="../images/noneComu.svg" alt="등록된 게시글 없음" />
                                <p>등록된 게시물이 없습니다.</p>
                            </div>
                            <ul className="community__list typeList">
                                <li className="comuLoading">
                                    <a href="#" className="community__list--link">
                                        <div>
                                            <figure
                                                style={{backgroundImage: "url(/images/img_comuDetaList01.png)"}}
                                            ></figure>
                                            <span className="postLabel"><span>포스팅</span></span>
                                        </div>
                                        <div>
                                            <time className="txtStyle05-C555">2022-03-05</time>
                                            <h4 className="">케어메이트 구하기 전에 이거 꼭 확인하세요!</h4>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="community__list--link">
                                        <div>
                                            <figure
                                                style={{backgroundImage: "url(/images/img_comuDetaList01.png)"}}
                                            ></figure>
                                            <span className="videoLabel"><span>영상</span></span>
                                        </div>
                                        <div>
                                            <time className="txtStyle05-C555">2022-03-05</time>
                                            <h4 className="">
                                                케어메이트 구하기 전에 이거 꼭 확인하세요!케어메이트 구하기 전에 이거 꼭
                                                확인하세요!케어메이트 구하기 전에 이거 꼭 확인하세요!케어메이트 구하기 전에
                                                이거 꼭 확인하세요!케어메이트 구하기 전에 이거 꼭 확인하세요!
                                            </h4>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="community__list--link">
                                        <div>
                                            <figure
                                                style={{backgroundImage: "url(/images/img_comuDetaList01.png)"}}
                                            ></figure>
                                            <span className="postLabel"><span>포스팅</span></span>
                                        </div>
                                        <div>
                                            <time className="txtStyle05-C555">2022-03-05</time>
                                            <h4 className="">케어메이트 구하기 전에 이거 꼭 확인하세요!</h4>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="community__list--link">
                                        <div>
                                            <figure
                                                style={{backgroundImage: "url(/images/img_comuDetaList01.png)"}}
                                            ></figure>
                                            <span className="videoLabel"><span>영상</span></span>
                                        </div>
                                        <div>
                                            <time className="txtStyle05-C555">2022-03-05</time>
                                            <h4 className="">케어메이트 구하기 전에 이거 꼭 확인하세요!</h4>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="community__list--link">
                                        <div>
                                            <figure
                                                style={{backgroundImage: "url(/images/img_comuDetaList01.png)"}}
                                            ></figure>
                                            <span className="videoLabel"><span>영상</span></span>
                                        </div>
                                        <div>
                                            <time className="txtStyle05-C555">2022-03-05</time>
                                            <h4 className="">케어메이트 구하기 전에 이거 꼭 확인하세요!</h4>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="community__list--link">
                                        <div>
                                            <figure
                                                style={{backgroundImage: "url(/images/img_comuDetaList01.png)"}}
                                            ></figure>
                                            <span className="postLabel"><span>포스팅</span></span>
                                        </div>
                                        <div>
                                            <time className="txtStyle05-C555">2022-03-05</time>
                                            <h4 className="">케어메이트 구하기 전에 이거 꼭 확인하세요!</h4>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            {/* <!--탭이 아래로 스크롤 했을 때 회색 아래 부분이 됐을 경우 active 추가 --> */}
                            <button type="button" className="community__topScroll active">맨위로</button>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}

export default FindMate;