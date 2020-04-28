import axios from 'axios';
import { RESET_GROWER_USERNAME, RESET_USERNAME, CLEAR_RESET_USERNAME} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const resetgrowerusername = (email,grower) => (dispatch, getState) => {
    axios
      .post(API_URL + '/api/ResetGrowerUserName/' + email, grower, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: RESET_GROWER_USERNAME,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};

export const resetusername = (email,user) => (dispatch, getState) => {
    axios
      .post(API_URL + '/api/ResetUserName/' + email, user, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: RESET_USERNAME,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};

// CLEAR ERRORS
export const clearresetgrowerusername = () => {
    return {
      type: CLEAR_RESET_USERNAME
    };
};