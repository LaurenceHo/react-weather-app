import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { fetchingData, fetchingDataFailure, fetchingDataSuccess, setAllWeatherDataIntoStore } from '../redux/actions';
import WeatherData from '../components/WeatherData';
import { WeatherForm } from '../components/WeatherForm';
import { getCurrentWeather, getForecast } from '../api/OpenWeatherMap';
import { getGeoCode, getTimeZone } from '../api/Google';

class Weather extends React.Component<any, any> {
	constructor() {
		super();

		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		this.props.fetchingData();

		navigator.geolocation.getCurrentPosition((location) => {
			if (navigator.geolocation) {
				getGeoCode(location.coords.latitude, location.coords.longitude).then(geocode => {
					if (geocode) {
						let location: any = _.findLast(geocode.results, {'types': ['administrative_area_level_1', 'political']});

						const city = location.formatted_address;
						this.getData(city);
					} else {
						this.props.fetchingDataFailure('Cannot find your location');
					}
				}, (errorMessage: any) => {
					this.props.fetchingDataFailure(errorMessage);
				});
			} else {
				this.props.fetchingDataFailure('Cannot get geolocation');
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
								this.props.fetchingDataSuccess();
								this.props.setAllWeatherDataIntoStore({
									location: city,
									weather: weather,
									timezone: timezone,
									forecast: forecast,
									isLoading: false
								});
							} else {
								this.props.fetchingDataFailure('Cannot get the forecast');
							}
						}, (errorMessage: any) => {
							this.props.fetchingDataFailure(errorMessage);
						});
					} else {
						this.props.fetchingDataFailure('Cannot get timezone');
					}
				}, (errorMessage: any) => {
					this.props.fetchingDataFailure(errorMessage);
				});
			} else {
				this.props.fetchingDataFailure('Cannot get the weather data');
			}
		}, (errorMessage: any) => {
			this.props.fetchingDataFailure(errorMessage);
		});
	}

	handleSearch(location: string) {
		this.props.fetchingData();
		this.getData(location);
	}

	render() {
		console.log('###### Render PROPS: ', this.props);
		const {weather, location} = this.props;

		const renderCurrentWeather = () => {
			if (this.props.isLoading) {
				return <h4 className='text-center'>Fetching weather...</h4>;
			} else if (weather && location) {
				return <WeatherData/>;
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
		timezone: state.timezone,
		isLoading: state.isLoading
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
