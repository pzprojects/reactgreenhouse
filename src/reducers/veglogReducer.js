import {
    GET_VEGLOGS, ADD_VEGLOGS, DELETE_VEGLOGS, VEGLOGS_LOADING, RESET__VEGLOG, SET_VEGLOG_DONE
} from '../actions/types';

const initialState = {
    veglogs: [],
    VegLogLoading: false,
    VegLogUpdated: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_VEGLOGS:
            return {
                ...state,
                veglogs: action.payload,
                VegLogLoading: false
            };
        case DELETE_VEGLOGS:
            return {
                ...state,
                veglogs: state.veglogs.filter(veglog => veglog._id !== action.payload)
            };
        case ADD_VEGLOGS:
            return {
                ...state,
                veglogs: [action.payload, ...state.veglogs]
            };
        case VEGLOGS_LOADING:
            return {
                ...state,
                VegLogLoading: true
            };
        case RESET__VEGLOG:
            return {
                veglogs: [],
                VegLogLoading: false,
                VegLogUpdated: false
            };
        case SET_VEGLOG_DONE:
            return {
                ...state,
                VegLogUpdated: true
            };
        default:
            return state;
    }
}