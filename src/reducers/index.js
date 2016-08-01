import { combineReducers } from 'redux';
import code from 'reducers/code_reducer';
import theme from 'reducers/theme_reducer';
import formatedResult from 'reducers/formated_result_reducer';
import cursorPosition from 'reducers/cursor_position_reducer';

const rootReducer = combineReducers({
  code,
  theme,
  formatedResult,
  cursorPosition
});

export default rootReducer;
