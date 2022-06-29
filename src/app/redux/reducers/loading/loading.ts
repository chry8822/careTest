import { LoadingState, InitalLoading } from "../../states/loading/loading";
import { LoadingAction, SET_LOADING, INIT_LOADING } from "../../actions/loading/loading";

function loading(state: LoadingState = InitalLoading, action: LoadingAction) {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload.loading
            };
        case INIT_LOADING: 
            return InitalLoading;
        default :
            return state;
    }
} 

export default loading;