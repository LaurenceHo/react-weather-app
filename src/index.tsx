import 'antd/lib/alert/style/css';
import 'antd/lib/back-top/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/card/style/css';
import 'antd/lib/col/style/css';
import 'antd/lib/date-picker/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/layout/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/popover/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/spin/style/css';
import 'antd/lib/table/style/css';
import * as firebase from 'firebase/app';
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

// Initialise Google charts
google.charts.load('current', {
  packages: ['geochart'],
  mapsApiKey: ApiKey.maps,
});

ReactDOM.render(<App />, document.getElementById('app'));
