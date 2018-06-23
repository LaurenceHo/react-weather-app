import * as _ from 'lodash';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Card, Col, Row, Spin } from 'antd';

import { fetchingData, fetchingDataFailure, fetchingDataSuccess, setAllWeatherDataIntoStore } from '../redux/actions';
import { Forecast, Timezone } from './DataModel';
import WeatherForecast from './WeatherForecast';

import {
	getGeocode, getWeather
} from '../api';

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
			getWeather(lat, lon, null).then((results: Forecast) => {
				const timezone: Timezone = {
					timezone: results.timezone,
					offset: results.offset
				};
				const forecast = {
					minutely: results.minutely,
					hourly: results.hourly,
					daily: results.daily
				};

				this.setDataToStore(city, results.currently, timezone, forecast, results.flags.units);
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

	private setDataToStore(city: string, weather: any, timezone: any, forecast: any, units: string) {
		this.props.fetchingDataSuccess();
		this.props.setAllWeatherDataIntoStore({
			filter: city,
			location: city,
			weather: weather,
			timezone: timezone,
			forecast: forecast,
			units: units,
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
							<Row type="flex" justify="center" className='error'>
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
			<div>
				{isLoading ?
					<Row type="flex" justify="center" className='fetching-weather-content'>
						<h2>Fetching weather</h2>
						<Spin className='fetching-weather-spinner' size="large"/>
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
		units: state.units,
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
