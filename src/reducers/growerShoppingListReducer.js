import {
    GET_ITEMS_TO_SHOOPING_LIST,
    DELETE_ITEMS_FROM_SHOOPING_LIST,
    ADD_ITEMS_TO_SHOOPING_LIST,
    RESET_SHOOPING_LIST
  } from '../actions/types';
  
  const initialState = {
    GrowerShoopingList: []
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_ITEMS_TO_SHOOPING_LIST:
        return {
          ...state
        };
      case RESET_SHOOPING_LIST:
        return {
          ...state,
          GrowerShoopingList: []
        };
      case DELETE_ITEMS_FROM_SHOOPING_LIST:
        var ItemIndex = state.GrowerShoopingList.findIndex(choosenvegetable => choosenvegetable.name === action.payload)
        return {
          ...state,
          GrowerShoopingList: [...state.GrowerShoopingList.slice(0, ItemIndex), ...state.GrowerShoopingList.slice(ItemIndex+1)]
        };
      case ADD_ITEMS_TO_SHOOPING_LIST:
        return {
          ...state,
          GrowerShoopingList: [action.payload, ...state.GrowerShoopingList]
        };
      default:
        return state;
    }
  }