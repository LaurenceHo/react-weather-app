import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { fetchingData, fetchingDataFailure, fetchingDataSuccess, setAllWeatherDataIntoStore } from '../redux/actions';
import WeatherData from '../components/WeatherData';
import { WeatherForm } from '../components/WeatherForm';
import { getCurrentWeather, getForecast } from '../api/OpenWeatherMap';
import { getGeoCode, getTimeZone } from '../api/Google';

import { timezone } from '../../sample/timezone';
import { weather } from '../../sample/weather';
import { forecast } from '../../sample/forecast';

class Weather extends React.Component<any, any> {
	constructor() {
		super();

		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		this.props.fetchingData();
		//this.mockData();
		navigator.geolocation.getCurrentPosition((location) => {
			if (navigator.geolocation) {
				getGeoCode(location.coords.latitude, location.coords.longitude).then(geocode => {
					if (geocode.status === 'OK') {
						let location: any = _.findLast(geocode.results, {'types': ['administrative_area_level_1', 'political']});

						const city = location.formatted_address;
						this.getData(city);
					} else if (geocode.error_message) {
						this.props.fetchingDataFailure(geocode.error_message);
					} else {
						this.props.fetchingDataFailure('Cannot find your location');
					}
				});
			}
		});
	}

	mockData() {
		this.props.fetchingDataSuccess();
		this.props.setAllWeatherDataIntoStore({
			location: 'Auckland, NZ',
			weather: weather,
			timezone: timezone,
			forecast: forecast,
			isLoading: false
		});
	}

	getData(city: string) {
		getCurrentWeather(city).then((weather: any) => {
			if (weather && weather.cod === 200) {
				let latitude = weather.coord.lat;
				let longitude = weather.coord.lon;
				getTimeZone(latitude, longitude).then(timezone => {
					if (timezone.status === 'OK') {
						getForecast(city).then((forecast: any) => {
							if (forecast) {
								this.props.fetchingDataSuccess();
								this.props.setAllWeatherDataIntoStore({
									location: city,
									weather: weather,
									timezone: timezone,
									forecast: forecast,
									isLoading: false
								});
							}
						}, (errorMessage: any) => {
							this.props.fetchingDataFailure(errorMessage.data.message);
						});
					} else if (timezone.error_message) {
						this.props.fetchingDataFailure(timezone.error_message);
					} else {
						this.props.fetchingDataFailure('Cannot get timezone');
					}
				});
			}
		}, (errorMessage: any) => {
			this.props.fetchingDataFailure(errorMessage.message);
		});
	}

	handleSearch(location: string) {
		this.props.fetchingData();
		this.getData(location);
	}

	render() {
		console.log('###### Render PROPS: ', this.props);
		const {weather, location, isLoading, error} = this.props;

		const renderCurrentWeather = () => {
			if (isLoading) {
				return <h4 className='text-center'>Fetching weather...</h4>;
			} else if (weather && location) {
				return <WeatherData/>;
			} else if (error) {
				return (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				);
			}
		};

		return (
			<div className='container'>
				<div className='row justify-content-center' style={{paddingTop: 40, paddingBottom: 40}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Weather);
