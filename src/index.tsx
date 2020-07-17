import 'antd/es/alert/style/css';
import 'antd/es/back-top/style/css';
import 'antd/es/button/style/css';
import 'antd/es/card/style/css';
import 'antd/es/col/style/css';
import 'antd/es/date-picker/style/css';
import 'antd/es/icon/style/css';
import 'antd/es/input/style/css';
import 'antd/es/layout/style/css';
import 'antd/es/menu/style/css';
import 'antd/es/popover/style/css';
import 'antd/es/row/style/css';
import 'antd/es/select/style/css';
import 'antd/es/spin/style/css';
import 'antd/es/table/style/css';
import firebase from 'firebase/app';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApiKey } from './constants/api-key';
import './css/index.css';
import { App } from './views/app';

// Initialise Firebase
firebase.initializeApp({
  apiKey: ApiKey.firebase,
  authDomain: 'reactjs-weather.firebaseapp.com',
  databaseURL: 'https://reactjs-weather.firebaseio.com',
  projectId: 'reactjs-weather',
  storageBucket: 'reactjs-weather.appspot.com',
  messagingSenderId: '120664202212',
  appId: '1:120664202212:web:b733e66714cd0fde',
});

ReactDOM.render(<App />, document.getElementById('app'));
