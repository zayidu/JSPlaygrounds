import { local } from 'store2';

import {
  DID_UPDATE_CODE,
  CHANGE_THEME,
  SET_FORMATED_RESULT,
  UPDATE_CURSOR_POSITION
} from 'actions/types';

export function updateCode(code) {
  //console.clear();

  return {
    type: DID_UPDATE_CODE,
    payload: code
  };
}

export const changeTheme = (theme) => {
  local.set('theme', theme);
  return {
    type: CHANGE_THEME,
    payload: theme
  };
};

export const setFormatedResult = (formatedResult) => {
  local.set('formatedResult', formatedResult);
  return {
    type: SET_FORMATED_RESULT,
    payload: formatedResult
  };
};

export const updateCursorPosition = (cursorPosition) => {
  return {
    type: UPDATE_CURSOR_POSITION,
    payload: cursorPosition
  };
};

