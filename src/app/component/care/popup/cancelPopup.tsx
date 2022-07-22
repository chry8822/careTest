import React from 'react';
import { PopupState } from '../../../redux/states/popup/popup';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

const CancelPopup = () => {

    const popup: PopupState = useSelector((state: RootState) => state.popup);

    const DEFAULT_MSG = "일시적인 오류가 발생하였습니다.\n잠시 후 다시 시도해주세요.";

    return (
        <>
        {
            popup.actionType === "penaltyCancel" ?
            <div className="popupWrap">
                <div className="popupWrap__tit">
                    <h2><mark>간병을 취소하시겠어요?</mark></h2>
                    <p>
                        취소 시, 위약금 기준에 해당하는 경우<br />
                        <strong className="txtRed">취소위약금</strong>이 발생할 수 있습니다.
                    </p>
                </div>
                <div className="popupWrap__info">
                    <div className="popupWrap__info--flex">
                        <h3 className="txtCenter">[ 간병취소 위약금 부과 기준 ]</h3>
                        <p className="dash">
                            매칭된 간병 시작 일시 기준 2일 전 취소 ~ 당일 취소 시점에 따라 10,000~최대 30,000원의
                            취소 수수료 부과
                        </p>
                        <p className="dash">진행 중인 간병의 간병취소 요청 시, 접수 일시 기준으로 적용</p>
                        <p className="dash">
                            진행 중인 간병의 간병 취소요청 접수 일시 기준, 케어메이트 회원에게 보장 된 간병 일이
                            3일 이하부터 10,000원~최대 30,000원의 취소 위약금 부과
                        </p>
                        <p className="dash">
                            간병 시작 시각까지 남은 시간이 미부과 기준에 해당되면 부과 되지 않습니다.
                        </p>
                    </div>
                </div>
                <div className="btnWrap">
                    <button
                        type="button"
                        className="btnBorder"
                        onClick={() => popup.action("hide")}
                    >돌아가기</button>
                    <button
                        type="button"
                        className="btnColor"
                        onClick={() => popup.action(popup.actionType)}
                    >네</button>
                </div>
            </div>
            :
            <div className="popupWrap">
                <figure className="">
                    <img src="/images/cancelRequest.svg" alt="고객 센터에 간병 취소 요청 접수" />
                </figure>
                <div className="popupWrap__tit">
                    <h2><mark>간병 취소 요청이 접수되었습니다.</mark></h2>
                    <p>
                        담당자 확인 후 연락드리겠습니다. <br />
                        감사합니다.
                    </p>
                </div>
                <div className="btnWrap">
                    <button 
                        type="button" 
                        className="btnColor"
                        onClick={()=> popup.action(popup.actionType)}                        
                    >확인</button>
                </div>
            </div>
        }
        </>
    )
}

export default CancelPopup;