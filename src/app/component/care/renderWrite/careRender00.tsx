import React from 'react';
import Header from '../../common/header';
import { CareType } from '../common/types';

interface CareRender00Props {
    registerData: CareType;
    setData: (data: any) => void;
}

const CareRender00 = ({ registerData, setData }: CareRender00Props) => {

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################
    return (
        <>
            <section className="select">
                <div className="select__list">
                    <div className="select__list--detailTit">
                        <h3 className="txtStyle03">케어메이트의 코로나 19 검사가 필요한가요?</h3>
                    </div>
                    <ul className="radioSelect">
                        <li className="radioSelect__box">
                            <input
                                type="radio"
                                id="list01"
                                name="select"
                                checked={registerData.coronaCheck === 1}
                                onChange={() => setData({ coronaCheck: 1 })}
                            />
                            <label htmlFor="list01">네</label>
                        </li>
                        <li className="radioSelect__box">
                            <input
                                type="radio"
                                id="list02"
                                name="select"
                                checked={registerData.coronaCheck === 2}
                                onChange={() => setData({ coronaCheck: 2 })}
                            />
                            <label htmlFor="list02">아니오</label>
                        </li>
                    </ul>
                    <div className="select__info">
                        <h3 className="a11y-hidden">코로나 검사 안내</h3>
                        <ul className="select__info--detail">
                            {
                                // 간병 장소가 병원 이면 해당 안내 노출
                                registerData.requestType === "hospital" &&
                                <li>
                                    <span>잘 모르겠다면?</span>
                                    <h4 className="txtStyle04-C333W500">
                                        <strong>입원병원의 코로나 19 검사 정책</strong> 확인!
                                    </h4>
                                    <ul>
                                        <li className="dash">케어메이트 검사 의무화 여부</li>
                                        <li className="dash">코로나 19 검사 장소</li>
                                        <li className="dash">검사 비용 결제 방법 등</li>
                                    </ul>
                                </li>
                            }
                            <li>
                                <span>1일 이내에 시작되는 간병이라면?</span>
                                <h4 className="txtStyle04-C333">
                                    코로나 검사 일정의 사유로 <br />
                                    매칭이 어렵거나, 취소될 수 있어요.
                                </h4>
                                <ul>
                                    <li>
                                        적어도 간병 시작 2일 전에 매칭을 완료하시고, 케어메이트와 코로나 검사
                                        일정에 대해서 논의해주세요!
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CareRender00;