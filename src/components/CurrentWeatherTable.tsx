import * as React from 'react';
import * as moment from 'moment';
import { Col, Table } from 'antd';

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

		const columns = [
			{title: 'title', dataIndex: 'title'},
			{title: 'value', dataIndex: 'value'},
		];

		const data = [
			{key: '1', title: 'Location', value: location},
			// {
			// 	key: '2',
			// 	title: 'Weather',
			// 	value: () => (<div><WeatherIcon code={weather.weather[0].id}/> {weather.weather[0].description}</div>)
			// }
			{key: '3', title: 'Cloud Cover', value: weather.clouds.all + ' %'},
			{key: '4', title: 'Temperature', value: Math.round(weather.main.temp * 10) / 10 + ' °C'},
			// {key: '5', title: 'Wind', value: () => (<div><WindIcon degree={weather.wind.deg}/> {weather.wind.speed} m/s</div>),
			{key: '6', title: 'Pressure', value: weather.main.pressure + ' hpa'},
			{key: '7', title: 'Humidity', value: weather.main.humidity + ' %'},
			{key: '8', title: 'Sunrise Time', value: sunriseTime},
			{key: '9', title: 'Sunset Time', value: sunsetTime}
		];

		return (
			<Col span={6} style={{paddingTop: 50}}>
				<Table columns={columns} dataSource={data} pagination={false} showHeader={false}/>
				{/*<td>Weather</td>*/}
				{/*<td><WeatherIcon code={weather.weather[0].id}/> {weather.weather[0].description}</td>*/}
				{/*<td>Wind</td>*/}
				{/*<td><WindIcon degree={weather.wind.deg}/> {weather.wind.speed} m/s</td>*/}
				{/*<td>Sunrise Time</td>*/}
				{/*<td><i className="wi wi-sunrise"></i> {sunriseTime}</td>*/}
				{/*<td>Sunset Time</td>*/}
				{/*<td><i className="wi wi-sunset"></i> {sunsetTime}</td>*/}
			</Col>
		);
	}
}