import { SET_FORMATED_RESULT } from 'actions/types';

const INITIAL_STATE = false;

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_FORMATED_RESULT:
      return action.payload;
    default:
      return state;
  }
}
