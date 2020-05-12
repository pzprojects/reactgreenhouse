import { GET_CHOOSEN_VEGETABLES,  ADD_CHOOSEN_VEGETABLES, DELETE_CHOOSEN_VEGETABLES, RESET_CHOOSEN_VEGETABLES} from './types';

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
  
export const deleteChoosenVegetable = name => {
    return{
        type: DELETE_CHOOSEN_VEGETABLES,
        payload: name
    };
};

export const resetChoosenVegetables = () => {
    return{
        type: RESET_CHOOSEN_VEGETABLES
    };
};