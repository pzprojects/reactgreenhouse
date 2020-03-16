import axios from 'axios';
import { GET_VEGTABLES, ADD_VEGTABLES, DELETE_VEGTABLES, VEGTABLES_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getVegetables = () => dispatch => {
  dispatch(setVegetablesLoading());
  axios
    .get('/api/Vegetables')
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
    .post('/api/Vegetables', vegetable, tokenConfig(getState))
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

export const deleteVegetable = id => (dispatch, getState) => {
  axios
    .delete(`/api/Vegetables/${id}`, tokenConfig(getState))
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