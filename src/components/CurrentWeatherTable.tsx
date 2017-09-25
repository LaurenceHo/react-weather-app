import * as React from 'react';
import * as moment from 'moment';

interface CurrentWeatherTablePropTypes {
	weather: any
	location: string
	timezone: any
};

export class CurrentWeatherTable extends React.Component<CurrentWeatherTablePropTypes, any> {
	render() {
		const utcOffset = (this.props.timezone.rawOffset + this.props.timezone.dstOffset) / 3600;
		const sunriseTime = moment.unix(this.props.weather.sys.sunrise).utcOffset(utcOffset).format('HH:mm');
		const sunsetTime = moment.unix(this.props.weather.sys.sunset).utcOffset(utcOffset).format('HH:mm');

		return (
			<div className='columns medium-6 large-4' style={{paddingTop: 30}}>
				<table>
					<tbody>
					<tr>
						<td>Location</td>
						<td>{this.props.location}</td>
					</tr>
					<tr>
						<td>Temperature</td>
						<td>{Math.round(this.props.weather.main.temp * 10) / 10} °C</td>
					</tr>
					<tr>
						<td>Wind</td>
						<td>{this.props.weather.wind.speed} m/s</td>
					</tr>
					<tr>
						<td>Pressure</td>
						<td>{this.props.weather.main.pressure} hpa</td>
					</tr>
					<tr>
						<td>Humidity</td>
						<td>{this.props.weather.main.humidity} %</td>
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