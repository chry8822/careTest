import React from 'react'
import Header from '../common/header';

const CommunityList = () => {
    return (
        <>
            <Header
                title='커뮤니티'
            />
            <main>
                <div className="basicTopBottom commonWrap">
                    <section className="community__link">
                        <article className="community__link--tit">
                            <h2 className="txtStyle05-Cbrown">원하는 내용을 눌러보세요!</h2>
                        </article>
                        <ul className="community__menu">
                            <li className="community__menu--yellow">
                                <a href=""
                                    onClick={()=> {
                                        
                                    }}
                                >
                                    <h3 className="txtStyle02">간병인 찾기</h3>
                                    <p className="txtStyle05-C555">
                                        간병인 찾을 때 유용한 정보를 <br />
                                        알려드립니다!
                                    </p>
                                </a>
                            </li>
                            <li className="community__menu--lightPurple">
                                <a href="">
                                    <h3 className="txtStyle02">간병백과</h3>
                                </a>
                            </li>
                            <li className="community__menu--green">
                                <a href="">
                                    <h3 className="txtStyle02">건강 정보</h3>
                                </a>
                            </li>
                            <li className="community__menu--red">
                                <a href="">
                                    <h3 className="txtStyle02">
                                        간병사고<br />
                                        X파일
                                    </h3>
                                </a>
                            </li>
                            <li className="community__menu--blue">
                                <a href="">
                                    <h3 className="txtStyle02">
                                        간병동향<br />
                                        리포트
                                    </h3>
                                </a>
                            </li>
                            <li className="community__menu--lightYellow">
                                <a href="">
                                    <h3 className="txtStyle02">
                                        케어네이션<br />
                                        뉴스
                                    </h3>
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </main>
        </>
    )
}

export default CommunityList;