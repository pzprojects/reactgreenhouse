import axios from 'axios';
import { GET_SYSTEMDATA, UPDATE_SYSTEMDATA, SYSTEM_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getSystemData = () => dispatch => {
  dispatch(setSystemLoading());
  axios
    .get(API_URL + '/api/systemconfig')
    .then(res =>
      dispatch({
        type: GET_SYSTEMDATA,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const updateSystemData = (id,vegetable) => (dispatch, getState) => {
  axios
    .post(API_URL + `/api/systemconfig/${id}`, vegetable, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_SYSTEMDATA,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setSystemLoading = () => {
  return {
    type:SYSTEM_LOADING
  };
};