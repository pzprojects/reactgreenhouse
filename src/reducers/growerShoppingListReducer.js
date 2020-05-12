import {
    GET_ITEMS_TO_SHOOPING_LIST,
    DELETE_ITEMS_FROM_SHOOPING_LIST,
    ADD_ITEMS_TO_SHOOPING_LIST,
    RESET_SHOOPING_LIST,
    UPDATE_ITEMS_TO_SHOOPING_LIST
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
        var ItemIndex = state.GrowerShoopingList.findIndex(choosenvegetable => choosenvegetable.ChoosenVegName === action.payload);
        return {
          ...state,
          GrowerShoopingList: [...state.GrowerShoopingList.slice(0, ItemIndex), ...state.GrowerShoopingList.slice(ItemIndex+1)]
        };
      case ADD_ITEMS_TO_SHOOPING_LIST:
        return {
          ...state,
          GrowerShoopingList: [...state.GrowerShoopingList, action.payload]
        };
      case UPDATE_ITEMS_TO_SHOOPING_LIST:
        var NewGrowerShoopingList = [...state.GrowerShoopingList];
        var ItemIndex2 = state.GrowerShoopingList.findIndex(choosenvegetable => choosenvegetable.ChoosenVegName === action.nametofind);
        NewGrowerShoopingList[ItemIndex2].ChoosenVegAmount = (parseFloat(action.payload) + parseFloat(NewGrowerShoopingList[ItemIndex2].ChoosenVegAmount)).toString();
        return {
          ...state,
          GrowerShoopingList: NewGrowerShoopingList
        };
      default:
        return state;
    }
  }