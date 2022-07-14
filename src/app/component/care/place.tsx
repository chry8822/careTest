import React,{useState, useRef, useEffect,useCallback, useMemo} from 'react';
import Header from "../common/header";
import {useNavigate, useParams} from "react-router-dom";
import {throttle} from "lodash";
import Api from '../../api/api'
import { useDispatch } from 'react-redux';
import Popup from "../common/popup";
import {hidePopup, showPopup} from "../../redux/actions/popup/popup";
import * as Utils from '../../constants/utils'
import CarePlaceDetailPopup from './popup/placeDetail';
import {setCare} from "../../redux/actions/care/care";


const ADDRESS_API_KEY = `U01TX0FVVEgyMDIxMDEyODExMTIxODExMDc1MTU=`;

let curPage: number = 1; //## 현재 페이지
let totalPage: number = 1; //## 최대 페이지
let limit: number = 20; //## paging limit


const CarePlace = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const observerRef = useRef<HTMLLIElement>(null);
    const scrollRef = useRef<any>(null)
    const getParam = useParams();
    const [ detailPlaceType ] = useState<string>(getParam.type || "register")
    const [ extendType ] = useState<string>(getParam.time || "")
    const [ placeType ] = useState<string>(getParam.place || "")
    const [ scrollFlag, setScrollFlag ] = useState(false)
    const [ carePlaceList, setCarePlaceList ] = useState<any[]>([]);
    const [ familyId ] = useState<number>(Number(getParam.familyId) || 0);    //## 선택한 가족 Id
    const [ searchText, setSearchText] = useState<string>("");               //## 장소 검색 Input Text
    const [ searchMessage, setSearchMessage] = useState<string>("");         //## 장소 검색 후 검색 결과 없을 시 메시지
    const [ selectCarePlace, setSelectCarePlace] = useState({               //## 선택 한 장소 데이터
        id: 0,
        info: "",
        detail: "",
        address: "",
        addressNameArr: "",
        lat: 0,
        lon: 0,
        hosCode: "",
        locCode: "",
        siCode: "",
        guCode: ""
    });

    //##################################################################################################################
    //##
    //## >> Override
    //##
    //##################################################################################################################


    useEffect(() => {
        window.scrollTo(0, 0);

        // 초기 데이터 불러오기
        getCarePlace();
        
        // socket = new SocketIO("");
        // return () => {
        //     if (socket != null) {
        //         socket.viewStay();
        //     }
        // }
        // getCarePlace();

    }, []);

    console.log("carePlaceList",carePlaceList[0])

        /**
     * 장소를 선택하고 기타 상세 주소를 입력 시 호출
     * -----------------------------------------------------------------------------------------------------------------
     */
         useEffect(() => {
            if (selectCarePlace.detail) {
                setMap();
            }
        }, [selectCarePlace.detail]);




    /**
     * 스크롤 위치 
     * -----------------------------------------------------------------------------------------------------------------
     */


    //### 스크롤 이벤트 등록/해제
    const useScroll = () => {
    const [scrollY, setScrollY] = useState<number>(0);
    useEffect(() => {
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

     /**
     * Scroll Listener
     * -----------------------------------------------------------------------------------------------------------------
     */

    //### 일정 주기로 현재 스크롤 위치 업데이트
    const scrollListener = useMemo(() => throttle(() => {
            setScrollY(window.scrollY);
        }, 120), []);

        return {scrollY};
    }
    
    /**
     * 스크롤 변경 시 호출
     * -----------------------------------------------------------------------------------------------------------------
     */

    const {scrollY} = useScroll()  //## 업데이트 되는 스크롤 위치 
    useEffect(() => {   
        if(scrollRef.current !== null && scrollY + 60 > scrollRef.current.offsetTop ){ //# current 값 들어오는지 확인 되고 결과 버튼 위에 왔을때 scrollFlag = true 업데이트
            setScrollFlag(true)
        }else{
            setScrollFlag(false)
        }

        // 장소 리스트가 들어오고 나서 스크롤이 생기고 특정 스크롤 지점에 도착하면 새로운 페이지 업데이트   
        
    },[scrollY])



    /**
     * 스크롤 시 데이터 호출 (curPage + 1) intersectionObserver
     * -----------------------------------------------------------------------------------------------------------------
     */

    useEffect(() => {
        console.log(observerRef)
        if (observerRef.current !== null) {
            console.log('observer 등록')
            let options = {
                root: null,
                rootMargin: '0px',
                threshold: 0
            }
            
        const observer = new IntersectionObserver(callback, options);
        observer.observe(observerRef.current)  
        }
    },[observerRef.current, observerRef])


    const callback = useCallback((entries:any, observer:any) => {
        entries.forEach((entry:any) => {
            console.log("inin")
            if(entry.isIntersecting){
                console.log("해제")
                observer.unobserve(observerRef.current)
                curPage = curPage + 1;
                getCarePlace(); 
                console.log("셋팅")
            }
        })
    },[carePlaceList])


    //##################################################################################################################
    //##
    //## >> Method : Render
    //##
    //##################################################################################################################

    /**
     * 간병장소 리스트 Rendering
     * -----------------------------------------------------------------------------------------------------------------
     */

    const renderCarePlaceList = useMemo(() => {
        return (
                    carePlaceList.map((item:any, idx:number) => {
                        if(idx === carePlaceList.length - 3) {
                        return(
                            <li 
                                key={idx} 
                                ref={observerRef}
                                onClick={() => carePlaceSelect(idx)}
                            > 
                                    <h3 className="txtStyle04-W500">{item.name}</h3>
                                    <p className="txtStyle06-C777">{item.address}</p>
                            </li>
                        )
                        } else {
                            return (
                                <li 
                                    key={idx}
                                    onClick={() => carePlaceSelect(idx)}
                                >
                                   
                                        <h3 className="txtStyle04-W500">{item.name}</h3>
                                        <p className="txtStyle06-C777">{item.address}</p>
                                </li>
                            )
                        }
                })
        )
    },[carePlaceList,observerRef.current]) 
    
    // 20개씩 로드 되는 데이터에 마지막 요소에 ref 로 current 값 감시해서 해당 요소가 감지되면 다음 데이터 로드



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
     * @param result : Object Data
     */
     const popupAction = (type: string, result?: any) => {
        dispatch(hidePopup());

        if (type === "selectAddress" && result) {
            //### 스크롤 위치 분기 초기화
            window.scrollTo(0, 0);
            setScrollFlag(false);

            if (placeType === "hospital") {
                setSelectCarePlace({
                    ...result
                });
            } else {
                let geoCoder = new window.kakao.maps.services.Geocoder();

                geoCoder.addressSearch(result.address, function (res: any, status: number) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        setSelectCarePlace({
                            ...result,
                            lat: res[0].y,
                            lon: res[0].x
                        });
                    }
                });
            }
        }
    };



    //##################################################################################################################
    //##
    //## >> Method : Private
    //##
    //##################################################################################################################

    /**
     * 간병 장소 API 호출
     * -----------------------------------------------------------------------------------------------------------------
     */
     const getCarePlace = () => {
        if (placeType === "hospital") {
            hospitalListApi();
        } else {
            addressListApi();
        }
    };


    /**
     * 지역 검색 리스트 Search (enter 키)
     * -----------------------------------------------------------------------------------------------------------------
     * @param e : Event
     */
         const searchEnterKey = (e?: any) => {
            if (e.key === "Enter" || e.keyCode === 13) {
                addressSearch();
                e.target.blur();
            }
        };


    /**
     * 검색하기
     * -----------------------------------------------------------------------------------------------------------------
     */
    const addressSearch = () => {
        if (selectCarePlace.detail) {
            return;
        }
        window.scrollTo(0, 0);
        curPage = 1;
        totalPage = 1;
        getCarePlace();
    };

    /**
     * 간병장소 선택 처리
     * -----------------------------------------------------------------------------------------------------------------
     */
     const carePlaceSelect = (idx: number) => {
        let selectPlace = {
            id: carePlaceList[idx].id,
            info: carePlaceList[idx].name,
            detail: "",
            address: carePlaceList[idx].address,
            addressNameArr: carePlaceList[idx].address_name_arr,
            lat: carePlaceList[idx].lat,
            lon: carePlaceList[idx].lon,
            hosCode: carePlaceList[idx].hos_code,
            locCode: carePlaceList[idx].loc_code,
            siCode: carePlaceList[idx].si_code,
            guCode: carePlaceList[idx].gu_code
        };
        console.log("selectPlace",selectPlace)
        setSelectCarePlace({
            ...selectPlace
        });

        //### 상세주소 입력 팝업 띄우기
        // dispatch(showPopup({element:CarePlaceDetailPopup,action:popupAction,actionType:"selectAddress",title:placeType}));
        dispatch(showPopup({
            element:() => CarePlaceDetailPopup({jobType: extendType, placeType: placeType, selectPlace: selectPlace}),
            action:popupAction,
            type:"popup",
            actionType:"selectAddress",
            title:placeType}));
    };


    /**
     * SelectCarePlace 초기화
     * -----------------------------------------------------------------------------------------------------------------
     */
    const initSelectCarePlace = () => {
        setSelectCarePlace({
            id: 0,
            info: "",
            detail: "",
            address: "",
            addressNameArr: "",
            lat: 0,
            lon: 0,
            hosCode: "",
            locCode: "",
            siCode: "",
            guCode: ""
        });
    };


    const confirmCarePlace = () => {
        dispatch(setCare({
            ...selectCarePlace
        }));
        if(detailPlaceType === "register") {
            navigate(`/care/write/register/0/${extendType}/${placeType}/${familyId}`)
        }
    }

console.log("selectCarePlace",selectCarePlace)

     /**
     * Set Map
     * -----------------------------------------------------------------------------------------------------------------
     */
      const setMap = () => {
         if (selectCarePlace.lat === 0 || selectCarePlace.lon === 0) {
             return;
         }
         // let container = mapRef.current
         let container = document.getElementById('map');
         let options = {
             center: new window.kakao.maps.LatLng(selectCarePlace.lat, selectCarePlace.lon),
             level: 4
         };
 
         let markerPosition = new window.kakao.maps.LatLng(selectCarePlace.lat, selectCarePlace.lon);
 
         let marker = new window.kakao.maps.Marker({
             position: markerPosition,
         });
 
         let map = new window.kakao.maps.Map(container, options);
 
         map.setDraggable(false);
         map.setZoomable(false);
         window.kakao.maps.event.addListener(map, 'dblclick', null);
         if (selectCarePlace.lat !== 37.504942) {
             marker.setMap(map);
         }
 
         window.scrollTo(0, 0);
     };
    
 
//##################################################################################################################
    //##
    //## >> Method : Api
    //##
    //##################################################################################################################

    /**
     * 병원 리스트 API
     * -----------------------------------------------------------------------------------------------------------------
     */
     const hospitalListApi = () => {
        try {
            Api.hospitalListNew(curPage, searchText).then((response: any) => {
                if (response.status === 200) {
                    let data = response.data;
                    if (data.code === 200) {
                        let mData = data.data;

                        let tempArrList: any[] = [];

                        for (let idx in mData.hospitals.data) {
                            let item = mData.hospitals.data[idx];

                            tempArrList.push({
                                'id': item.id,
                                'name': item.name,
                                'address': item.address,
                                'address_name_arr': "",
                                'lat': item.lat ? item.lat : 0,
                                'lon': item.lon ? item.lon : 0,
                                'hos_code': item.hos_code ? item.hos_code : '',
                                'loc_code': item.loc_code ? item.loc_code : '',
                                'si_code': item.si_code ? item.si_code : '',
                                'gu_code': item.gu_code ? item.gu_code : ''
                            });
                        }

                        let list = curPage === 1 ? tempArrList : carePlaceList.concat(tempArrList);

                        setCarePlaceList(list);
                        setSearchMessage("등록되지 않은 병,의원입니다.");
                        //### 총 페이지 구하기
                        totalPage = Math.ceil(mData.hospitals.total / limit);
                    } else {
                        if (curPage !== 1) {
                            curPage = -1;
                        }
                        dispatch(showPopup({element:Popup, action:popupAction}));
                    }
                } else {
                    dispatch(showPopup({element:Popup, action:popupAction}));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup, action:popupAction}));
            });
        } catch (e) {
            dispatch(showPopup({element:Popup, action:popupAction}));
        }
    };

    /**
     * 주소 리스트 Api
     * -----------------------------------------------------------------------------------------------------------------
     */
    const addressListApi = () => {
        if (Utils.isEmpty(searchText) || !Utils.checkSearchedWord(searchText)) {
            return;
        }
        try {
            Api.addressList(ADDRESS_API_KEY, searchText, curPage, limit).then((response: any) => {
                if (response.status === 200) {
                    let mData = response.data.results;

                    let tempArrList: any[] = [];

                    for (let idx in mData.juso) {
                        let item = mData.juso[idx];

                        tempArrList.push({
                            'id': "",
                            'name': item.jibunAddr,
                            'address': item.roadAddr,
                            'address_name_arr': item.siNm + " " + item.sggNm,
                            'lat': 0,
                            'lon': 0,
                            'hos_code': '',
                            'loc_code': '',
                            'si_code': '',
                            'gu_code': ''
                        });
                    }

                    let list = curPage === 1 ? tempArrList : carePlaceList.concat(tempArrList);

                    setCarePlaceList(list);
                    setSearchMessage(mData.common.errorMessage === "정상" ? "등록되지 않은 주소입니다." : mData.common.errorMessage);

                    //### 총 페이지 구하기
                    totalPage = Math.ceil(mData.common.totalCount / limit);
                } else {
                    if (curPage !== 1) {
                        curPage = -1;
                    }
                    dispatch(showPopup({element:Popup, action:popupAction}));
                }
            }).catch(err => {
                console.log(err);
                dispatch(showPopup({element:Popup, action:popupAction}));
            });
        } catch (e) {
            dispatch(showPopup({element:Popup, action:popupAction}));
        }
    };


   



    return (
        <>
            <Header
                historyBack={true}
                title="공고 등록"
            />
            <main id="content">
                <div className="subWrap">
                    <div className="subWrap__flex">
                         <section className={"noticeRegister" + (selectCarePlace.detail.length <=0 ? " breakLine" : "")}>
                            <div className="commonWrap">
                                <h2 className="a11y-hidden">공고 작성 단계</h2>
                                <ul className="noticeRegister__step">
                                    {/* <!-- 해당되는 step에 li에 active 추가되고 해당 스텝이 완료 되면 li에 check로 변경 --> */}
                                    <li className="active">장소 선택</li>
                                    <li className="">공고 작성</li>
                                    <li className="">대기</li>
                                </ul>

                                <article className="noticeRegister__form" ref={scrollRef}>
                                            <div className={"noticeRegister__form--txt" + (placeType === "hospital" ? " hospital" : " home")}>
                                                <h3 className="txtStyle03-W500">간병 장소 :{ placeType === "hospital" ?  " 병,의원" : " 집"}</h3>
                                                <p className="txtStyle06-C777">
                                                    선택한 케어메이트가 { placeType === "hospital" ?  " 병,의원 으로" : " 입력한 주소로"} 찾아갑니다.
                                                </p>
                                            </div>

                                    {/* 검색창 */}
                                    {/* <!-- 결과 버튼 위에 왔을 때  noticeRegister__form--search 에 scroll 추가 --> */}
                                    <div className={"noticeRegister__form--search" + (scrollFlag ? " scroll" : "") }>
                                        <div className="inputWrap">
                                            <div className="inputWrap__box">
                                                <input
                                                    type="text"
                                                    className={selectCarePlace.detail.length <= 0 ? "inputWrap__box--search" : ""} 
                                                    autoComplete="off"
                                                    placeholder={placeType === "hospital" ? "장소, 주소를 입력하세요." : "집 주소를 입력해주세요."}
                                                    // disabled={!!selectCarePlace.detail}
                                                    value={selectCarePlace.detail ? selectCarePlace.info : searchText}
                                                    disabled={!Utils.isEmpty(selectCarePlace.detail)}
                                                    onKeyPress={(e) => searchEnterKey(e)}
                                                    onChange={(e) => setSearchText(e.target.value)}

                                                />
                                                { 
                                                    searchText &&
                                                    <button 
                                                        type="reset" 
                                                        className="resetBtn"
                                                        onClick={()=> setSearchText("")}    
                                                    >리셋</button>
                                                }
                                            </div>
                                            {
                                                selectCarePlace.detail.length <= 0 &&
                                                <button 
                                                    type="button" 
                                                    className="searchBtn"
                                                    onClick={()=> addressSearch() }    
                                                >검색하기</button>
                                            }
                                        </div>
                                        <div className="inputWrap">
                                            {
                                                selectCarePlace.detail &&
                                                <div className='inputWrap__box'>
                                                    <input
                                                        type="text" value={selectCarePlace.detail} disabled
                                                    />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </article>
                            </div>
                            </section>
                        {
                            selectCarePlace.detail ? 
                                <section className="map">
                                    <h3 className="a11y-hidden">간병 장소 지도</h3>
                                    <div className="map__wrap place" id='map'>
                                    </div>
                                </section>
                            :
                            // {/* 검색 결과 */}
                                <section className="searchResult" >
                                    <h2 className="a11y-hidden">공고 장소 검색 결과</h2>
                                    {
                                        carePlaceList.length > 0 ?
                                        <ul className="searchResult__list" >
                                            {renderCarePlaceList}
                                        </ul>
                                        :
                                        <div className="postNone">
                                            <img src={"/images/noneSearch" + (placeType ==="hospital" ? "01" : "02") + ".svg"} alt="등록되지 않은 병,의원입니다." />
                                            <p>{ placeType ==="hospital" ?  "등록되지 않은 병,의원입니다." : "주소가 존재하지 않습니다."}</p>
                                        </div>
                                    }
                                </section>
                            }
                    </div>
                        {
                            !Utils.isEmpty(selectCarePlace.detail)  &&
                            <div className="btnWrap">
                                <button 
                                    type="button" 
                                    className="btnBorder"
                                    onClick={()=> {
                                        initSelectCarePlace();
                                    }}
                                >수정하기</button>
                                <button 
                                    type="button" 
                                    className="btnColor"
                                    onClick={() => confirmCarePlace()}
                                >다음</button>
                            </div>
                        }
                </div>
            </main>
        </>
    )
}

export default CarePlace;