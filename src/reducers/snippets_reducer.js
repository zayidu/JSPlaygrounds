import { SAVE_SNIPPET, DELETE_SNIPPET } from 'actions/types';

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAVE_SNIPPET:
      const index = state.findIndex(({ id }) => id === action.payload.id);
      if (index > -1) {
        return [
          ...state.slice(0, index),
          Object.assign({}, state[index], action.payload),
          ...state.slice(index + 1)
        ];
      }
      return [...state, action.payload];
    case DELETE_SNIPPET:
      return state.filter(({ id }) => id !== action.payload);
    default:
      return state;
  }
};
