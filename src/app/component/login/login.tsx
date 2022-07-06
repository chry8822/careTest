import React,{ useState } from 'react';
import Header from '../common/header';
import * as Utils from "../../constants/utils";
import { useDispatch } from 'react-redux';
import Popup from '../common/popup';
import { showPopup, hidePopup } from '../../redux/actions/popup/popup';
import Api from '../../api/api';
import * as LocalStorage from "../../constants/localStorage";
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [ email, setEmail ] = useState(""); //## 아이디(이메일)
  const [ password, setPassword ] = useState("") //## 비밀번호



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
  }

  
    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################

    /**
     * 로그인
     * -----------------------------------------------------------------------------------------------------------------
     */

    const login = () => {
      let checkMsg;
      
      if(Utils.isEmpty(email)) {
        checkMsg = "이메일을 입력해주세요.";
      } else if(!Utils.emailCheck(email)) {
        checkMsg = "이메일 형식이 맞지않습니다.";
      } else if(Utils.isEmpty(password)){
        checkMsg = "비밀번호를 입력해주세요.";
      } else if(!Utils.existingPasswordCheck(password)) {
        checkMsg = "비밀번호 형식이 맞지않습니다.(영문으로 시작하며, 영문 + 숫자 6자리이상 20자리 이하)";
      } else {
        let jobj = {
          email: email,
          password: password
        }
        loginApi(jobj);
      }
      if(checkMsg) {
        dispatch(showPopup({element:Popup,content:checkMsg,action:popupAction}))
      }
    }


    
    //##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################

    /**
     * Login Api
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param data : Object Data
     */
  
    const loginApi = (data: any) => {
      try {
        Api.login(data, Buffer.from(email).toString('base64')).then((response: any) => {
          if(response.status === 200) {
            let data = response.data;
            if (data.code === 200) {
              LocalStorage.setStorage(LocalStorage.AUTHORIZATION, data.data.token_type + " " + data.data.access_token);
              LocalStorage.setStorage(LocalStorage.USER_ID, data.data.user.id);

              Utils.getRSAPublicKeyApi(data.data.token_type + " " + data.data.access_token, data.data.user.id, function (flag: boolean) {
                navigate("/")
            });
              // navigate("/")
            } else {
              dispatch(showPopup({element:Popup,content:data.message,action:popupAction}))
            }
          } else {
            dispatch(showPopup({element:Popup,action:popupAction}))
          }
        }).catch(err => {
          console.log(err)
        });
      } catch (e) {
        console.log(e)
      } 
    }
    
    // const test = "okh8822@hmcnetworks.co.kr"
    // console.log( "buffer", Buffer.from(test).toString('base64'))
    // console.log( "btoa", btoa(test))
    // legacy web platform APIs

  return (
    <>
      <Header 
        historyBack={true}
        title={"회원가입/로그인"}
      />
      <main>
        <div className="subWrap">
          <div className="subWrap__flex">
            <section className="login__form">
              <h2 className="a11y-hidden">아이디 비밀번호 입력하기</h2>
              <form className="login__form--enter">
                <ul className="basicInput">
                  <li className="basicInput__txt">
                    <label htmlFor="id" className="a11y-hidden">아이디</label>
                    <div className="basicInput__txt--form">
                      <div className="inputWrap__box">
                        <input 
                          type="email"
                          name="email"
                          id="id"
                          minLength={8}
                          maxLength={32}
                          placeholder="이메일을 입력해주세요."
                          value={email}
                          autoComplete="off"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                         {
                          email 
                            && 
                          <button 
                            type="reset" 
                            className="resetBtn"
                            onClick={() => setEmail("")}  
                          >리셋</button>
                        }
                      </div>
                    </div>
                    {/* <!-- <em>숫자만 입력해주세요</em> --> */}
                  </li>
                  <li className="basicInput__txt">
                    <label htmlFor="password" className="a11y-hidden">비밀번호</label>
                    <div className="basicInput__txt--form">
                      <div className="inputWrap__box">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            minLength={6}
                            maxLength={20}
                            placeholder="비밀번호를 입력해주세요."
                            value={password}
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {
                          password 
                            && 
                          <button 
                            type="reset" 
                            className="resetBtn"
                            onClick={() => setPassword("")}  
                          >리셋</button>
                        }
                      </div>
                    </div>
                    {/* <!-- <em>숫자만 입력해주세요</em> --> */}
                  </li>
                </ul>
                <div className="loginBtnWrap">
                  <button 
                    type="button" 
                    className="loginBtn"
                    onClick={login}  
                  >로그인</button>
                </div>
              </form>
            </section>
            <section className="join">
              <h2 className="a11y-hidden">가입하기</h2>
              <div className="commonWrap">
                <div className="joinBtnWrap">
                  <a href="" className="joinBtn">케어네이션 가입하기</a>
                </div>
                <ul className="join__find">
                  <li><a href="">아이디 찾기</a></li>
                  <li><a href="">비밀번호 찾기</a></li>
                </ul>
              </div>
            </section>
          </div>
          <section className="loginSns">
            <div className="loginSns__btn">
              <button type="button" className="loginSns__btn--kakao">카카오로 시작하기</button>
              <button type="button" className="loginSns__btn--apple">애플로 시작하기</button>
            </div>
            <div className="loginSns__list">
              <h2 className="txtStyle05">간편하게 로그인하기</h2>
              <ul className="loginSns__list--item">
                <li><button type="button" className="naver">네이버</button></li>
                <li><button type="button" className="facebook">페이스북</button></li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Login;