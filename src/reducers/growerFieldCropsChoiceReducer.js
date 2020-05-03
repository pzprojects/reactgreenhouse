import {
    DELETE__GROWER_CHOOSEN_FIELDCROPS,
    GET_GROWER_CHOOSEN_FIELDCROPS,
    ADD__GROWER_CHOOSEN_FIELDCROPS,
    RESET__GROWER_CHOOSEN_FIELDCROPS,
    SET_TOTAL_GROWER_CHOOSEN_FIELDCROPS,
    SET_PLAN_GROWER_CHOOSEN_FIELDCROPS,
    SET_ISVALIDATED_GROWER_CHOOSEN_FIELDCROPS
  } from '../actions/types';
  
  const initialState = {
    FieldCropsToBuy: [],
    FieldCropsTotal: '',
    FieldCropsPlan: {},
    FieldCropsIsValidated: true
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_GROWER_CHOOSEN_FIELDCROPS:
        return {
          ...state
        };
      case RESET__GROWER_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          FieldCropsToBuy: [],
          FieldCropsTotal: '',
          FieldCropsPlan: {},
          FieldCropsIsValidated: true
        };
      case DELETE__GROWER_CHOOSEN_FIELDCROPS:
        var ItemIndex = state.FieldCropsToBuy.findIndex(choosenvegetable => choosenvegetable.name === action.payload)
        return {
          ...state,
          FieldCropsToBuy: [...state.FieldCropsToBuy.slice(0, ItemIndex), ...state.FieldCropsToBuy.slice(ItemIndex+1)]
        };
      case ADD__GROWER_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          FieldCropsToBuy: [action.payload, ...state.FieldCropsToBuy]
        };
      case SET_TOTAL_GROWER_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          FieldCropsTotal: action.payload
        };
      case SET_PLAN_GROWER_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          FieldCropsPlan: action.payload
        };
      case SET_ISVALIDATED_GROWER_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          FieldCropsIsValidated: action.payload
        };
      default:
        return state;
    }
  }