import * as React from 'react';
import { connect } from 'react-redux';
import CurrentWeather from './CurrentWeather';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';

class WeatherForecast extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div>
				<CurrentWeather/>
				<HourlyForecast/>
				<DailyForecast/>
			</div>
		);
	};
}

const mapStateToProps = (state: any) => {
	return {
		units: state.units,
		filter: state.filter,
		location: state.location,
		weather: state.weather,
		forecast: state.forecast,
		timezone: state.timezone,
		isLoading: state.isLoading,
		error: state.error
	}
};

export default connect(mapStateToProps)(WeatherForecast);
