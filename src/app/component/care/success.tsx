import React,{ useEffect } from 'react';
import Header from "../common/header"
import { useNavigate } from 'react-router-dom';
import * as Utils from '../../constants/utils'
import * as LocalStorage from '../../constants/localStorage';
import { useDispatch } from 'react-redux';
import { initCare } from '../../redux/actions/care/care';

const CareExtentSuccess = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        Utils.clearHistory();

        Utils.adjustEvent("9zgwjn");
        Utils.analyticsEvent("care_reg_cp");

        const tempLoadWriteData = LocalStorage.getStorage(LocalStorage.LOAD_WRITE_DATA);
        if(tempLoadWriteData && JSON.parse(tempLoadWriteData)) {
            let jobj = JSON.parse(tempLoadWriteData);

            if (jobj.jobType === "day") { //# 기간제
                if (jobj.requestType === "hospital") { //# 병원
                    Utils.adjustEvent("kw7q7i");
                    Utils.analyticsEvent("care_dhos_sc");
                } else { //# 집
                    Utils.adjustEvent("e2h0m0");
                    Utils.analyticsEvent("care_dhom_sc");
                }
            } else { //# 시간제
                if (jobj.requestType === "hospital") { //# 병원
                    Utils.adjustEvent("87pd02");
                    Utils.analyticsEvent("care_thos_sc");
                } else { //# 집
                    Utils.adjustEvent("fblv8q");
                    Utils.analyticsEvent("care_thom_sc");
                }
            }
        }

        LocalStorage.remove(LocalStorage.LOAD_WRITE_DATA);

        dispatch(initCare());

    },[])


    return (
        <>
            <Header
                historyBack={true}
                title="공고 등록"
            />
            <main id="content">
                <div className="subWrap">
                    <div className="subWrap__flex">
                        <section className="noticeRegister">
                            <div className="commonWrap">
                                <h2 className="a11y-hidden">공고 작성 단계</h2>
                                <ul className="noticeRegister__step">
                                    {/* <!-- 해당되는 step에 li에 active 추가되고 해당 스텝이 완료 되면 li에 check로 변경 --> */}
                                    <li className="check">장소 선택</li>
                                    <li className="check">공고 작성</li>
                                    <li className="active">대기</li>
                                </ul>
                            </div>
                        </section>
                    </div>
                    <section className="noticeRegister__finish">
                        <figure></figure>
                        <h3 className="txtStyle04-C333W500">공고 등록이 완료되었습니다.</h3>
                    </section>
                    <div className="noticeInfo">
                        <div className="noticeInfo__Register">
                            <h3 className="a11y-hidden">공고 등록 완료 메뉴얼</h3>
                            <ol className="noticeInfo__Register--step">
                                <li>
                                    <figure>
                                        <img
                                            src="../images/noticeInfoStep01.svg"
                                            alt="케어메이트 지원할 때까지 대기하기"
                                        />
                                    </figure>
                                    <div>
                                        <h4 className="txtStyle06-Cbrown">STEP 1</h4>
                                        <p className="txtStyle05-C333">
                                            보호자님의 공고는 케어메이트에게 노출됩니다. 케어메이트가 지원할 때까지
                                            대기해주세요.
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src="../images/noticeInfoStep02.svg"
                                            alt="케어메이트 정보와 일 간병비 확인하고 선택하기"
                                        />
                                    </figure>
                                    <div>
                                        <h4 className="txtStyle06-Cbrown">STEP 2</h4>
                                        <p className="txtStyle05-C333">
                                            보호자님은 지원한 케어메이트 정보와 일 간병비를 확인하고 마음에 드는 분을
                                            선택해 주세요.
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src="../images/noticeInfoStep03.svg"
                                            alt="매칭 후 결제하고 케어메이트 맞이하기"
                                        />
                                    </figure>
                                    <div>
                                        <h4 className="txtStyle06-Cbrown">STEP 3</h4>
                                        <p className="txtStyle05-C333">
                                            매칭을 위해 결제를 진행해 주세요. 간병 시작일에 맞추어 케어메이트가
                                            찾아갑니다.
                                        </p>
                                    </div>
                                </li>
                            </ol>
                            <div className="noticeInfo__Register--txt">
                                <p className="txtStyle05">
                                    케어메이트의 사정으로 매칭이 취소될 수 있습니다. <br />
                                    사전에 케어메이트와 통화하여 출근유무를 확인하세요!
                                </p>
                            </div>
                        </div>
                        <div className="btnWrap">
                            <button 
                                type="button" 
                                className="btnColor"
                                onClick={()=>
                                    navigate('/')
                                }
                            >메인으로</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CareExtentSuccess;