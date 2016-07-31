import { combineReducers } from 'redux';
import code from 'reducers/code_reducer';
import theme from 'reducers/theme_reducer';
import formatedResult from 'reducers/formated_result_reducer';

const rootReducer = combineReducers({
  code,
  theme,
  formatedResult
});

export default rootReducer;
