import React from 'react';
import { NavLink } from 'react-router-dom';

export class Nav extends React.Component {
	constructor (props) {
		super (props);
	}

	render () {
		return (
			<div className="top-bar">
				<div className="top-bar-left">
					<ul className="menu">
						<li className="menu-text">React Weather App</li>
						<li>
							<NavLink exact activeClassName='active' to='/'>
								Get Weather
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName='active' to='/about'>
								About
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}