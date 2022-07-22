import React from 'react'
import {Navigate, Route, Routes, BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import {
    Login,
    Main,
    CareExtend,
    CarePlace,
    CareRender,
    CareWrite,
    CareDetail,
    CareFamily,
    ThirdPartyDetail,
    CareSuccess,
    CareHistory,
    CareExtendCancel,
    ZoomMap,
    CommunityList
} from "./component";
import Popup from './container/popup/popup';
import Loading from './container/loading/loading';
import MainNavigator from './component/main/navigator/navigator';

const persistor = persistStore(store);

const Root: React.FC  = ()=> {
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Loading/>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Main/>}/>
                        <Route path="community/list" element={<CommunityList/>}/>
                        <Route path="job/list" element={<CareHistory/>}>
                            <Route path=":tab/" element={<CareHistory/>}/>
                            <Route path=":tab/:type" element={<CareHistory/>}/>
                        </Route>
                        <Route path="care">
                            <Route path="map/:lat/:lon" element={<ZoomMap/>} />
                            <Route path="cancel/:jobId/:status" element={<CareExtendCancel/>}/>
                            <Route path="login" element={<Login/>}/>
                            <Route path="select" element={<CareExtend/>} />
                            <Route path="place">
                               <Route path=":type/:time/:place" element={<CarePlace/>}>
                                    <Route path=":familyId" element={<CarePlace/>}/>
                                    <Route path=":familyId/:jobId" element={<CarePlace/>}/>
                                </Route>
                            </Route>
                            <Route path="family/list" element={<CareFamily/>}/>
                            <Route path="write">
                                <Route path=":type/:step/:time/:place" element={<CareWrite/>}/>
                                <Route path=":type/:step/:time/:place/:familyId" element={<CareWrite/>}/>
                                <Route path=":type/:step/:time/:place/:familyId/:jobId" element={<CareWrite/>}/>
                            </Route>
                            <Route path="detail">
                                <Route path="thirdParty" element={<ThirdPartyDetail/>}/>
                                <Route path=":type/:time/:place" element={<CareDetail/>}/>
                                <Route path=":type/:time/:place/:familyId" element={<CareDetail/>}/>
                                <Route path=":type/:time/:place/:familyId/:jobId" element={<CareDetail/>}/>
                            </Route>
                            <Route path="success" element={<CareSuccess/>}/>
                        </Route>
                      </Routes>
                     <MainNavigator/>
                     <Popup/>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </>
    )
}

export default Root;