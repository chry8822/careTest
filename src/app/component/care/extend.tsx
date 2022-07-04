import React,{ useState } from 'react';
import Header from '../common/header';
import { useNavigate } from 'react-router-dom';
import * as Utils from '../../constants/utils'



const CareExtend = () => {

    const navigate =useNavigate()

    const [ extendType, setExtendType ] = useState('')
    const [ placeType, setPlaceType ] = useState('')


    // const validationData = () => {
    //     return Utils.isEmpty(extendType) || Utils.isEmpty(placeType)
    // }


    return (
        <>
            <Header
                title={"공고 등록"}
                historyBack={true}
            />
            <main id="content">
                <div className="subWrap">
                    <div className="subWrap__flex">
                        <div className="customCare">
                            <h2 className="txtStyle05-Wnoml"><strong>맞춤형 간병설정</strong>을 시작합니다.</h2>
                            <section className="careWrap">
                                <h3 className="txtStyle02">
                                    보호자님에게 필요한<br />
                                    <mark>간병 서비스</mark>는 무엇인가요?
                                </h3>
                                <ul className="radioSelectCheck">
                                    <li className="radioSelectCheck__box timeCareDown">
                                        <input 
                                            type="radio" 
                                            id="timeCare01" 
                                            name="timeCare" 
                                            value="timeCare01"
                                            checked={extendType === "timeCare01"}
                                            onChange={(e) => setExtendType(e.target.value)}
                                            />
                                        <label htmlFor="timeCare01" className="timeCare01"
                                        >시간제 간병
                                            <span
                                            >24시간 미만의 <br />
                                                간병이 필요해요.</span
                                            >
                                        </label>
                                    </li>
                                    <li className="radioSelectCheck__box timeCareUp">
                                        <input 
                                            type="radio" 
                                            id="timeCare02" 
                                            name="timeCare" 
                                            value="timeCare02"
                                            checked={extendType === "timeCare02"}
                                            onChange={(e) => setExtendType(e.target.value)}
                                            />
                                        <label htmlFor="timeCare02" className="timeCare02"
                                        >기간제 간병
                                            <span
                                            >24시간 이상의 <br />
                                                간병이 필요해요.</span
                                            >
                                        </label>
                                    </li>
                                </ul>
                            </section>
                            <section className="careWrap pt0">
                                <h3 className="txtStyle02">
                                    보호자님이 원하는 <br />
                                    <mark>간병장소</mark>를 선택해주세요!
                                </h3>
                                <ul className="radioSelectCheck">
                                    <li className="radioSelectCheck__box hospital">
                                        <input 
                                            type="radio" 
                                            id="placeCare01" 
                                            name="placeCare"
                                            value="placeCare01"
                                            checked={placeType === "placeCare01"}
                                            onChange={(e) => setPlaceType(e.target.value)} 
                                        />
                                        <label htmlFor="placeCare01">병, 의원</label>
                                    </li>
                                    <li className="radioSelectCheck__box home">
                                        <input 
                                            type="radio" 
                                            id="placeCare02" 
                                            name="placeCare"
                                            value="placeCare02"
                                            checked={placeType === "placeCare02"}
                                            onChange={(e) => setPlaceType(e.target.value)} 
                                        />
                                        <label htmlFor="placeCare02">집</label>
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                    <div className="btnWrap mt0">
                        <button 
                            type="button" 
                            className="btnBorder"
                            onClick = {() => navigate(-1)}
                        >이전</button>
                        <button 
                            type="button" 
                            className="btnColor" 
                            disabled={true}
                        >다음</button>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CareExtend;