import {
    UPDATE_CHOOSEN_FARMER,
    GET_CHOOSEN_FARMER,
    RESET_CHOOSEN_FARMER
  } from '../actions/types';
  
  const initialState = {
    ChoosenFarmerById: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_CHOOSEN_FARMER:
        return {
          ...state
        };
      case UPDATE_CHOOSEN_FARMER:
        return {
          ...state,
          ChoosenFarmerById: action.payload
        };
      case RESET_CHOOSEN_FARMER:
        return {
          ...state,
          ChoosenFarmerById: {}
        };
      default:
        return state;
    }
  }