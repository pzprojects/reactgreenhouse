import axios from 'axios';
import { UPDATE_GROWER_PROFILE, UPDATE_GROWER_BY_EMAIL, DEACTIVATE_GROWER, DEACTIVATE_USER, UPDATE_FARMER_PROFILE, 
  UPDATE_FARMER_BY_EMAIL, SET_GROWER_DEACTIVATION_SUCCESS, SET_USER_DEACTIVATION_SUCCESS, RESET_UPDATE_USER } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const updategrowerprofile = (id,user) => (dispatch, getState) => {
  axios
    .post(API_URL + '/api/updategroweruser/' + id, user, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_GROWER_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_FAIL'))
    );
};

export const deactivateuserplan = (id,user) => (dispatch, getState) => {
    dispatch(userDeactivationSuccess());
    axios
      .post(API_URL + '/api/deactivateuser/' + id, user, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: DEACTIVATE_USER,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};

export const updategrowerbyemail = (email,grower) => (dispatch, getState) => {
    axios
      .post(API_URL + '/api/updategrower/' + email, grower, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_GROWER_BY_EMAIL,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_FAIL'))
      );
};

export const deactivategrowerplan = (email,grower) => (dispatch, getState) => {
    dispatch(growerDeactivationSuccess());
    axios
      .post(API_URL + '/api/deactivategrower/' + email, grower, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: DEACTIVATE_GROWER,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};

export const updatefarmerprofile = (id,user) => (dispatch, getState) => {
    axios
      .post(API_URL + '/api/updatefarmeruser/' + id, user, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_FARMER_PROFILE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_FAIL'))
      );
};

export const updatefarmerbyemail = (email,farmer) => (dispatch, getState) => {
  axios
    .post(API_URL + '/api/updatefarmer/' + email, farmer, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_FARMER_BY_EMAIL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_FAIL'))
    );
};

export const growerDeactivationSuccess = () => {
  return {
    type: SET_GROWER_DEACTIVATION_SUCCESS
  };
};

export const userDeactivationSuccess = () => {
  return {
    type: SET_USER_DEACTIVATION_SUCCESS
  };
};

export const resetUpdateUser = () => {
  return {
    type: RESET_UPDATE_USER
  };
};