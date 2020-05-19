import axios from 'axios';
import { GET_FARMERS, ADD_fARMER, DELETE_FARMER, FARMERS_LOADING, GET_FARMERS_BYAREA, GET_FARMER_BY_EMAIL, RESET_ALL_FARMERS } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getfarmers = () => dispatch => {
  dispatch(setFarmersLoading());
  axios
    .get(API_URL + '/api/farmers')
    .then(res =>
      dispatch({
        type: GET_FARMERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const getfarmerbyemail = (email) => dispatch => {
  dispatch(setFarmersLoading());
  axios
    .get(API_URL + '/api/farmers')
    .then(res =>
      dispatch({
        type: GET_FARMER_BY_EMAIL,
        payload: res.data,
        email: email
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const getfarmersbyarea = (area,plan) => dispatch => {
  dispatch(setFarmersLoading());
  axios
    .get(API_URL + '/api/farmers/' + encodeURI(area) + "/" + encodeURI(plan))
    .then(res =>
      dispatch({
        type: GET_FARMERS_BYAREA,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addFarmer = farmer => (dispatch, getState) => {
  axios
    .post(API_URL + '/api/farmers', farmer, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_fARMER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
    );
};

export const deleteFarmer = email => (dispatch, getState) => {
  axios
    .delete(API_URL + `/api/farmers/${email}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_FARMER,
        payload: email
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setFarmersLoading = () => {
  return {
    type: FARMERS_LOADING
  };
};

export const resetFarmersList = () => {
  return {
    type: RESET_ALL_FARMERS
  };
};