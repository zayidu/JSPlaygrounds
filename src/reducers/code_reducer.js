import {
  DID_UPDATE_CODE,
  SAVE,
  FORK,
  RESET,
} from 'actions/types';
import parseExpressions from 'libs/parseExpressions';
import { local } from 'store2';

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  const getCode = getCodeStateFromCode(state);
  switch (action.type) {
  case SAVE:
  case FORK:
  case RESET:
    return getCode('');
  case DID_UPDATE_CODE:
    return getCode(action.payload);
  default:
    return state;
  }
}

const getCodeStateFromCode = state => code => {
  const latest = code;
  let { stable } = state;
  try {
    parseExpressions(latest);
    stable = code;
  } catch (e) {};

  local.set('code', {
    latest,
    stable
  });

  return {
    latest,
    stable
  };
}
