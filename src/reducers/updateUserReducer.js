import {
    UPDATE_GROWER_PROFILE, UPDATE_GROWER_BY_EMAIL, DEACTIVATE_GROWER, DEACTIVATE_USER, UPDATE_FARMER_PROFILE, 
    UPDATE_FARMER_BY_EMAIL, SET_GROWER_DEACTIVATION_SUCCESS, SET_USER_DEACTIVATION_SUCCESS, RESET_UPDATE_USER
  } from '../actions/types';
  
  const initialState = {
    user: {},
    growerdeactivate: false,
    userdeactivate: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case UPDATE_GROWER_PROFILE:
        return {
          ...state,
          user: action.payload
        };
      case UPDATE_GROWER_BY_EMAIL:
        return {
          ...state,
          user: action.payload
        };
      case DEACTIVATE_GROWER:
        return {
          ...state,
          user: action.payload
        };
      case DEACTIVATE_USER:
        return {
          ...state,
          user: action.payload
        };
      case UPDATE_FARMER_PROFILE:
        return {
          ...state,
          user: action.payload
        };
      case UPDATE_FARMER_BY_EMAIL:
        return {
          ...state,
          user: action.payload
        };
      case SET_GROWER_DEACTIVATION_SUCCESS:
        return {
          ...state,
          growerdeactivate: true
        };
      case SET_USER_DEACTIVATION_SUCCESS:
        return {
          ...state,
          userdeactivate: true
        };
      case RESET_UPDATE_USER:
        return {
          ...state,
          user: {},
          growerdeactivate: false,
          userdeactivate: false
        };
      default:
        return state;
    }
  }