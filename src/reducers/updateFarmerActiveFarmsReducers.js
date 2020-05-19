import {
    UPDATE_FARMER_ACTIVE_FARMS,  UPDATE_USER_ACTIVE_FARMS, ACTIVE_FARMS_FARMERS_LOADING, ACTIVE_FARMS_USERS_LOADING, RESET_ACTIVE_FARMS_USERS
  } from '../actions/types';
  
  const initialState = {
    FarmerNumOfActiveFarms: {},
    FarmersNumLoaded: false,
    UsersNumLoaded: false
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
      case ACTIVE_FARMS_USERS_LOADING:
        return {
          ...state,
          UsersNumLoaded: true
        };
      case ACTIVE_FARMS_FARMERS_LOADING:
        return {
          ...state,
          FarmersNumLoaded: true
        };
      case RESET_ACTIVE_FARMS_USERS:
        return {
          ...state,
          FarmerNumOfActiveFarms: {},
          FarmersNumLoaded: false,
          UsersNumLoaded: false
        };
      default:
        return state;
    }
  }