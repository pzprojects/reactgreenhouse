import {
    GET_VEGLANGUAGES, ADD_VEGLANGUAGES, DELETE_VEGLANGUAGES, VEGLANGUAGES_LOADING, UPDATE_VEGLANGUAGES
  } from '../actions/types';
  
  const initialState = {
    vegetablelsanguages: [],
    vegetablelsanguagesLoading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_VEGLANGUAGES:
        return {
          ...state,
          vegetablelsanguages: action.payload,
          loading: false
        };
      case DELETE_VEGLANGUAGES:
        return {
          ...state,
          vegetablelsanguages: state.vegetablelsanguages.filter(vegetablelanguage => vegetablelanguage._id !== action.payload)
        };
      case ADD_VEGLANGUAGES:
        return {
          ...state,
          vegetablelsanguages: [action.payload, ...state.vegetablelsanguages]
        };
      case UPDATE_VEGLANGUAGES:
        return {
          ...state,
          vegetablelsanguages: [action.payload, ...state.vegetablelsanguages.filter(vegetablelanguage => vegetablelanguage._id !== action.payload._id)]
        };
      case VEGLANGUAGES_LOADING:
        return {
          ...state,
          vegetablelsanguagesLoading: true
        };
      default:
        return state;
    }
  }