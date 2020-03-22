import {
    GET_VEGTABLES,
    ADD_VEGTABLES,
    DELETE_VEGTABLES,
    VEGTABLES_LOADING
  } from '../actions/types';
  
  const initialState = {
    vegetables: [],
    VegetablesLoading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_VEGTABLES:
        return {
          ...state,
          vegetables: action.payload,
          loading: false
        };
      case DELETE_VEGTABLES:
        return {
          ...state,
          vegetables: state.vegetables.filter(vegetable => vegetable._id !== action.payload)
        };
      case ADD_VEGTABLES:
        return {
          ...state,
          vegetables: [action.payload, ...state.vegetables]
        };
      case VEGTABLES_LOADING:
        return {
          ...state,
          VegetablesLoading: true
        };
      default:
        return state;
    }
  }