import React,{ useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Utils from '../../../constants/utils'
import { useDispatch } from 'react-redux';
import Popup from '../../common/popup';
import { showPopup, hidePopup } from '../../../redux/actions/popup/popup';
import { useParams } from 'react-router-dom';

const MainNavigator = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const pathName = useMemo(()=> {
    //## path 가져오기
    return (
      window.location.pathname
    )
  },[window.location.pathname]) 

  const [ navTab, setNavTab ] = useState(pathName) //## 해당 path와 일치하는 탭 활성화

    //##################################################################################################################
    //##
    //## >> Method : Popup
    //##
    //##################################################################################################################

    const popupAction = (type:any) => {
      dispatch(hidePopup());
      if(type === "login"){
        navigate("/care/login")
      }
  }
  

    //##################################################################################################################
    //##
    //## >> Method : private
    //##
    //##################################################################################################################

    /**
     * 탭 이동
     * -----------------------------------------------------------------------------------------------------------------
     */

  const moveCareList = (path:any, type?:any) => {
    if(Utils.isAuthCheck() && type === "login" ){
      dispatch(showPopup({element:Popup,action:popupAction,actionType:"login",btnType:"two"}))
    }else{
        setNavTab(path)
        navigate(path)
      }
    }

    //##################################################################################################################
    //##
    //## >> Method : render
    //##
    //##################################################################################################################

  return (
    <>
    {
      pathName.includes("care") ? ""
      :
        <nav id="site-menu" className="siteMenu">
          <ul aria-labelledby="site-menu">
            <li onClick={()=>{
              moveCareList("/")
            }}>
              <a href={undefined} className={`nav01${navTab.includes("list" || "mypage") ?  " " : " current"}`}>메인</a>
            </li>
            <li onClick={()=>{
              moveCareList("/job/list/process","login")
            }}>
              <a href={undefined} className={`nav02${navTab.includes("/job/list/process") ?  " current" : ""}`}>간병내역</a>
            </li>
            <li onClick={()=>{
               
               moveCareList("/community/list")
            }}>
              <a href={undefined} className={`nav03${navTab === "/community/list" ?  " current" : ""}`}>커뮤니티</a>
            </li>
            <li>
              <a href={undefined} className="nav04">
                오국화 
              </a>
            </li>
          </ul>
        </nav>
    }
    </>
  )
}

export default MainNavigator;

// 현재 탭일경우 current 클래스 추가