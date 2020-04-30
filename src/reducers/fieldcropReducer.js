import {
GET_FIELDCROPS,
ADD_FIELDCROPS,
DELETE_FIELDCROPS,
FIELDCROPS_LOADING,
UPDATE_FIELDCROPS
} from '../actions/types';
  
  const initialState = {
    fieldcrops: [],
    fieldcropsLoading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_FIELDCROPS:
        return {
          ...state,
          fieldcrops: action.payload,
          loading: false
        };
      case DELETE_FIELDCROPS:
        return {
          ...state,
          fieldcrops: state.fieldcrops.filter(fieldcrop => fieldcrop._id !== action.payload)
        };
      case ADD_FIELDCROPS:
        return {
          ...state,
          fieldcrops: [action.payload, ...state.fieldcrops]
        };
      case UPDATE_FIELDCROPS:
        return {
          ...state,
          fieldcrops: [action.payload, ...state.fieldcrops.filter(fieldcrop => fieldcrop._id !== action.payload._id)]
        };
      case FIELDCROPS_LOADING:
        return {
          ...state,
          fieldcropsLoading: true
        };
      default:
        return state;
    }
  }