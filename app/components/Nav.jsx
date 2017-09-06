import React from 'react';
import { NavLink } from 'react-router-dom';

export class Nav extends React.Component {
	constructor (props) {
		super (props);

		this.state = {
			location: ''
		};

		this.handleSubmit = this.handleSubmit.bind (this);
	}

	handleSubmit (event) {
		event.preventDefault ();
    // TODO
	};

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
            <li>
              <NavLink activeClassName='active' to='/examples'>
                Examples
              </NavLink>
            </li>
            <div className="top-bar-right">
              <form onSubmit={this.handleSubmit}>
                <ul className="menu">
                  <li>
                    <input type="search" placeholder="Search weather"/>
                  </li>
                  <li>
                    <input type="submit" className="button" value="Get Weather"/>
                  </li>
                </ul>
              </form>
            </div>
          </ul>
        </div>
      </div>
		);
	}
}