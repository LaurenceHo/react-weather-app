import * as _ from 'lodash';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Card, Col, Row, Spin } from 'antd';

import { fetchingData, fetchingDataFailure, fetchingDataSuccess, setAllWeatherDataIntoStore } from '../redux/actions';
import WeatherForecast from './WeatherForecast';

import {
	getCurrentWeatherByCity,
	getCurrentWeatherByCoordinates,
	getForecastByCity,
	getForecastByCoordinates, getGeocode, getTimeZone
} from '../api';
// For mock data
// import { timezone } from '../../sample/timezone';
// import { weather } from '../../sample/weather';
// import { forecast } from '../../sample/forecast';

class WeatherMain extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	componentWillReceiveProps(nextProps: any) {
		if (this.props.filter && (this.props.filter !== nextProps.filter)) {
			this.getWeatherData(0, 0, nextProps.filter);
		}
	}

	componentDidMount() {
		if (this.props.location.length === 0 && _.isEmpty(this.props.weather) && _.isEmpty(this.props.forecast)) {
			this.props.fetchingData('');
			// this.mockData();

			// For PROD
			navigator.geolocation.getCurrentPosition(location => {
				getGeocode(location.coords.latitude, location.coords.longitude).then(geocode => {
					if (geocode.status === 'OK') {
						this.props.fetchingData(geocode.city);
						this.getWeatherData(geocode.latitude, geocode.longitude, geocode.city);
					}
				}).catch(error => {
					this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
				});
			}, error => {
				this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
			});
		}
	}

	// mockData() {
	// 	this.props.fetchingData('Auckland');
	// 	this.props.fetchingDataSuccess();
	// 	this.props.setAllWeatherDataIntoStore({
	// 		filter: 'Auckland',
	// 		location: 'Auckland, NZ',
	// 		weather: weather,
	// 		timezone: timezone,
	// 		forecast: forecast,
	// 		isLoading: false
	// 	});
	// }

	searchByDefaultLocation(message: string) {
		this.props.fetchingDataFailure(message);
		setTimeout(this.delayFetchData.bind(this), 3000);
	}

	delayFetchData() {
		this.props.fetchingData('Auckland');
		this.getWeatherData(0, 0, 'Auckland');
	}

	getTimeZoneAndForecast(lat: number, lon: number, weather: any, type: string, city: string) {
		getTimeZone(lat, lon).then(timezone => {
			if (timezone.status === 'OK') {
				if (type === 'city' && city) {
					getForecastByCity(city).then((forecast: any) => {
						if (forecast) {
							console.log('Got forecast by city: ', this.props.filter);
							this.setDataToStore(this.props.filter, weather, timezone, forecast);
						}
					}, (error: any) => {
						this.props.fetchingDataFailure(error.message);
					});
				} else {
					getForecastByCoordinates(lat, lon).then((forecast: any) => {
						if (forecast) {
							console.log('Got forecast by coordinates: ', lat, lon);
							this.setDataToStore(this.props.filter, weather, timezone, forecast);
						}
					}, (error: any) => {
						this.props.fetchingDataFailure(error.message);
					});
				}
			} else if (timezone.error_message) {
				this.props.fetchingDataFailure(timezone.error_message);
			} else {
				this.props.fetchingDataFailure('Cannot get timezone');
			}
		});
	}

	getWeatherData(lat: number, lon: number, city: string) {
		if (lat !== 0 && lon !== 0) {
			getCurrentWeatherByCoordinates(lat, lon).then((weather: any) => {
				if (weather && weather.cod === 200) {
					console.log('Got current weather by coordinates: ', lat, lon);
					this.getTimeZoneAndForecast(lat, lon, weather, 'coordinates', '');
				}
			}, (error: any) => {
				this.props.fetchingDataFailure(error.message);
			});
		} else {
			getCurrentWeatherByCity(city).then((weather: any) => {
				if (weather && weather.cod === 200) {
					console.log('Got current weather by city: ', city);
					let latitude = weather.coord.lat;
					let longitude = weather.coord.lon;
					this.getTimeZoneAndForecast(latitude, longitude, weather, 'city', city);
				}
			}, (error: any) => {
				if (error.message.indexOf('404') !== -1) {
					this.props.fetchingDataFailure(`${error.message}. Cannot find the weather by ${city}`)
				} else {
					this.props.fetchingDataFailure(error.message);
				}
			});
		}
	}

	private setDataToStore(city: string, weather: any, timezone: any, forecast: any) {
		this.props.fetchingDataSuccess();
		this.props.setAllWeatherDataIntoStore({
			filter: city,
			location: city,
			weather: weather,
			timezone: timezone,
			forecast: forecast,
			isLoading: false
		});
	}

	render() {
		const { weather, location, isLoading, error } = this.props;

		const renderCurrentWeather = () => {
			if (error) {
				return (
					<div>
						<Row type="flex" justify="center">
							<Col xs={24} sm={24} md={18} lg={16} xl={16}>
								<Alert
									message="Error"
									description={error}
									type="error"
									showIcon
								/>
							</Col>
						</Row>
						{error.indexOf('404') !== -1 ?
							<Row type="flex" justify="center" style={{ paddingTop: 10 }}>
								<Col xs={24} sm={24} md={18} lg={16} xl={16}>
									<Card title="Search engine is very flexible. How it works:">
										<ul>
											<li>Put the city's name or its part and get the list of the most proper
												cities in the world. Example - London or Auckland. The more precise city
												name you put the more precise list you will get.
											</li>
											<li>To make it more precise put the city's name or its part, comma, the name
												of the country or 2-letter country code. You will get all proper cities
												in chosen country. The order is important - the first is city name then
												comma then country. Example - Auckland, NZ or Auckland, New Zealand.
											</li>
										</ul>
									</Card>
								</Col>
							</Row>
							: null}
					</div>
				);
			} else if (weather && location) {
				return (<WeatherForecast/>);
			}
		};

		return (
			<div style={{ paddingTop: 40, paddingBottom: 40 }}>
				{isLoading ?
					<Row type="flex" justify="center">
						<h2 className='text-center'>Fetching weather </h2><Spin size="large"/>
					</Row>
					: renderCurrentWeather()}
			</div>
		)
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
		fetchingData,
		fetchingDataSuccess,
		fetchingDataFailure,
		setAllWeatherDataIntoStore
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(WeatherMain);
