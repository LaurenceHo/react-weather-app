import * as React from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';
import { CurrentWeather } from './CurrentWeather';

class WeatherForecast extends React.Component<any, any> {
	width: number = 0;

	constructor(props: any) {
		super(props);

		if (window.innerWidth < 992) {
			this.width = 640;
		} else {
			this.width = window.innerWidth / 2;
		}

		this.state = {
			//TODO
		};
	}

	render() {
		const { weather, location, forecast, timezone, units } = this.props;

		return (
			<div>
				<CurrentWeather weather={weather} location={location} timezone={timezone} units={units}/>
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
