import {
    GET_CHOOSEN_LANGUAGE,
    UPDATE_CHOOSEN_LANGUAGE,
    RESET_CHOOSEN_LANGUAGE
} from '../actions/types';
import { Hebrew, English } from '../config/languages';

const initialState = {
    Language: {},
    LanguageName: '',
    LanguageCode: '',
    direction: '',
    LanguageActive: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CHOOSEN_LANGUAGE:
            return {
                ...state
            };
        case RESET_CHOOSEN_LANGUAGE:
            return {
                ...state,
                Language: {},
                LanguageName: '',
                LanguageCode: '',
                direction: '',
                LanguageActive: false
            };
        case UPDATE_CHOOSEN_LANGUAGE:
            var LanguageData;
            switch (action.payload.Code) {
                case "he":
                    LanguageData = Hebrew;
                    break;
                case "en":
                    LanguageData = English;
                    break;
                default:
                    LanguageData = Hebrew;
                    break;
            };
            return {
                ...state,
                Language: LanguageData,
                LanguageName: action.payload.LangName,
                LanguageCode: action.payload.Code,
                direction: action.payload.dir,
                LanguageActive: true
            };
        default:
            return state;
    }
}