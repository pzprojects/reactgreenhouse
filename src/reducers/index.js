
import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import vegetableReducer from './vegetableReducer';
import choosenVegetablesReducer from './choosenVegetablesReducer';
import farmerReducer from './farmerReducer';
import choosenFarmerReducer from './choosenFarmerReducer';
import growerVegChoiceReducer from './growerVegChoiceReducer';

export default combineReducers({
  item: itemReducer,
  error: errorReducer,
  auth: authReducer,
  vegetable: vegetableReducer,
  choosenvegetable: choosenVegetablesReducer,
  farmer: farmerReducer,
  choosenfarmer: choosenFarmerReducer,
  growervegbuyingbag: growerVegChoiceReducer
});