
import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import vegetableReducer from './vegetableReducer';
import choosenVegetablesReducer from './choosenVegetablesReducer';
import farmerReducer from './farmerReducer';

export default combineReducers({
  item: itemReducer,
  error: errorReducer,
  auth: authReducer,
  vegetable: vegetableReducer,
  choosenvegetable: choosenVegetablesReducer,
  farmer: farmerReducer
});