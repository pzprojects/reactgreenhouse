import {
    GET_FARMERS,
    ADD_fARMER, 
    DELETE_FARMER,
    FARMERS_LOADING,
    GET_FARMERS_BYAREA,
    GET_FARMER_BY_EMAIL,
    RESET_ALL_FARMERS
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
      case GET_FARMER_BY_EMAIL:
        return {
          ...state,
          farmers: action.payload.filter(farmer => farmer.email === action.email),
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
      case RESET_ALL_FARMERS:
        return {
          ...state,
          farmers: [],
          FarmersLoading: false
        };
      default:
        return state;
    }
  }