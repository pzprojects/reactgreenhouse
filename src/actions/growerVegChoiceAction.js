import { DELETE__GROWER_CHOOSEN_VEG, GET_GROWER_CHOOSEN_VEG, ADD__GROWER_CHOOSEN_VEG, RESET__GROWER_CHOOSEN_VEG, SET_TOTAL_GROWER_CHOOSEN_VEG, SET_PLAN_GROWER_CHOOSEN_VEG } from './types'

export const getGrowerVegBag = () => {
  return {
    type: GET_GROWER_CHOOSEN_VEG
  };
};

export const addToGrowerVegBag = (data) => {
  return{
      type: ADD__GROWER_CHOOSEN_VEG,
      payload: data
  };
};

export const deleteFromGrowerVegBag = name => {
  return{
      type: DELETE__GROWER_CHOOSEN_VEG,
      payload: name
  };
};

export const ResetGrowerVegBag = () => {
  return{
      type: RESET__GROWER_CHOOSEN_VEG
  };
};

export const SetTotalGrowerVegBag = total => {
  return{
      type: SET_TOTAL_GROWER_CHOOSEN_VEG,
      payload: total
  };
};

export const SetPlanGrowerVegBag = plan => {
  return{
      type: SET_PLAN_GROWER_CHOOSEN_VEG,
      payload: plan
  };
};
