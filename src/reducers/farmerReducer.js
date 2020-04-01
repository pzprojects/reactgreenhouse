import {
    GET_FARMERS,
    ADD_fARMER, 
    DELETE_FARMER,
    FARMERS_LOADING,
    GET_FARMERS_BYAREA
  } from '../actions/types';
  
  const initialState = {
    farmers: [],
    FarmersLoading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_FARMERS:
        return {
          ...state,
          farmers: action.payload,
          FarmersLoading: false
        };
      case GET_FARMERS_BYAREA:
        return {
          ...state,
          farmers: action.payload,
          FarmersLoading: false
        };
      case DELETE_FARMER:
        return {
          ...state,
          farmers: state.farmers.filter(farmer => farmer.email !== action.payload)
        };
      case ADD_fARMER:
        return {
          ...state,
          farmers: [action.payload, ...state.farmers]
        };
      case FARMERS_LOADING:
        return {
          ...state,
          FarmersLoading: true
        };
      default:
        return state;
    }
  }