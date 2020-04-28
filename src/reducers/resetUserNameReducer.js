import {
    RESET_GROWER_USERNAME, RESET_USERNAME, CLEAR_RESET_USERNAME
  } from '../actions/types';
  
  const initialState = {
    user: {},
    grower: {},
    userupdated: false,
    growerupdated: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case RESET_GROWER_USERNAME:
        return {
          ...state,
          grower: action.payload,
          growerupdated: true
        };
      case RESET_USERNAME:
        return {
          ...state,
          user: action.payload,
          userupdated: true
        };
    case CLEAR_RESET_USERNAME:
        return {
          user: {},
          grower: {},
          userupdated: false,
          growerupdated: false
        };
      default:
        return state;
    }
  }