import { UPDATE_CURSOR_POSITION } from 'actions/types';

const INITIAL_STATE = {line:0, ch:0 };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_CURSOR_POSITION:
      return action.payload
    default:
      return state;
  }
}
