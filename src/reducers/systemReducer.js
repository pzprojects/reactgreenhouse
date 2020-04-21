import {
    GET_SYSTEMDATA,
    UPDATE_SYSTEMDATA,
    SYSTEM_LOADING
  } from '../actions/types';
  
  const initialState = {
    SystemData: null,
    SystemLoading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_SYSTEMDATA:
        return {
          ...state,
          SystemData: action.payload,
          SystemLoading: false
        };
      case UPDATE_SYSTEMDATA:
        return {
          ...state,
          SystemData: action.payload
        };
      case SYSTEM_LOADING:
        return {
          ...state,
          SystemLoading: true
        };
      default:
        return state;
    }
  }