import axios from 'axios';
import { UPDATE_FARMER_ACTIVE_FARMS,  UPDATE_USER_ACTIVE_FARMS} from './types';
import { returnErrors } from './errorActions';

export const updatefarmeractivefarms = (email,farmer) => (dispatch, getState) => {
    axios
      .post('/api/updatefarmeractivefarms/' + email, farmer)
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
    axios
      .post('/api/updateruseractivefarms/' + email, user)
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