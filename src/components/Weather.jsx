import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { WeatherData } from './WeatherData';
import { getCurrentWeather, getForecast } from '../api/OpenWeatherMap';
import { getGeoCode, getTimeZone } from '../api/Google';

export class Weather extends React.Component {
	constructor (props) {
		super (props);

		this.state = {
			isLoading: false
		};

		this.handleSearch = this.handleSearch.bind (this);
	}

	cleanStateData () {
		this.setState ({
			location: undefined,
			weather: undefined,
			forecast: undefined,
			timezone: undefined,
			isLoading: false
		});
	}

	componentDidMount () {
		this.setState ({
			location: undefined,
			weather: undefined,
			forecast: undefined,
			timezone: undefined,
			isLoading: true
		});

		navigator.geolocation.getCurrentPosition ((location) => {
			if ( navigator.geolocation ) {
				getGeoCode (location.coords.latitude, location.coords.longitude).then (geocode => {
					if ( geocode ) {
						let location = _.findLast (geocode.results, { 'types': [ 'administrative_area_level_1', 'political' ] });

						const city = location.formatted_address;
						this.getData (city);
					} else {
						this.cleanStateData ();
						alert ('Cannot find your location!');
					}
				}, (errorMessage) => {
					this.cleanStateData ();
					alert (errorMessage);
				});
			} else {
				this.cleanStateData ();
			}
		});
	}

	getData (city) {
		getCurrentWeather (city).then (weather => {
			if ( weather ) {
				this.setState ({
					location: city,
					weather: weather
				});

				let latitude = weather.coord.lat;
				let longitude = weather.coord.lon;
				getTimeZone (latitude, longitude).then (timezone => {
					if ( timezone ) {
						console.log (timezone);
						this.setState ({
							timezone: timezone
						})
					} else {
						this.cleanStateData ();
					}
				});
			} else {
				this.cleanStateData ();
				alert ('Cannot get the weather data!');
			}
		}, (errorMessage) => {
			this.cleanStateData ();
			alert (errorMessage);
		});

		getForecast (city).then (forecast => {
			this.setState ({
				forecast: forecast,
				isLoading: false
			});
		}, (errorMessage) => {
			this.cleanStateData ();
			alert (errorMessage);
		});
	}

	handleSearch (location) {
		this.setState ({
			location: undefined,
			weather: undefined,
			forecast: undefined,
			timezone: undefined,
			isLoading: true
		});
		this.getData (location);
	}

	render () {
		const renderCurrentWeather = () => {
			if ( this.state.isLoading ) {
				return <h4 className='text-center'>Fetching weather...</h4>;
			} else if ( this.state.weather && this.state.location ) {
				return <WeatherData weather={this.state.weather}
				                    location={this.state.location}
				                    forecast={this.state.forecast}
				                    timezone={this.state.timezone}/>;
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