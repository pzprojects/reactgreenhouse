import { UPDATE_CHOOSEN_FARMER, GET_CHOOSEN_FARMER } from './types'

export const updatechoosenfarmer = (FarmerObject) => {
  return {
    type: UPDATE_CHOOSEN_FARMER,
    payload: FarmerObject
  };
};

export const getchoosenfarmer = () => {
  return {
    type: GET_CHOOSEN_FARMER
  };
};