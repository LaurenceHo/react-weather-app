import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Nav } from './Nav';
import { About } from './About';
import Weather from '../containers/Weather';

export class App extends React.Component<any, any> {
	render() {
		return (
			<Router>
				<div>
					<Nav/>
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