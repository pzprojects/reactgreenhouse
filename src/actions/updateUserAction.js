import axios from 'axios';
import { UPDATE_GROWER_PROFILE, UPDATE_GROWER_BY_EMAIL, DEACTIVATE_GROWER, DEACTIVATE_USER } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const updategrowerprofile = (id,user) => (dispatch, getState) => {
  axios
    .post('/api/updategroweruser/' + id, user, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_GROWER_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deactivateuserplan = (id,user) => (dispatch, getState) => {
    axios
      .post('/api/deactivateuser/' + id, user, tokenConfig(getState))
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
      .post('/api/updategrower/' + email, grower, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_GROWER_BY_EMAIL,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

export const deactivategrowerplan = (email,grower) => (dispatch, getState) => {
    axios
      .post('/api/deactivategrower/' + email, grower, tokenConfig(getState))
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