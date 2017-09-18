import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as _ from 'lodash';

import { WeatherData } from './WeatherData';
import { getCurrentWeather, getForecast } from '../api/OpenWeatherMap';

export class Weather extends React.Component {
	constructor (props) {
		super (props);

		this.state = {
			isLoading: false
		};

		this.handleSearch = this.handleSearch.bind (this);
	}

	componentDidMount () {
		this.setState ({
			location: undefined,
			weather: undefined,
			forecast: undefined,
			isLoading: true
		});

		navigator.geolocation.getCurrentPosition ((location) => {
			if ( navigator.geolocation ) {
				const googleMapAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
					location.coords.latitude + ',' + location.coords.longitude + '&sensor=true';

				return axios.get (googleMapAPI).then ((response) => {
					if ( response.data.results.length > 0 ) {
						let location = _.findLast (response.data.results, { 'types': [ 'administrative_area_level_1', 'political' ] });

						const city = location.formatted_address;
						this.getData(city);
					}
				}, () => {
					throw new Error ('Cannot get location');
				});
			} else {
				this.setState ({
					location: undefined,
					weather: undefined,
					forecast: undefined,
					isLoading: false
				});
			}
		});
	}

	getData(city) {
		getCurrentWeather (city).then ((weather) => {
			this.setState ({
				location: city,
				weather: weather
			});
		}, (errorMessage) => {
			this.setState ({ isLoading: false });
			alert (errorMessage);
		});

		getForecast (city).then ((forecast) => {
			this.setState ({
				forecast: forecast,
				isLoading: false
			});
		}, (errorMessage) => {
			this.setState ({ isLoading: false });
			alert (errorMessage);
		});
	}

	handleSearch (location) {
		this.setState ({
			location: undefined,
			weather: undefined,
			isLoading: true
		});

		this.getData(location);
	}

	render () {
		const renderCurrentWeather = () => {
			if ( this.state.isLoading ) {
				return <h4 className='text-center'>Fetching weather...</h4>;
			} else if ( this.state.weather && this.state.location ) {
				return <WeatherData weather={this.state.weather}
				                    location={this.state.location}
				                    forecast={this.state.forecast}/>;
			}
		};

		return (
			<div>
				<div className='columns medium-6 large-4 small-centered'>
					<h2 className='text-center'>Get Weather</h2>
					<WeatherForm onSearch={this.handleSearch}/>
				</div>
				{renderCurrentWeather ()}
			</div>
		)
	}
}

class WeatherForm extends React.Component {
	constructor (props) {
		super (props);

		this.state = {
			location: ''
		};

		this.handleChange = this.handleChange.bind (this);
		this.handleSubmit = this.handleSubmit.bind (this);
	}

	handleChange (event) {
		const value = event.target.value;

		this.setState (() => {
			return {
				location: value
			}
		})
	}

	handleSubmit (event) {
		event.preventDefault ();

		this.props.onSearch (
			this.state.location
		)
	};

	render () {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input
						type='text'
						value={this.state.location}
						onChange={this.handleChange}
						placeholder='Search weather by city'
					/>
					<button className='button expanded hollow'>Get Weather</button>
				</form>
			</div>
		);
	}
}

WeatherForm.PropTypes = {
	onSearch: PropTypes.func.isRequired
};