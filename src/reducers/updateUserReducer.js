import {
    UPDATE_GROWER_PROFILE, UPDATE_GROWER_BY_EMAIL, DEACTIVATE_GROWER, DEACTIVATE_USER, UPDATE_FARMER_PROFILE, UPDATE_FARMER_BY_EMAIL
  } from '../actions/types';
  
  const initialState = {
    user: {},
    loading: false
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
      default:
        return state;
    }
  }