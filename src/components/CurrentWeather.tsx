import { Col, Row } from 'antd';
import * as moment from 'moment';
import * as React from 'react';
import { Timezone, Weather } from './DataModel';
import { WeatherIcon } from './icon/WeatherIcon';
import { WindIcon } from './icon/WindIcon';

interface CurrentWeatherPropTypes {
	weather: Weather
	location: string
	timezone: Timezone,
	units: string
}

export class CurrentWeather extends React.Component<CurrentWeatherPropTypes, any> {
	render() {
		const { weather, location, timezone, units } = this.props;

		return (
			<div>
				<Row type="flex" justify="center" className='current-weather-top'>
					<Col span={3}>
						<span>
						Rain: {weather.precipIntensity.toFixed(2)} {units === 'us' ? 'in' : 'mm'} / {Math.round(weather.precipProbability * 100)} <i className="wi wi-humidity"/>
						</span>
					</Col>
					<Col span={2}>
						Wind: {units === 'us' ? Math.round(weather.windSpeed) : Math.round(weather.windSpeed * 3.6)} {units === 'us' ? 'mph' : 'kph'} <WindIcon degree={weather.windBearing}/>
					</Col>
					<Col span={2}><span>Humidity: {weather.humidity * 100} <i className="wi wi-humidity"/></span></Col>
					<Col span={3}>Pressure: {Math.round(weather.pressure)} {units === 'us' ? 'mb' : 'hPa'}</Col>
					<Col span={2}>Dew Point: {Math.round(weather.dewPoint)} {units === 'us' ? '℉' : '℃'}</Col>
					<Col span={2}>UV Index: {weather.uvIndex}</Col>
					<Col span={2}>Visibility: {Math.round(weather.visibility)} {units === 'us' ? 'mi' : 'km'}</Col>
				</Row>
				<Row type="flex" justify="center" className='current-weather-location'>
					{location}
				</Row>
				<Row type="flex" justify="center">
					<Col span={1}>
						<WeatherIcon icon={weather.icon} size='3rem'/>
					</Col>
					<Col span={3}>
						<div>{moment.unix(weather.time).utcOffset(timezone.offset).format('YYYY-MM-DD HH:mm')}</div>
						<div>{weather.summary} {Math.round(weather.temperature)}{units === 'us' ? '℉' : '℃'}</div>
						<div className='current-weather-sub-content'>Feels
							like {Math.round(weather.apparentTemperature)}{units === 'us' ? '℉' : '℃'}</div>
					</Col>
				</Row>
			</div>
		);
	}
}
