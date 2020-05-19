import { GET_CHOOSEN_LANGUAGE, UPDATE_CHOOSEN_LANGUAGE, RESET_CHOOSEN_LANGUAGE } from './types'

export const getLanguage = () => {
  return {
    type: GET_CHOOSEN_LANGUAGE
  };
};

export const ResetLanguage = () => {
  return{
      type: RESET_CHOOSEN_LANGUAGE
  };
};

export const updateLanguage = language => {
  return{
      type: UPDATE_CHOOSEN_LANGUAGE,
      payload: language
  };
};