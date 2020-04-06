import {
    GET_GROWERS,
    ADD_GROWER,
    DELETE_GROWER,
    GROWERS_LOADING
  } from '../actions/types';
  
  const initialState = {
    growers: [],
    GrowersLoading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_GROWERS:
        return {
          ...state,
          growers: action.payload,
          FarmersLoading: false
        };
      case DELETE_GROWER:
        return {
          ...state,
          growers: state.growers.filter(grower => grower.email !== action.payload)
        };
      case ADD_GROWER:
        return {
          ...state,
          growers: [action.payload, ...state.growers]
        };
      case GROWERS_LOADING:
        return {
          ...state,
          GrowersLoading: true
        };
      default:
        return state;
    }
  }