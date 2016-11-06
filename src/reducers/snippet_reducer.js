import {
  DID_UPDATE_CODE,
  RESET,
  SET_FORMATED_RESULT,
  LOAD_SNIPPET,
} from 'actions/types';
import assign from 'lodash/fp/assign';

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  const setSnippet = assign(state);

  switch (action.type) {
    case LOAD_SNIPPET:
      return setSnippet(action.payload);
    case SET_FORMATED_RESULT:
      return setSnippet({ fromatedResult: action.payload });
    case RESET:
      return { fromatedResult: '', stable: '', latest: '' };
    case DID_UPDATE_CODE:
      return setSnippet(action.payload);
    default:
      return state;
  }
}
