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
    CareWrite
} from "./component";
import Popup from './container/popup/popup';

const persistor = persistStore(store);

const Root: React.FC  = ()=> {
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Main/>}/>
                        <Route path="care">
                            <Route path="login" element={<Login/>}/>
                            <Route path="new/extend" element={<CareExtend/>} />
                            <Route path="place">
                                <Route path=":type/:time/:place" element={<CarePlace/>}>
                                    <Route path=":jobId" element={<CarePlace/>}/>
                                </Route>
                            </Route>
                            <Route path="write">
                                <Route path=":type/:step/:time/:place" element={<CareWrite/>}/>
                            </Route>
                        </Route>
                      </Routes>
                     <Popup/>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </>
    )
}

export default Root;