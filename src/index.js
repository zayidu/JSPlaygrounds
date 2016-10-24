import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { local } from 'store2';

import 'style/style';
import 'mdi/css/materialdesignicons';

import App from './components/app';
import reducers from './reducers';
import Globals from './globals';
import saveInLocalStorage from './saveInLocalStorage';

const createStoreWithMiddleware = applyMiddleware()(createStore);

const initialState = {
  formatedResult: local.get('formatedResult') || false,
  snippets: local.get('snippets') || [],
  theme: local.get('theme') || 'default',
};

const store = createStoreWithMiddleware(reducers, initialState);

store.subscribe(saveInLocalStorage(store))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('app')
);
