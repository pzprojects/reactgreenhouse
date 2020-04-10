import {
    UPDATE_FARMER_ACTIVE_FARMS,  UPDATE_USER_ACTIVE_FARMS
  } from '../actions/types';
  
  const initialState = {
    FarmerNumOfActiveFarms: {},
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case UPDATE_FARMER_ACTIVE_FARMS:
        return {
          ...state,
          FarmerNumOfActiveFarms: action.payload
        };
      case UPDATE_USER_ACTIVE_FARMS:
        return {
          ...state,
          FarmerNumOfActiveFarms: action.payload
        };
      default:
        return state;
    }
  }