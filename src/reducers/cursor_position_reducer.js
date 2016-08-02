import { UPDATE_CURSOR_POSITION } from 'actions/types';

const INITIAL_STATE = {line:0, ch:0 };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_CURSOR_POSITION:
      return {
        line: action.payload.line || state.line,
        ch: action.payload.ch || state.ch,
        force: action.payload.force
      }
    default:
      return state;
  }
}
