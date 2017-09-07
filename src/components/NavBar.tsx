import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchingData } from '../redux/actions';
import { WeatherForm } from './WeatherForm';

class NavBar extends React.Component<any, any> {
	constructor(props: any) {
		super(props);

		this.handleSearch = this.handleSearch.bind(this);
	}

	handleSearch(location: string) {
		this.props.fetchingData(location);
	};

	render() {
		return (
			<nav className='navbar navbar-expand-lg navbar-light' style={{backgroundColor: "#e3f2fd"}}>
				<a className='navbar-brand'>
					<img src="assets/favicon.ico" width="40" height="30"
					     className="d-inline-block align-top" alt=""
					     style={{paddingRight: 5}}/>
					React Weather App
				</a>
				<div className='collapse navbar-collapse' id='navbar'>
					<ul className='nav mr-auto'>
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
						<li>
							<NavLink activeClassName='active' to='/d3_demo_app'>
								D3 Demo
							</NavLink>
						</li>
					</ul>
					<WeatherForm onSearch={this.handleSearch} isDisabled={this.props.isLoading}/>
				</div>
			</nav>
		);
	}
}

const mapStateToProps = (state: any) => {
	return {
		filter: state.filter,
		location: state.location,
		weather: state.weather,
		forecast: state.forecast,
		timezone: state.timezone,
		isLoading: state.isLoading,
		error: state.error
	}
};

const mapDispatchToProps = (dispatch: any) => {
	return bindActionCreators({
		fetchingData
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);