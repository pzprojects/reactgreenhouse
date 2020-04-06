import axios from 'axios';
import { GET_GROWERS, ADD_GROWER, DELETE_GROWER, GROWERS_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getgrowers = () => dispatch => {
  dispatch(setgrowersLoading());
  axios
    .get('/api/growers')
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

export const addgrower = grower => (dispatch, getState) => {
  axios
    .post('/api/growers', grower, tokenConfig(getState))
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
    .delete(`/api/growers/${email}`, tokenConfig(getState))
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