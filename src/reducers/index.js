
import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import vegetableReducer from './vegetableReducer';
import choosenVegetablesReducer from './choosenVegetablesReducer';
import farmerReducer from './farmerReducer';
import choosenFarmerReducer from './choosenFarmerReducer';
import growerVegChoiceReducer from './growerVegChoiceReducer';
import growerReducer from './growerReducer';
import updateUserReducer from './updateUserReducer';
import updateFarmerActiveFarmsReducers from './updateFarmerActiveFarmsReducers';
import systemReducer from './systemReducer';
import resetUserNameReducer from './resetUserNameReducer';
import fieldcropReducer from './fieldcropReducer';
import choosenFieldCropsReducer from './choosenFieldCropsReducer';
import growerFieldCropsChoiceReducer from './growerFieldCropsChoiceReducer';
import veglogReducer from './veglogReducer';
import growerShoppingListReducer from './growerShoppingListReducer';
import personalShoopingListReducer from './personalShoopingListReducer';

export default combineReducers({
  item: itemReducer,
  error: errorReducer,
  auth: authReducer,
  vegetable: vegetableReducer,
  choosenvegetable: choosenVegetablesReducer,
  farmer: farmerReducer,
  choosenfarmer: choosenFarmerReducer,
  growervegbuyingbag: growerVegChoiceReducer,
  growerfieldcropsbuyingbag: growerFieldCropsChoiceReducer,
  grower: growerReducer,
  updateduser: updateUserReducer,
  FarmerActiveFarms: updateFarmerActiveFarmsReducers,
  system: systemReducer,
  resetusername: resetUserNameReducer,
  fieldcrop: fieldcropReducer,
  choosenfieldcrop: choosenFieldCropsReducer,
  veglog: veglogReducer,
  growershop: growerShoppingListReducer,
  personalshop: personalShoopingListReducer
});