import * as React from 'react';
import * as moment from 'moment';
import { WeatherIcon } from './WeatherIcon';
import { WindIcon } from "./WindIcon";

interface CurrentWeatherTablePropTypes {
	weather: any
	location: string
	timezone: any
}

export class CurrentWeatherTable extends React.Component<CurrentWeatherTablePropTypes, any> {
	render() {
		const {weather, location, timezone} = this.props;
		const utcOffset = (timezone.rawOffset + timezone.dstOffset) / 3600;
		const sunriseTime = moment.unix(weather.sys.sunrise).utcOffset(utcOffset).format('HH:mm');
		const sunsetTime = moment.unix(weather.sys.sunset).utcOffset(utcOffset).format('HH:mm');

		return (
			<div className='col-4' style={{paddingTop: 30}}>
				<table className='table table-striped'>
					<tbody>
					<tr className="table-primary">
						<td>Location</td>
						<td>{location}</td>
					</tr>
					<tr>
						<td>Weather</td>
						<td><WeatherIcon code={weather.weather[0].id}/> {weather.weather[0].description}</td>
					</tr>
					<tr className="table-primary">
						<td>Cloud Cover</td>
						<td>{weather.clouds.all} %</td>
					</tr>
					<tr>
						<td>Temperature</td>
						<td>{Math.round(weather.main.temp * 10) / 10} °C</td>
					</tr>
					<tr className="table-primary">
						<td>Wind</td>
						<td><WindIcon degree={weather.wind.deg}/> {weather.wind.speed} m/s</td>
					</tr>
					<tr>
						<td>Pressure</td>
						<td>{weather.main.pressure} hpa</td>
					</tr>
					<tr className="table-primary">
						<td>Humidity</td>
						<td>{weather.main.humidity} %</td>
					</tr>
					<tr>
						<td>Sunrise Time</td>
						<td><i className="wi wi-sunrise"></i> {sunriseTime}</td>
					</tr>
					<tr className="table-primary">
						<td>Sunset Time</td>
						<td><i className="wi wi-sunset"></i> {sunsetTime}</td>
					</tr>
					</tbody>
				</table>
			</div>
		);
	}
}