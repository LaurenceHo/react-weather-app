import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { App } from "./components/app";
import { reducers } from './redux/reducers';
import { devToolsEnhancer } from 'redux-devtools-extension';

import 'jquery/dist/jquery';
import 'foundation-sites/dist/css/foundation.css';
import 'foundation-sites/dist/css/foundation-float.css';
import 'foundation-sites/dist/css/foundation-prototype.css';
import 'foundation-sites/dist/css/foundation-rtl.css';
import 'foundation-sites/dist/js/foundation.min';
import './css/index.css';
import './assets/favicon.ico';

const store: any = createStore(reducers, devToolsEnhancer({}));

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('app')
);
