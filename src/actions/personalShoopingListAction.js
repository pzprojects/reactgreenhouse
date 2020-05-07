import axios from 'axios';
import { GET_PERSONAL_SHOOPING_ITEM, ADD_PERSONAL_SHOOPING_ITEM, DELETE_PERSONAL_SHOOPING_ITEM, PERSONAL_SHOOPING_ITEM_LOADING, PERSONAL_SHOOPING_ITEM_DONE } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { API_URL } from '../config/keys';

export const getpersonalShoopingItems = () => dispatch => {
    dispatch(personalShoopingItemsLoading());
    axios
        .get(API_URL + '/api/myshopitems')
        .then(res =>
            dispatch({
                type: GET_PERSONAL_SHOOPING_ITEM,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const addpersonalShoopingItems = item => (dispatch, getState) => {
    dispatch(additemdone());
    axios
        .post(API_URL + '/api/myshopitems', item, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: ADD_PERSONAL_SHOOPING_ITEM,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const deletepersonalShoopingItems = id => (dispatch, getState) => {
    axios
        .delete(API_URL + `/api/myshopitems/${id}`, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: DELETE_PERSONAL_SHOOPING_ITEM,
                payload: id
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const personalShoopingItemsLoading = () => {
    return {
        type: PERSONAL_SHOOPING_ITEM_LOADING
    };
};

export const additemdone = () => {
    return {
        type: PERSONAL_SHOOPING_ITEM_DONE
    };
};

