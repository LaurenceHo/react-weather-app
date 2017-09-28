import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { App } from "./components/app";
import { reducers } from './redux/reducers';
import { devToolsEnhancer } from 'redux-devtools-extension';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tabs/style/react-tabs.css';

import './css/index.css';
import './assets/favicon.ico';

const store: any = createStore(reducers, devToolsEnhancer({}));

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('app')
);
