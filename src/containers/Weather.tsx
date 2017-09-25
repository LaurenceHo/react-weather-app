import * as React from 'react';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import { WeatherData } from '../components/WeatherData';
import { getCurrentWeather, getForecast } from '../api/OpenWeatherMap';
import { getGeoCode, getTimeZone } from '../api/Google';
import { connect } from 'react-redux';
import { setAllWeatherDataIntoStore } from '../redux/actions';
import { WeatherForm } from '../components/WeatherForm';

interface WeatherState {
	isLoading: boolean,
	location: string,
	weather: any,
	forecast: any,
	timezone: any
}

class Weather extends React.Component<any, WeatherState> {
	constructor() {
		super();

		this.state = {
			location: undefined,
			weather: undefined,
			forecast: undefined,
			timezone: undefined,
			isLoading: false
		};

		this.handleSearch = this.handleSearch.bind(this);
	}

	cleanStateData() {
		this.setState({
			location: undefined,
			weather: undefined,
			forecast: undefined,
			timezone: undefined,
			isLoading: false
		});
	}

	componentDidMount() {
		this.setState({
			location: undefined,
			weather: undefined,
			forecast: undefined,
			timezone: undefined,
			isLoading: true
		});

		navigator.geolocation.getCurrentPosition((location) => {
			if (navigator.geolocation) {
				getGeoCode(location.coords.latitude, location.coords.longitude).then(geocode => {
					if (geocode) {
						let location: any = _.findLast(geocode.results, {'types': ['administrative_area_level_1', 'political']});

						const city = location.formatted_address;
						this.getData(city);
					} else {
						this.cleanStateData();
						alert('Cannot find your location!');
					}
				}, (errorMessage: any) => {
					this.cleanStateData();
					alert(errorMessage);
				});
			} else {
				this.cleanStateData();
			}
		});
	}

	getData(city: string) {
		getCurrentWeather(city).then((weather: any) => {
			if (weather) {
				let latitude = weather.coord.lat;
				let longitude = weather.coord.lon;
				getTimeZone(latitude, longitude).then(timezone => {
					if (timezone) {
						getForecast(city).then((forecast: any) => {
							if (forecast) {
								this.setState({
									location: city,
									weather: weather,
									timezone: timezone,
									forecast: forecast,
									isLoading: false
								});

								this.props.setAllWeatherDataIntoStore(this.state);
							} else {
								this.cleanStateData();
							}
						}, (errorMessage: any) => {
							this.cleanStateData();
							alert(errorMessage);
						});
					} else {
						this.cleanStateData();
					}
				}, (errorMessage: any) => {
					this.cleanStateData();
					alert(errorMessage);
				});
			} else {
				this.cleanStateData();
				alert('Cannot get the weather data!');
			}
		}, (errorMessage: any) => {
			this.cleanStateData();
			alert(errorMessage);
		});
	}

	handleSearch(location: string) {
		this.setState({
			location: undefined,
			weather: undefined,
			forecast: undefined,
			timezone: undefined,
			isLoading: true
		});
		this.getData(location);
	}

	render() {
		const renderCurrentWeather = () => {
			if (this.state.isLoading) {
				return <h4 className='text-center'>Fetching weather...</h4>;
			} else if (this.state.weather && this.state.location) {
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
				{renderCurrentWeather()}
			</div>
		)
	}
}

const mapStateToProps = (state: any) => {
	return {
		location: state.location,
		weather: state.weather,
		forecast: state.forecast,
		timezone: state.timezone
	}
};

const mapDispatchToProps = (dispatch: any) => {
	return bindActionCreators({
		setAllWeatherDataIntoStore
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Weather);
