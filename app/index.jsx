import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "./components/app";
import 'jquery/dist/jquery';
import 'foundation-sites/dist/css/foundation.css';
import 'foundation-sites/dist/css/foundation-float.css';
import 'foundation-sites/dist/css/foundation-prototype.css';
import 'foundation-sites/dist/css/foundation-rtl.css';
import 'foundation-sites/dist/js/foundation.min';
import './index.css';

ReactDOM.render (
	<App/>,
	document.getElementById ('app')
);
