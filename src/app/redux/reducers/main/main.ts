import {InitialMain, MainState} from "../../states/main/main";
import {ADD_MAIN_DATA, INIT_MAIN_DATA, MainAction} from "../../actions/main/main";

function main(state: MainState = InitialMain, action: MainAction):MainState {
    switch(action.type) {
        case ADD_MAIN_DATA: {
            return {
                ...state,
                ...action.payload
            }
        }
        case INIT_MAIN_DATA: {
            return InitialMain;
        }
        default:{
            return {
                ...state
            };
        }
    }
}

export default main;