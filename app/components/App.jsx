import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Nav } from './Nav';
import { Main } from './Main';
import { About } from './About';

export class App extends React.Component {
	render () {
		return (
			<Router>
				<div>
					<Nav/>
					<Switch>
						<Route exact path='/' component={Main}/>
						<Route path='/about' component={About}/>
						<Route render={() => {
							return <p> Not found!!</p>
						}}/>
					</Switch>
				</div>
			</Router>
		);
	}
}