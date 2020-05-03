import { GET_CHOOSEN_FIELDCROPS,  ADD_CHOOSEN_FIELDCROPS, DELETE_CHOOSEN_FIELDCROPS } from './types';

export const getChoosenfieldCrops = () => {
    return{
        type: GET_CHOOSEN_FIELDCROPS
    };
};
  
export const addChoosenfieldCrop = (data) => {
    return{
        type: ADD_CHOOSEN_FIELDCROPS,
        payload: data
    };
};
  
export const deleteChoosenfieldCrop = name => {
    return{
        type: DELETE_CHOOSEN_FIELDCROPS,
        payload: name
    };
};