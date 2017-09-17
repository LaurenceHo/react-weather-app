import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';

export const WeatherMessage = (props) => {
	const sunriseTime = moment.unix (props.weather.sys.sunrise);
	const sunsetTime = moment.unix (props.weather.sys.sunset);

	return (
		<div>
			<h4 className="text-center">Current weather and forecasts in your city</h4>
			<table>
				<tbody>
				<tr>
					<td>Location</td>
					<td>{props.location}</td>
				</tr>
				<tr>
					<td>Temperature</td>
					<td>{props.weather.main.temp} °C</td>
				</tr>
				<tr>
					<td>Wind</td>
					<td>{props.weather.wind.speed} m/s</td>
				</tr>
				<tr>
					<td>Pressure</td>
					<td>{props.weather.main.pressure} hpa</td>
				</tr>
				<tr>
					<td>Humidity</td>
					<td>{props.weather.main.humidity} %</td>
				</tr>
				<tr>
					<td>Sunrise Time</td>
					<td>{sunriseTime.hours ()}:{sunriseTime.minutes ()}</td>
				</tr>
				<tr>
					<td>Sunset Time</td>
					<td>{sunsetTime.hours ()}:{sunsetTime.minutes ()}</td>
				</tr>
				</tbody>
			</table>
		</div>
	)
};

WeatherMessage.PropTypes = {
	weather: PropTypes.object.isRequired,
	location: PropTypes.string.isRequired
};
