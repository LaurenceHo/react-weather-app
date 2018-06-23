import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Weather from './WeatherMain';
import NavBar from './NavBar';
import { About } from './About';
import { D3DemoApp } from './demo/D3DemoApp';
import { D3DemoNetwork } from './demo/D3DemoNetwork';

import 'antd/lib/alert/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/card/style/css';
import 'antd/lib/col/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/layout/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/spin/style/css';

const { Footer, Content } = Layout;

export class App extends React.Component<any, any> {
	render() {
		return (
			<Router>
				<div>
					<NavBar/>
					<Content className='content'>
						<Switch>
							<Route exact path='/' component={Weather as any}/>
							<Route path='/about' component={About as any}/>
							<Route path='/d3_demo_app' component={D3DemoApp as any}/>
							<Route path='/d3_demo_network' component={D3DemoNetwork as any}/>
							<Route render={() => {
								return <p> Not found!!</p>
							}}/>
						</Switch>
					</Content>
					<Footer className='footer'>
						©2018 Created by Laurence Ho
					</Footer>
				</div>
			</Router>
		);
	}
}
