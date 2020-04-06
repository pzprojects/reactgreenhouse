import {
    DELETE__GROWER_CHOOSEN_VEG,
    GET_GROWER_CHOOSEN_VEG,
    ADD__GROWER_CHOOSEN_VEG,
    RESET__GROWER_CHOOSEN_VEG,
    SET_TOTAL_GROWER_CHOOSEN_VEG,
    SET_PLAN_GROWER_CHOOSEN_VEG
  } from '../actions/types';
  
  const initialState = {
    VegToBuy: [],
    Total: '',
    Plan: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_GROWER_CHOOSEN_VEG:
        return {
          ...state
        };
      case RESET__GROWER_CHOOSEN_VEG:
        return {
          ...state,
          VegToBuy: [],
          Total: '',
          Plan: {}
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
      case SET_TOTAL_GROWER_CHOOSEN_VEG:
        return {
          ...state,
          Total: action.payload
        };
      case SET_PLAN_GROWER_CHOOSEN_VEG:
        return {
          ...state,
          Plan: action.payload
        };
      default:
        return state;
    }
  }