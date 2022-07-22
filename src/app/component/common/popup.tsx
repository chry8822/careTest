import React from 'react';
import {useSelector} from "react-redux";
import * as Utils from "../../constants/utils";
import {RootState} from "../../redux/store";
import {PopupState} from "../../redux/states/popup/popup";

const Popup = () => {

    const popup: PopupState = useSelector((state: RootState) => state.popup) as PopupState;

    const DEFAULT_MSG = "일시적인 오류가 발생하였습니다.\n잠시 후 다시 시도해주세요.";

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <div className="popupWrap">
            {
                popup.actionType === "login" &&
                <figure>
                    <img src="/images/joinLogin.svg" alt="회원가입이나 로그인을 하시겠습니까?" />
                </figure>
            }
            {
                popup.actionType === "cancel" &&
                <div className="popupWrap__delete">
                    <figure></figure>
                </div>
            }
            <div className="popupWrap__tit">
                {
                      popup.actionType === "login" ?
                      ""
                      :
                      <h2 className="txtStyle03">{Utils.isEmpty(popup.title) ? "알림" : popup.title}</h2>
                }
                {
                    popup.actionType === "login" ?

                   <>
                        <h2>
                            회원가입 또는
                            <br />
                            <mark>로그인이 필요해요!</mark>
                        </h2>
                        <p>이동하시겠어요?</p>
                   </>
                    :
                    (
                        popup.actionType === "cancel" ?
                        <>
                            <h2><mark>등록하신 공고가 삭제되었습니다.</mark></h2>
                            <p>감사합니다.</p>
                        </>
                        :
                        <p dangerouslySetInnerHTML={{__html: Utils.isEmpty(popup.content) ? DEFAULT_MSG : popup.content}}/>
                    )
                }
            </div>
            <div className="btnWrap">
                {
                    popup.btnType === 'two' &&
                    <button type="button" className="btnBorder"
                            onClick={() => popup.action("hide")}>
                        {
                            popup.actionType === "login"?
                            "다음에 할게요"
                            :
                            Utils.isEmpty(popup.btn01) ? "취소" : popup.btn01
                        }
                    </button>
                }
                <button type="button" className="btnColor"
                        onClick={() => popup.action(popup.actionType)}>
                        {
                            popup.actionType === "login"?
                            "네! 이동할래요"
                            :
                            Utils.isEmpty(popup.btn02) ? "확인" : popup.btn02
                        }
                </button>
            </div>
        </div>
    );
};

export default Popup;
