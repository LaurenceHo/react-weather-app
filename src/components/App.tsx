import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Weather from './Weather';
import { NavBar } from './NavBar';
import { About } from './About';
import { D3DemoApp } from './D3DemoApp';
import { D3DemoNetwork } from './D3DemoNetwork';

export class App extends React.Component<any, any> {
	render() {
		return (
			<Router>
				<div>
					<NavBar/>
					<Switch>
						<Route exact path='/' component={Weather as any}/>
						<Route path='/about' component={About as any}/>
						<Route path='/d3_demo_app' component={D3DemoApp as any}/>
						<Route path='/d3_demo_network' component={D3DemoNetwork as any}/>
						<Route render={() => {
							return <p> Not found!!</p>
						}}/>
					</Switch>
				</div>
			</Router>
		);
	}
}