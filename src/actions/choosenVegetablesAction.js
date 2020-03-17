import axios from 'axios';
import { GET_CHOOSEN_VEGETABLES,  ADD_CHOOSEN_VEGETABLES, DELETE_CHOOSEN_VEGETABLES} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getChoosenVegetables = () => {
    return{
        type: GET_CHOOSEN_VEGETABLES
    };
};
  
export const addChoosenVegetable = (data) => {
    return{
        type: ADD_CHOOSEN_VEGETABLES,
        payload: data
    };
};
  
export const deleteChoosenVegetable = id => {
    return{
        type: DELETE_CHOOSEN_VEGETABLES,
        payload: id
    };
};