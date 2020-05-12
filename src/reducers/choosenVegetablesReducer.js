import {
    GET_CHOOSEN_VEGETABLES,
    ADD_CHOOSEN_VEGETABLES,
    DELETE_CHOOSEN_VEGETABLES,
    RESET_CHOOSEN_VEGETABLES
  } from '../actions/types';
  
  const initialState = {
    ChoosenVegetables: []
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_CHOOSEN_VEGETABLES:
        return {
          ...state
        };
      case DELETE_CHOOSEN_VEGETABLES:
        return {
          ...state,
          ChoosenVegetables: state.ChoosenVegetables.filter(choosenvegetable => choosenvegetable.name !== action.payload)
        };
      case ADD_CHOOSEN_VEGETABLES:
        return {
          ...state,
          ChoosenVegetables: [action.payload, ...state.ChoosenVegetables]
        };
      case RESET_CHOOSEN_VEGETABLES:
        return {
          ...state,
          ChoosenVegetables: []
        };
      default:
        return state;
    }
  }