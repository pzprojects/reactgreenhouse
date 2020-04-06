import {
    UPDATE_GROWER_PROFILE, UPDATE_GROWER_BY_EMAIL
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
      default:
        return state;
    }
  }