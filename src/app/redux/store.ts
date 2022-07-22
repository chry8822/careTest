import {
    Popup,
    Care,
    Main,
    Loading
} from "./reducers/index";

import {combineReducers, createStore} from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// persistReducer = 리덕스 상태를 로컬,세션 스토리지에 저장 (상태보존)

// localStorage의 key, value
const persistConfig = {
    key: "root", // localStorage 에 저장될 때의 key값
    storage
}

const rootReducer = combineReducers({
    popup: Popup,
    care: Care,
    main:Main,
    loading:Loading
});
// store 에서 최종적으로 하나의 store 를 내보내야 하기 때문에 combineReducers로 
// reducer가 여러게면 하나의 rootReducer로 통합한다.

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
// ReturnType 은 반환된는 타입을 타입으로 가진다.
export const store = createStore(persistedReducer);