import * as React from 'react';
import * as moment from 'moment';
import { Col, Table } from 'antd';
import { WeatherIcon } from './WeatherIcon';
import { WindIcon } from './WindIcon';

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
			{
				title: 'value',
				dataIndex: 'value',
				render: (text: any, record: any, index: number) => {
					if (index === 1) {
						return (<span><WeatherIcon code={weather.weather[0].id}/> {weather.weather[0].description}</span>)
					} else if (index === 4) {
						return (<span><WindIcon degree={weather.wind.deg}/> {weather.wind.speed} m/s</span>);
					} else if (index === 7) {
						return (<span><i className="wi wi-sunrise"></i> {sunriseTime}</span>);
					} else if (index === 8) {
						return (<span><i className="wi sunset"></i> {sunsetTime}</span>);
					} else {
						return (<span>{record.value}</span>);
					}
				}
			},
		];

		const data = [
			{key: '1', title: 'Location', value: location},
			{key: '2', title: 'Weather', value: ''},
			{key: '3', title: 'Cloud Cover', value: weather.clouds.all + ' %'},
			{key: '4', title: 'Temperature', value: Math.round(weather.main.temp * 10) / 10 + ' °C'},
			{key: '5', title: 'Wind', value: ''},
			{key: '6', title: 'Pressure', value: weather.main.pressure + ' hpa'},
			{key: '7', title: 'Humidity', value: weather.main.humidity + ' %'},
			{key: '8', title: 'Sunrise Time', value: ''},
			{key: '9', title: 'Sunset Time', value: ''}
		];

		return (
			<Col span={5} style={{paddingTop: 100}}>
				<Table columns={columns} dataSource={data} pagination={false} showHeader={false} size={'small'}/>
			</Col>
		);
	}
}