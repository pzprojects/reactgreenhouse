import {
    GET_CHOOSEN_FIELDCROPS,
    ADD_CHOOSEN_FIELDCROPS,
    DELETE_CHOOSEN_FIELDCROPS,
    RESET_CHOOSEN_FIELDCROPS
  } from '../actions/types';
  
  const initialState = {
    ChoosenFieldCrops: []
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_CHOOSEN_FIELDCROPS:
        return {
          ...state
        };
      case DELETE_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          ChoosenFieldCrops: state.ChoosenFieldCrops.filter(ChoosenFieldCrop => ChoosenFieldCrop.name !== action.payload)
        };
      case ADD_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          ChoosenFieldCrops: [action.payload, ...state.ChoosenFieldCrops]
        };
      case RESET_CHOOSEN_FIELDCROPS:
        return {
          ...state,
          ChoosenFieldCrops: []
        };
      default:
        return state;
    }
  }