import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { local } from 'store2';

import 'style/style';
import App from './components/app';
import reducers from './reducers';
import Globals from './globals';

const createStoreWithMiddleware = applyMiddleware()(createStore);

const initialState = {
  code: local.get('code'),
  theme: local.get('theme') || 'default'
}

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers, initialState)}>
    <App />
  </Provider>
  , document.getElementById('app')
);
