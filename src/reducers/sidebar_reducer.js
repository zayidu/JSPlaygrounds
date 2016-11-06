import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from 'actions/types';

const INITIAL_STATE = false;

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return true;
    case CLOSE_SIDEBAR:
      return false;
    default:
      return state;
  }
}
