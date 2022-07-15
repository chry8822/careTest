import React,{ useMemo } from 'react'
import Header from './header';
import { showPopup, hidePopup } from '../../redux/actions/popup/popup';
import { useDispatch } from 'react-redux';
import renderThirdPartyPopup from './thirdPartyPopup';




const ThirdPartyDetail = () => {

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

    };



    return (
        <>
            <Header
                historyBack={true}
                title="이용약관"
            />
            <main>
                <div className="subWrap bgGray">
                    <div className="subWrap__flex">
                        <div className="navNonebgGrayList pt20">
                            <section className="clause__tit">
                                <div>
                                    <h2 className="txtStyle04-W500">[현행] YYYY.MM.DD</h2>
                                    <button 
                                        type="button" 
                                        className="listBtn"
                                        onClick={()=>
                                            dispatch(showPopup({element:renderThirdPartyPopup,type:"popup",action:popupAction}))
                                        }
                                    >목록</button>
                                </div>
                                <p className="txtStyle06-C777">
                                    해당 문서의 효력은 YYYY.MM.DD에 종료 될 예정입니다. <br />
                                    시행 예정인 문서의 열람을 원하신다면, 목록에서 선택해주세요.
                                </p>
                            </section>
                            <section className="clause__detail">
                                {/* <!-- 여기에 에디터로 쓴 내용이 들어갑니다. --> */}
                                <div className="Accept-content">
                                    <div>
                                        <h1 style={{textAlign:"center"}}className="titleFont">
                                            <b><span style={{fontSize: "14px"}}>케어네이션 이용약관(보호자)&nbsp;</span></b>
                                        </h1>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ThirdPartyDetail;