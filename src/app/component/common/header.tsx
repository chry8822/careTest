import React from "react";

interface TextHeaderProps {
    historyBack?: boolean; //## 뒤로가기 버튼 유무
    title?: string;       //## 헤더 타이틀
    headerClass?: boolean;//## 헤더 b0 class 분기
    newWindow?: boolean;  //## 새 창 분기
    historyBackInterface?: boolean; //## 뒤로가기 클릭시 페이지 종료
}

const Header = ({historyBack = false, title = "", headerClass = false, newWindow = false, historyBackInterface = false} : TextHeaderProps) => {

    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################

    /**
     * 뒤로가기 처리 메서드
     * -----------------------------------------------------------------------------------------------------------------
     */
    // const historyBackMethod = () => {
    //     if (!historyBack) {
    //         return;
    //     }

    //     if (historyBackInterface) {
    //         Utils.pageFinish();
    //         return;
    //     }

    //     if (newWindow) {
    //         window.close();
    //     } else {
    //         Utils.historyBack();
    //     }
    // };

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <header className={headerClass ? "b0" : ""}>
            <div className="commonWrap">
                {
                    // Utils.isEmpty(title) ?
                        <div>
                            <h1><a href="">케어네이션</a></h1>
                        </div>
                        // :
                        // <div onClick={historyBackMethod}>
                        // <div>
                        //     {
                        //         historyBack &&
                        //         <button type="button" className="backBtn">뒤로가기</button>
                        //     }
                        //     <h1 className="txtStyle01-Wnoml">{title}</h1>
                        // </div>
                }
            </div>
        </header>
    )
};

export default Header;
