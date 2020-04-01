import {
    DELETE__GROWER_CHOOSEN_VEG,
    GET_GROWER_CHOOSEN_VEG,
    ADD__GROWER_CHOOSEN_VEG
  } from '../actions/types';
  
  const initialState = {
    VegToBuy: []
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_GROWER_CHOOSEN_VEG:
        return {
          ...state
        };
      case DELETE__GROWER_CHOOSEN_VEG:
        var ItemIndex = state.VegToBuy.findIndex(choosenvegetable => choosenvegetable.name === action.payload)
        return {
          ...state,
          VegToBuy: [...state.VegToBuy.slice(0, ItemIndex), ...state.VegToBuy.slice(ItemIndex+1)]
        };
      case ADD__GROWER_CHOOSEN_VEG:
        return {
          ...state,
          VegToBuy: [action.payload, ...state.VegToBuy]
        };
      default:
        return state;
    }
  }