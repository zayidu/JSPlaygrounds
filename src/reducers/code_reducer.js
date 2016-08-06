import { DID_UPDATE_CODE } from 'actions/types';
import parseExpressions from 'selectors/parse_expressions';
import { local } from 'store2';

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
  case DID_UPDATE_CODE:
    const code = getCodeStateFromCode(state, action.payload);
    local.set('code', code);
    return code;
  default:
    return state;
  }
}

const getCodeStateFromCode = (state, code) => {
  const latest = code;
  let { stable } = state;
  try {
    parseExpressions(latest);
    stable = code;
  } catch (e) {};

  return {
    latest,
    stable
  };
}
