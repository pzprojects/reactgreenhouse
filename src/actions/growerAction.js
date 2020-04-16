import axios from 'axios';
import { GET_GROWERS, ADD_GROWER, DELETE_GROWER, GROWERS_LOADING, GET_GROWERS_BY_FARMER } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getgrowers = () => dispatch => {
  dispatch(setgrowersLoading());
  axios
    .get(API_URL + '/api/growers')
    .then(res =>
      dispatch({
        type: GET_GROWERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const getgrowersbyfarmer = (email) => dispatch => {
  dispatch(setgrowersLoading());
  axios
    .get(API_URL + '/api/growers/' + email)
    .then(res =>
      dispatch({
        type: GET_GROWERS_BY_FARMER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addgrower = grower => (dispatch, getState) => {
  axios
    .post(API_URL + '/api/growers', grower, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_GROWER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deletegrower = email => (dispatch, getState) => {
  axios
    .delete(API_URL + `/api/growers/${email}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_GROWER,
        payload: email
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setgrowersLoading = () => {
  return {
    type: GROWERS_LOADING
  };
};