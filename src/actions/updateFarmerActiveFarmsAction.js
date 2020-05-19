import axios from 'axios';
import { UPDATE_FARMER_ACTIVE_FARMS,  UPDATE_USER_ACTIVE_FARMS, ACTIVE_FARMS_FARMERS_LOADING, ACTIVE_FARMS_USERS_LOADING, RESET_ACTIVE_FARMS_USERS} from './types';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const updatefarmeractivefarms = (email,farmer) => (dispatch, getState) => {
    dispatch(setupdateuseractivefarmersLoading());
    axios
      .post(API_URL + '/api/updatefarmeractivefarms/' + email, farmer)
      .then(res =>
        dispatch({
          type: UPDATE_FARMER_ACTIVE_FARMS,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

  export const updateuseractivefarms = (email,user) => (dispatch, getState) => {
    dispatch(setupdateuseractiveusersLoading());
    axios
      .post(API_URL + '/api/updateruseractivefarms/' + email, user)
      .then(res =>
        dispatch({
          type: UPDATE_USER_ACTIVE_FARMS,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

  export const setupdateuseractivefarmersLoading = () => {
    return {
      type: ACTIVE_FARMS_FARMERS_LOADING
    };
  };

  export const setupdateuseractiveusersLoading = () => {
    return {
      type: ACTIVE_FARMS_USERS_LOADING
    };
  };

  export const resetactivefarms = () => {
    return {
      type: RESET_ACTIVE_FARMS_USERS
    };
  };