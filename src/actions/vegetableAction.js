import axios from 'axios';
import { GET_VEGTABLES, ADD_VEGTABLES, DELETE_VEGTABLES, VEGTABLES_LOADING,UPDATE_VEGTABLES } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getVegetables = () => dispatch => {
  dispatch(setVegetablesLoading());
  axios
    .get(API_URL + '/api/Vegetables')
    .then(res =>
      dispatch({
        type: GET_VEGTABLES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addVegetable = vegetable => (dispatch, getState) => {
  axios
    .post(API_URL + '/api/Vegetables', vegetable, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_VEGTABLES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const updateVegetable = (id,vegetable) => (dispatch, getState) => {
  axios
    .post(API_URL + `/api/updateveg/${id}`, vegetable, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_VEGTABLES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteVegetable = id => (dispatch, getState) => {
  axios
    .delete(API_URL + `/api/Vegetables/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_VEGTABLES,
        payload: id
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setVegetablesLoading = () => {
  return {
    type: VEGTABLES_LOADING
  };
};