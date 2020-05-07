import { GET_ITEMS_TO_SHOOPING_LIST, DELETE_ITEMS_FROM_SHOOPING_LIST, ADD_ITEMS_TO_SHOOPING_LIST, RESET_SHOOPING_LIST, UPDATE_ITEMS_TO_SHOOPING_LIST } from './types'

export const getGrowerShoopinList = () => {
  return {
    type: GET_ITEMS_TO_SHOOPING_LIST
  };
};

export const addToGrowerShoopinList = (data) => {
  return{
      type: ADD_ITEMS_TO_SHOOPING_LIST,
      payload: data
  };
};

export const UpdateGrowerShoopinList = (name, datatoupdate) => {
    return{
        type: UPDATE_ITEMS_TO_SHOOPING_LIST,
        payload: datatoupdate,
        nametofind: name
    };
  };

export const deleteFromShoopinList = name => {
  return{
      type: DELETE_ITEMS_FROM_SHOOPING_LIST,
      payload: name
  };
};

export const ResetGrowerShoopinList = () => {
  return{
      type: RESET_SHOOPING_LIST
  };
};