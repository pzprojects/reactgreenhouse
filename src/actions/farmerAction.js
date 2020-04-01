import axios from 'axios';
import { GET_FARMERS, ADD_fARMER, DELETE_FARMER, FARMERS_LOADING, GET_FARMERS_BYAREA } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getfarmers = () => dispatch => {
  dispatch(setFarmersLoading());
  axios
    .get('/api/farmers')
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

export const getfarmersbyarea = (area,plan) => dispatch => {
  dispatch(setFarmersLoading());
  axios
    .get('/api/farmers/' + encodeURI(area) + "/" + encodeURI(plan))
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
    .post('/api/farmers', farmer, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_fARMER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteFarmer = email => (dispatch, getState) => {
  axios
    .delete(`/api/farmers/${email}`, tokenConfig(getState))
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