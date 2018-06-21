import * as _ from 'lodash';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Card, Col, Row, Spin } from 'antd';

import { fetchingData, fetchingDataFailure, fetchingDataSuccess, setAllWeatherDataIntoStore } from '../redux/actions';
import WeatherForecast from './WeatherForecast';

import {
	getGeocode, getWeather
} from '../api';

interface Timezone {
	timezone: string,
	offset: number
}

interface Weather {
	time: number,
	summary: string,
	icon: string,
	nearestStormDistance: number,
	precipIntensity: number,
	precipProbability: number,
	precipType: string,
	temperature: number,
	humidity: number,
	pressure: number,
	windSpeed: number,
	windGust: number,
	cloudCover: number,
	uvIndex: number,
	visibility: number
}

class WeatherMain extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	componentWillReceiveProps(nextProps: any) {
		if (this.props.filter && (this.props.filter !== nextProps.filter)) {
			// When user search weather by city name
			this.getWeatherData(0, 0, nextProps.filter);
		}
	}

	componentDidMount() {
		if (this.props.location.length === 0 && _.isEmpty(this.props.weather) && _.isEmpty(this.props.forecast)) {
			this.props.fetchingData('');
			// this.mockData();

			// Get user's coordinates when user access the web app, it will ask user's location permission
			navigator.geolocation.getCurrentPosition(location => {
				// Get city name for displaying on the home page
				getGeocode(location.coords.latitude, location.coords.longitude, '').then((geocode: any) => {
					if (geocode.status === 'OK') {
						this.props.fetchingData(geocode.city);
						this.getWeatherData(geocode.latitude, geocode.longitude, geocode.city);
					}
				}).catch(error => {
					this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
				});
			}, error => {
				// If user's block the location query, use the default location
				this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
			});
		}
	}

	searchByDefaultLocation(message: string) {
		this.props.fetchingDataFailure(message);
		setTimeout(this.delayFetchData.bind(this), 3000);
	}

	delayFetchData() {
		this.props.fetchingData('Auckland');
		this.getWeatherData(0, 0, 'Auckland');
	}

	getWeatherData(lat: number, lon: number, city: string) {
		if (lat !== 0 && lon !== 0) {
			// get current weather by latitude and longitude
			getWeather(lat, lon, null).then((results: any) => {
				const timezone: Timezone = {
					timezone: results.timezone,
					offset: results.offset
				};

				const currenctWeather: Weather = {
					time: results.currently.time,
					summary: results.minutely.summary,
					icon: results.currently.icon,
					nearestStormDistance: results.currently.nearestStormDistance,
					precipIntensity: results.currently.precipIntensity,
					precipProbability: results.currently.precipProbability,
					precipType: results.currently.precipType,
					temperature: results.currently.temperature,
					humidity: results.currently.humidity,
					pressure: results.currently.pressure,
					windSpeed: results.currently.windSpeed,
					windGust: results.currently.windGust,
					cloudCover: results.currently.cloudCover,
					uvIndex: results.currently.uvIndex,
					visibility: results.currently.visibility
				};

				let hourlyForecast: Weather[] = [];
				results.hourly.data.forEach((data: any) => {
					hourlyForecast.push({
						time: data.time,
						summary: data.summary,
						icon: data.icon,
						nearestStormDistance: data.nearestStormDistance,
						precipIntensity: data.precipIntensity,
						precipProbability: data.precipProbability,
						precipType: data.precipType,
						temperature: data.temperature,
						humidity: data.humidity,
						pressure: data.pressure,
						windSpeed: data.windSpeed,
						windGust: data.windGust,
						cloudCover: data.cloudCover,
						uvIndex: data.uvIndex,
						visibility: data.visibility
					});
				});

				let dailyForecast: Weather[] = [];
				results.daily.data.forEach((data: any) => {
					dailyForecast.push({
						time: data.time,
						summary: data.summary,
						icon: data.icon,
						nearestStormDistance: data.nearestStormDistance,
						precipIntensity: data.precipIntensity,
						precipProbability: data.precipProbability,
						precipType: data.precipType,
						temperature: data.temperature,
						humidity: data.humidity,
						pressure: data.pressure,
						windSpeed: data.windSpeed,
						windGust: data.windGust,
						cloudCover: data.cloudCover,
						uvIndex: data.uvIndex,
						visibility: data.visibility
					});
				});

				let forecast = {
					hourly: hourlyForecast,
					daily: dailyForecast
				};

				this.setDataToStore(city, currenctWeather, timezone, forecast);
			}).catch(error => {
				this.props.fetchingDataFailure(error);
			});
		} else {
			// Get coordinates by city
			getGeocode(null, null, city).then((geocode: any) => {
				if (geocode.status === 'OK') {
					this.props.fetchingData(geocode.city);
					this.getWeatherData(geocode.latitude, geocode.longitude, geocode.city);
				}
			}).catch(error => {
				this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
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
						{!_.isUndefined(error) || !_.isNull(error) ?
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
