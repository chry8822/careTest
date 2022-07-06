import React from "react";
import { useNavigate } from 'react-router-dom';
import * as Utils from '../../constants/utils'

interface TextHeaderProps {
    historyBack?: boolean; //## 뒤로가기 버튼 유무
    title?: string;       //## 헤더 타이틀
    headerClass?: boolean;//## 헤더 b0 class 분기
    newWindow?: boolean;  //## 새 창 분기
    historyBackInterface?: boolean; //## 뒤로가기 클릭시 페이지 종료
    login?: boolean; //## 로그인/회원가입 버튼
    logoHeader?: boolean; //## 로고 헤더 유/무
}

const Header = ({logoHeader=false ,historyBack = false, title = "", headerClass = false, newWindow = false, historyBackInterface = false, login = false} : TextHeaderProps) => {



    const navigate = useNavigate();

    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################

    /**
     * 뒤로가기 처리 메서드
     * -----------------------------------------------------------------------------------------------------------------
     */
    const historyBackMethod = () => {
        if (!historyBack) {
            return;
        }

        // if (historyBackInterface) {
        //     Utils.pageFinish();
        //     return;
        // }

        if (newWindow) {
            window.close();
        } else {
            navigate(-1)
        }
    };
    

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <header className={headerClass ? "b0" : ""}>
            <div className="commonWrap">
                         {
                           <>
                               { 
                                    logoHeader ?
                                        <div>
                                            <h1><img src="/img/carenationLogo.svg" alt="케어네이션" onError={Utils.imgSrcError}/></h1>
                                        </div>
                                        :
                                        Utils.isEmpty(title) ?
                                            <div>
                                                <h1><a href="">케어네이션</a></h1>
                                            </div>
                                                :
                                                <div onClick={historyBackMethod}>
                                                    <div>
                                                        {
                                                            historyBack &&
                                                            <button type="button" className="backBtn">뒤로가기</button>
                                                        }
                                                    <h1 className="txtStyle01-Wnoml">{title}</h1>
                                                    </div> 
                                                </div> 
                                }
    
    
                                {
                                    login && <button 
                                            type="button" 
                                            className="grayBtn"
                                            onClick={() => navigate("/care/login")}
                                            >회원가입/로그인</button>
                                }

                             
                           </>
                    }
            </div>
        </header>
    )
};

export default Header;
