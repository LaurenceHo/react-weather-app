import * as _ from 'lodash';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchingData, fetchingDataFailure, fetchingDataSuccess, setAllWeatherDataIntoStore } from '../redux/actions';
import WeatherData from './WeatherData';
import {
	getCurrentWeatherByCity,
	getCurrentWeatherByCoordinates,
	getForecastByCity,
	getForecastByCoordinates
} from '../api/OpenWeatherMap';
import { getGeoCode, getTimeZone } from '../api/Google';
// For mock data
// import { timezone } from '../../sample/timezone';
// import { weather } from '../../sample/weather';
// import { forecast } from '../../sample/forecast';

interface WeatherState {
	previousFilter: string
}

class Weather extends React.Component<any, WeatherState> {
	constructor(props: any) {
		super(props);

		this.state = {
			previousFilter: ''
		};

		this.handleSearch = this.handleSearch.bind(this);
	}

	componentWillReceiveProps(nextProps: any) {
		if (this.state.previousFilter !== nextProps.filter) {
			this.setState({previousFilter: nextProps.filter});
			this.getWeatherData(0, 0);
		}
	}

	componentDidMount() {
		this.props.fetchingData('');
		// this.mockData();

		// For PROD
		navigator.geolocation.getCurrentPosition(location => {
			getGeoCode(location.coords.latitude, location.coords.longitude).then(geocode => {
				if (geocode.status === 'OK') {
					let sublocalityLocation: any = _.findLast(geocode.results, {'types': ["political", "sublocality", "sublocality_level_1"]});
					let location: any = _.findLast(geocode.results, {'types': ['administrative_area_level_1', 'political']});

					let city;
					if (sublocalityLocation) {
						city = sublocalityLocation.formatted_address;
					} else {
						city = location.formatted_address;
					}
					this.setState({previousFilter: city});
					this.props.fetchingData(city);
					this.getWeatherData(geocode.results[0].geometry.location.lat, geocode.results[0].geometry.location.lng);
				} else if (geocode.error_message) {
					this.searchByDefaultLocation(geocode.error_message + '. Use default location: Auckland, New Zealand');
				} else {
					this.searchByDefaultLocation('Cannot find your location. Use default location: Auckland, New Zealand');
				}
			});
		}, error => {
			this.searchByDefaultLocation(error.message + '. Use default location: Auckland, New Zealand');
		});
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
		this.setState({previousFilter: 'Auckland'});
		this.props.fetchingData('Auckland');
		this.getWeatherData(0, 0);
	}

	getWeatherData(lat: number, lon: number) {
		if (lat !== 0 && lon !== 0) {
			getCurrentWeatherByCoordinates(lat, lon).then((weather: any) => {
				if (weather && weather.cod === 200) {
					getTimeZone(lat, lon).then(timezone => {
						if (timezone.status === 'OK') {
							getForecastByCoordinates(lat, lon).then((forecast: any) => {
								if (forecast) {
									this.setDataToStore(this.props.filter, weather, timezone, forecast);
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
			});
		} else {
			getCurrentWeatherByCity(this.props.filter).then((weather: any) => {
				if (weather && weather.cod === 200) {
					let latitude = weather.coord.lat;
					let longitude = weather.coord.lon;
					getTimeZone(latitude, longitude).then(timezone => {
						if (timezone.status === 'OK') {
							getForecastByCity(this.props.filter).then((forecast: any) => {
								if (forecast) {
									this.setDataToStore(this.props.filter, weather, timezone, forecast);
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

	handleSearch(location: string) {
		this.props.fetchingData(location);
		this.getWeatherData(0, 0);
	}

	render() {
		const {weather, location, isLoading, error} = this.props;

		const renderCurrentWeather = () => {
			if (isLoading) {
				return <h4 className='text-center'>Fetching weather...</h4>;
			} else if (weather && location) {
				return <WeatherData/>;
			} else if (error) {
				return (
					<div className="alert alert-danger alert-dismissible" role="alert">
						<button type="button" className="close" data-dismiss="alert" aria-label="Close"><span
							aria-hidden="true">&times;</span></button>
						{error}
					</div>
				);
			}
		};

		return (
			<div className='container'>
				<div style={{paddingTop: 40, paddingBottom: 40}}>
					{renderCurrentWeather()}
				</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Weather);
