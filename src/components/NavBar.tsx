import * as React from 'react';
import { NavLink } from 'react-router-dom';

export class NavBar extends React.Component<any, any> {
	render() {
		return (
			<nav className='navbar navbar-expand-lg navbar-light bg-light'>
				<a className='navbar-brand'>
					<img src="assets/favicon.ico" width="40" height="30"
					     className="d-inline-block align-top" alt=""
					     style={{paddingRight: 5}}/>
					React Weather App
				</a>
				<div className='collapse navbar-collapse' id='navbarNav'>
					<ul className='nav'>
						<li>
							<NavLink exact activeClassName='active' to='/'>
								Weather
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName='active' to='/about'>
								About
							</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}