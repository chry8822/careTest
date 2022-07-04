import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hidePopup} from "../../redux/actions/popup/popup";
import styled from "styled-components";
import {CSSTransition} from "react-transition-group";
import {RootState} from "../../redux/store";
import {PopupState} from "../../redux/states/popup/popup";

const PopupWrap = styled.aside`
    &&& {
        .popup-enter {
            opacity: 0;
            transform: scale(0.7);
        }
        .popup-enter-active {
            opacity: 1;
            transform: scale(1);
            transition: all 0.2s ease-in-out;
        }
        .popup-exit {
            opacity: 1;
            transform: scale(1);
        }
        .popup-exit-active {
            opacity: 0;
            transform: scale(0.7);
            transition: all 0.2s ease-in-out;
        }
        .bottomPopup-enter {
            transform: translateY(100%);
        }
        .bottomPopup-enter-active {
            transform: translateY(0);
            transition: all 0.7s cubic-bezier(0.8, 0, 0.33, 1);
        }
        .bottomPopup-exit {
            transform: translateY(0);
        }
        .bottomPopup-exit-active {
            transform: translateY(100%);
            transition: all 0.7s cubic-bezier(0.8, 0, 0.33, 1);
        }
    }
`;

const Popup = () => {
    const dispatch = useDispatch();

    const popup: PopupState = useSelector((state: RootState) => state.popup) as PopupState;

    //##################################################################################################################
    //##
    //## >> Method : Override
    //##
    //##################################################################################################################

    useEffect(() => {
        if (popup.show && popup.element) {
            document.body.style.overflow = "hidden";
            window.addEventListener("popstate", popupOff);
            return () => {
                document.body.style.removeProperty("overflow");
                window.removeEventListener("popstate", popupOff);
            };
        }
    }, [popup]);

    /**
     * 팝업 닫힘 처리
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param e : Event Value
     */
    const popupOff = (e: any) => {
        if (e.target !== e.currentTarget) {
            return;
        }
        dispatch(hidePopup());
    };

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <PopupWrap className={(popup.type || "popup") + (popup.show && popup.element ? " active" : "")}>
            <CSSTransition in={!!popup.element} mountOnEnter unmountOnExit timeout={700} classNames={popup.type || "popup"}>
                {popup.element ? <popup.element/> : <></>}
            </CSSTransition>
        </PopupWrap>
    );
};

export default Popup;
