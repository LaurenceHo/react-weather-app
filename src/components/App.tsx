import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar } from './NavBar';
import { About } from './About';
import Weather from '../containers/Weather';

export class App extends React.Component<any, any> {
	render() {
		return (
			<Router>
				<div>
					<NavBar/>
					<Switch>
						<Route exact path='/' component={Weather as any}/>
						<Route path='/about' component={About as any}/>
						<Route render={() => {
							return <p> Not found!!</p>
						}}/>
					</Switch>
				</div>
			</Router>
		);
	}
}