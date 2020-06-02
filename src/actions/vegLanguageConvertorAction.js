import axios from 'axios';
import { GET_VEGLANGUAGES, ADD_VEGLANGUAGES, DELETE_VEGLANGUAGES, VEGLANGUAGES_LOADING,UPDATE_VEGLANGUAGES } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getvegetablelanguages = () => dispatch => {
  dispatch(setvegetablelanguagesLoading());
  axios
    .get(API_URL + '/api/veglanguages')
    .then(res =>
      dispatch({
        type: GET_VEGLANGUAGES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addvegetablelanguage = vegetablelanguage => (dispatch, getState) => {
  axios
    .post(API_URL + '/api/veglanguages', vegetablelanguage, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_VEGLANGUAGES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const updatevegetablelanguage = (id,vegetablelanguage) => (dispatch, getState) => {
  axios
    .post(API_URL + `/api/updateveglanguage/${id}`, vegetablelanguage, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_VEGLANGUAGES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deletevegetablelanguage = id => (dispatch, getState) => {
  axios
    .delete(API_URL + `/api/veglanguages/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_VEGLANGUAGES,
        payload: id
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setvegetablelanguagesLoading = () => {
  return {
    type: VEGLANGUAGES_LOADING
  };
};