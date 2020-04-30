import axios from 'axios';
import { GET_FIELDCROPS, ADD_FIELDCROPS, DELETE_FIELDCROPS, FIELDCROPS_LOADING, UPDATE_FIELDCROPS } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getFieldcrops = () => dispatch => {
  dispatch(setFieldcropsLoading());
  axios
    .get(API_URL + '/api/fieldcrops')
    .then(res =>
      dispatch({
        type: GET_FIELDCROPS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addFieldcrop = fieldcrop => (dispatch, getState) => {
  axios
    .post(API_URL + '/api/fieldcrops', fieldcrop, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_FIELDCROPS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const updateFieldcrop = (id,fieldcrop) => (dispatch, getState) => {
  axios
    .post(API_URL + `/api/updatefieldcrop/${id}`, fieldcrop, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_FIELDCROPS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteFieldcrop = id => (dispatch, getState) => {
  axios
    .delete(API_URL + `/api/fieldcrops/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_FIELDCROPS,
        payload: id
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setFieldcropsLoading = () => {
  return {
    type: FIELDCROPS_LOADING
  };
};