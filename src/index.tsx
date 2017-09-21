import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from "./components/app";
import 'jquery/dist/jquery';
import 'foundation-sites/dist/css/foundation.css';
import 'foundation-sites/dist/css/foundation-float.css';
import 'foundation-sites/dist/css/foundation-prototype.css';
import 'foundation-sites/dist/css/foundation-rtl.css';
import 'foundation-sites/dist/js/foundation.min';
import './css/index.css';
import './assets/favicon.ico';

ReactDOM.render(
	<App/>,
	document.getElementById('app')
);
