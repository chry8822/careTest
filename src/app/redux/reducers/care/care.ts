import {CareType} from "../../../component/care/common/types"
import {InitialCare} from '../../states/care/care'
import {CareAction, SET_CARE, INIT_CARE} from "../../actions/care/care";

function care(state: CareType = InitialCare, action: CareAction) {
    switch (action.type) {
        case SET_CARE:
            return {
                ...state,
                ...action.payload
            };
        case INIT_CARE:
            return InitialCare;
        default:
            return state;
    }
}

export default care;
