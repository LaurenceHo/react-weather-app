import React from 'react';
import { WeatherMessage } from './WeatherMessage';
import { WeatherForm } from './WeatherForm';
import { getCurrentWeather } from '../api/openWeatherMap';
import axios from 'axios';
import * as _ from 'lodash';

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
			isLoading: true
		});

		navigator.geolocation.getCurrentPosition ((location) => {
			if ( navigator.geolocation ) {
				const googleMapAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
					location.coords.latitude + ',' + location.coords.longitude + '&sensor=true';

				return axios.get (googleMapAPI).then ((response) => {
					if ( response.data.results.length > 0 ) {
						let location = _.findLast (response.data.results, { 'types': [ "administrative_area_level_1", "political" ] });

						const city = location.formatted_address;

						getCurrentWeather (city).then ((weather) => {
							console.log (weather);

							this.setState ({
								location: city,
								weather: weather,
								isLoading: false
							});
						}, (errorMessage) => {
							this.setState ({ isLoading: false });
							alert (errorMessage);
						});
					}
				}, () => {
					throw new Error ('Cannot get location');
				});
			}
		});
	}

	handleSearch (location) {
		this.setState ({
			location: undefined,
			weather: undefined,
			isLoading: true
		});

		getCurrentWeather (location).then ((weather) => {
			this.setState ({
				location: location,
				weather: weather,
				isLoading: false
			});
		}, (errorMessage) => {
			this.setState ({ isLoading: false });
			alert (errorMessage);
		});
	}

	render () {
		const renderMessage = () => {
			if ( this.state.isLoading ) {
				return <h3 className="text-center">Fetching weather...</h3>;
			} else if ( this.state.weather && this.state.location ) {
				return <WeatherMessage weather={this.state.weather} location={this.state.location}/>;
			}
		};

		return (
			<div>
				<div className="columns medium-6 large-4 small-centered">
					<h2 className="text-center">Get Weather</h2>
					<WeatherForm onSearch={this.handleSearch}/>
				</div>
				{renderMessage ()}
			</div>
		)
	}
}