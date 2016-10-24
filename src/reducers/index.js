import { combineReducers } from 'redux';
import code from 'reducers/code_reducer';
import theme from 'reducers/theme_reducer';
import formatedResult from 'reducers/formated_result_reducer';
import cursorPosition from 'reducers/cursor_position_reducer';
import isSidebarOpen from 'reducers/sidebar_reducer';
import currentSnippet from 'reducers/snippet_reducer';
import snippets from 'reducers/snippets_reducer';

const rootReducer = combineReducers({
  currentSnippet,
  theme,
  cursorPosition,
  formatedResult,
  isSidebarOpen,
  currentSnippet,
  snippets,
});

export default rootReducer;
