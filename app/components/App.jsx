import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Nav } from './Nav';
import { Main } from './Main';
import { About } from './About';
import { Examples } from './Examples';

export class App extends React.Component {
	render () {
		return (
			<Router>
				<div>
					<Nav/>
					<Switch>
						<Route exact path='/' component={Main}/>
						<Route path='/about' component={About}/>
						<Route path='/examples' component={Examples}/>
						<Route render={() => {
							return <p> Not found!!</p>
						}}/>
					</Switch>
				</div>
			</Router>
		);
	}
}