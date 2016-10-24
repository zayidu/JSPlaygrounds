import {
  DID_UPDATE_CODE,
  CHANGE_THEME,
  SET_FORMATED_RESULT,
  UPDATE_CURSOR_POSITION,
  LOAD_SNIPPET,
  SAVE_SNIPPET,
  DELETE_SNIPPET,
  FORK_SNIPPET,
  RESET,
  OPEN_SIDEBAR,
  CLOSE_SIDEBAR,
} from 'actions/types';

export function updateCode(code) {
  //console.clear();

  return {
    type: DID_UPDATE_CODE,
    payload: code
  };
}

export const changeTheme = (theme) => {
  return {
    type: CHANGE_THEME,
    payload: theme
  };
};

export const setFormatedResult = (formatedResult) => {
  return {
    type: SET_FORMATED_RESULT,
    payload: formatedResult
  };
};

export const updateCursorPosition = cursorPosition => ({
  type: UPDATE_CURSOR_POSITION,
  payload: cursorPosition
});

export const loadSnippet = snippet => ({
  type: LOAD_SNIPPET,
  payload: snippet,
});

export const saveSnippet = snippet => ({
  type: SAVE_SNIPPET,
  payload: snippet,
});

export const deleteSnippet = id => ({
  type: DELETE_SNIPPET,
  payload: id,
});

export const reset = () => ({
  type: RESET,
});

export const openSidebar = () => ({
  type: OPEN_SIDEBAR,
});

export const closeSidebar = () => ({
  type: CLOSE_SIDEBAR,
});

