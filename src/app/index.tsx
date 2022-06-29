import React from 'react'
import {Navigate, Route, Routes, BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import {
    Login,
    Main,
} from "./component";


const persistor = persistStore(store);

const Root: React.FC  = ()=> {
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Main/>}/>
                      </Routes>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </>
    )
}

export default Root;