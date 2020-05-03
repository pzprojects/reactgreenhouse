import { DELETE__GROWER_CHOOSEN_FIELDCROPS, GET_GROWER_CHOOSEN_FIELDCROPS, ADD__GROWER_CHOOSEN_FIELDCROPS, RESET__GROWER_CHOOSEN_FIELDCROPS, SET_TOTAL_GROWER_CHOOSEN_FIELDCROPS, SET_PLAN_GROWER_CHOOSEN_FIELDCROPS, SET_ISVALIDATED_GROWER_CHOOSEN_FIELDCROPS} from './types'

export const getGrowerFieldCropBag = () => {
  return {
    type: GET_GROWER_CHOOSEN_FIELDCROPS
  };
};

export const addToGrowerFieldCropBag = (data) => {
  return{
      type: ADD__GROWER_CHOOSEN_FIELDCROPS,
      payload: data
  };
};

export const deleteFromGrowerFieldCropBag = name => {
  return{
      type: DELETE__GROWER_CHOOSEN_FIELDCROPS,
      payload: name
  };
};

export const ResetGrowerFieldCropBag = () => {
  return{
      type: RESET__GROWER_CHOOSEN_FIELDCROPS
  };
};

export const SetTotalGrowerFieldCropBag = total => {
  return{
      type: SET_TOTAL_GROWER_CHOOSEN_FIELDCROPS,
      payload: total
  };
};

export const SetPlanGrowerFieldCropBag = plan => {
  return{
      type: SET_PLAN_GROWER_CHOOSEN_FIELDCROPS,
      payload: plan
  };
};

export const SetIsValidatedFieldCropBag = validate => {
  return {
    type: SET_ISVALIDATED_GROWER_CHOOSEN_FIELDCROPS,
    payload: validate
  };
};