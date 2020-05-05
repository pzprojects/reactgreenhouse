import axios from 'axios';
import { GET_VEGLOGS, ADD_VEGLOGS, DELETE_VEGLOGS, VEGLOGS_LOADING, RESET__VEGLOG, SET_VEGLOG_DONE } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getVegeLogs = () => dispatch => {
    dispatch(setVegLogLoading());
    axios
        .get(API_URL + '/api/veglogs')
        .then(res =>
            dispatch({
                type: GET_VEGLOGS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const addVegLog = veglog => (dispatch, getState) => {
    dispatch(SetVegLogDone());
    axios
        .post(API_URL + '/api/veglogs', veglog, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: ADD_VEGLOGS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const deleteVegeLog = id => (dispatch, getState) => {
    axios
        .delete(API_URL + `/api/veglogs/${id}`, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: DELETE_VEGLOGS,
                payload: id
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const setVegLogLoading = () => {
    return {
        type: VEGLOGS_LOADING
    };
};

export const ResetVegLog = () => {
    return {
        type: RESET__VEGLOG
    };
};

export const SetVegLogDone = () => {
    return {
        type: SET_VEGLOG_DONE
    };
};