import React, {useEffect} from 'react';
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setLoading} from "../../redux/actions/loading/loading";
import {RootState} from "../../redux/store";
import * as Utils from "../../constants/utils";
import axios from 'axios';


let callCount: number = 0; //### 동일한 분기 Api 호출 횟수 카운트
const Loading = () => {
    const dispatch = useDispatch();

    const {loading} = useSelector((state: RootState) => state.loading);

    useEffect(() => {
        //### Axios 요청
        axios.interceptors.request.use((config: AxiosRequestConfig) => {
            try {
                callCount += 1;
                dispatch(setLoading(true));
            } catch (err) {
                callCount -= 1;
                dispatch(setLoading(false));
            }

            if (config && config.data && config.headers) {
                const sha256 = require('sha256');
                let htime: string = new Date().getTime().toString();
                let str = typeof config.data === "string" ? config.data : JSON.stringify(config.data);
                config.headers["hkey"] = sha256(htime + str);
                config.headers["htime"] = htime
            }
            return config;
        });

        //### Axios 응답
        axios.interceptors.response.use((config: AxiosResponse) => {
            if (config.config.baseURL && config.config.url && config.data.code !== 200) { //# Api 통신결과가 실패일 경우
                //### 에러로그 보내기
                let message = `${config.config.baseURL}${config.config.url} : ${config.data.message}`;
                Utils.sendDeviceLog(message);
            }

            try {
                callCount -= 1;
                if (callCount === 0) {
                    dispatch(setLoading(false));
                }
            } catch (err) {
                //### Api 호출부에서 에러 예외처리
                callCount -= 1;
                dispatch(setLoading(false));
            }
            return config;
        }, (err) => {
            callCount -= 1;
            dispatch(setLoading(false));
            return Promise.reject(err);
        });
    }, []);

    useEffect(() => {
        if (callCount === 0) {
            dispatch(setLoading(false));
        }
    }, [callCount]);

    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <>
            {
                loading &&
                <aside className="loading">
                    <img src="/images/loading.gif" alt="로딩 중입니다." onError={Utils.imgSrcError}/>
                </aside>
            }
        </>
    );
};

export default Loading;
