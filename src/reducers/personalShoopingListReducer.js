import {
    GET_PERSONAL_SHOOPING_ITEM,
    ADD_PERSONAL_SHOOPING_ITEM,
    DELETE_PERSONAL_SHOOPING_ITEM,
    PERSONAL_SHOOPING_ITEM_LOADING,
    PERSONAL_SHOOPING_ITEM_DONE,
    RESET_PERSONAL_SHOOPING_ITEMS
  } from '../actions/types';
  
  const initialState = {
    transactions: [],
    transactionLoading: false,
    transactionDone: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_PERSONAL_SHOOPING_ITEM:
        return {
          ...state,
          transactions: action.payload,
          transactionLoading: false
        };
      case DELETE_PERSONAL_SHOOPING_ITEM:
        return {
          ...state,
          transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
        };
      case ADD_PERSONAL_SHOOPING_ITEM:
        return {
          ...state,
          transactions: [action.payload, ...state.transactions]
        };
      case PERSONAL_SHOOPING_ITEM_LOADING:
        return {
          ...state,
          transactionLoading: true
        };
      case PERSONAL_SHOOPING_ITEM_DONE:
        return {
          ...state,
          transactionDone: true
        };
      case RESET_PERSONAL_SHOOPING_ITEMS:
        return {
          ...state,
          transactions: [],
          transactionLoading: false,
          transactionDone: false
        };
      default:
        return state;
    }
  }