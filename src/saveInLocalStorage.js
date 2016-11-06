import { local } from 'store2';
import debounce from 'lodash/debounce'

const saveInLocalStorage = store => debounce(() => {
  const { theme, snippets, formatedResult } = store.getState();
  local.setAll({ theme, snippets, formatedResult });
}, 100);

export default saveInLocalStorage;
