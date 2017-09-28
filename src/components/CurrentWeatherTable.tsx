import * as React from 'react';
import * as moment from 'moment';

interface CurrentWeatherTablePropTypes {
	weather: any
	location: string
	timezone: any
};

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
					<tr>
						<td>Location</td>
						<td>{location}</td>
					</tr>
					<tr>
						<td>Weather</td>
						<td>{weather.weather[0].description}</td>
					</tr>
					<tr>
						<td>Cloud Cover</td>
						<td>{weather.clouds.all} %</td>
					</tr>
					<tr>
						<td>Temperature</td>
						<td>{Math.round(weather.main.temp * 10) / 10} °C</td>
					</tr>
					<tr>
						<td>Wind</td>
						<td>{weather.wind.speed} m/s</td>
					</tr>
					<tr>
						<td>Pressure</td>
						<td>{weather.main.pressure} hpa</td>
					</tr>
					<tr>
						<td>Humidity</td>
						<td>{weather.main.humidity} %</td>
					</tr>
					<tr>
						<td>Sunrise Time</td>
						<td>{sunriseTime}</td>
					</tr>
					<tr>
						<td>Sunset Time</td>
						<td>{sunsetTime}</td>
					</tr>
					</tbody>
				</table>
			</div>
		);
	}
}