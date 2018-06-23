import * as React from 'react';
import { connect } from 'react-redux';
import { CurrentWeather } from './CurrentWeather';
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';

class WeatherForecast extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	render() {
		const { weather, location, forecast, timezone, units } = this.props;

		return (
			<div>
				<CurrentWeather weather={weather} location={location} timezone={timezone} units={units}/>
				<HourlyForecast timezone={timezone} units={units} hourly={forecast.hourly}/>
				<DailyForecast timezone={timezone} units={units} daily={forecast.daily}/>
			</div>
		);
	};
}

const mapStateToProps = (state: any) => {
	return {
		location: state.location,
		weather: state.weather,
		forecast: state.forecast,
		timezone: state.timezone,
		isLoading: state.isLoading,
		units: state.units,
		error: state.error
	}
};

export default connect(mapStateToProps)(WeatherForecast);
