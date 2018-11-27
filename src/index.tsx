import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { Provider } from 'react-redux';

import { App } from './components/app';
import { reducers } from './redux/reducers';

import 'whatwg-fetch';
import 'antd/lib/alert/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/col/style/css';
import 'antd/lib/dropdown/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/layout/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/spin/style/css';

import './css/index.css';

const store: any = createStore(reducers, devToolsEnhancer({}));

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
