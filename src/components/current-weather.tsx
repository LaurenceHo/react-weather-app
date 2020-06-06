import Col from 'antd/es/col';
import Row from 'antd/es/row';
import * as React from 'react';
import { Filter, Timezone, Weather } from '../constants/types';
import { Utils } from '../utils';
import { WeatherIcon } from './icon/weather-icon';
import { WindIcon } from './icon/wind-icon';

interface CurrentWeatherProps {
  filter: Filter;
  location: string;
  currentWeather: Weather;
  timezone: Timezone;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  filter,
  location,
  timezone,
  currentWeather,
}: CurrentWeatherProps) => {
  return (
    <div>
      <Row justify='center' className='current-weather-top'>
        <Col xs={8} sm={6} md={6} lg={4}>
          <div className='current-weather-top-item'>
            Rain: {Utils.getRain(currentWeather.precipIntensity, currentWeather.precipProbability, filter.units)}
          </div>
        </Col>
        <Col xs={8} sm={6} md={6} lg={3}>
          <div className='current-weather-top-item'>
            Wind: {Utils.getWindSpeed(currentWeather.windSpeed, filter.units)}{' '}
            <WindIcon degree={currentWeather.windBearing} />
          </div>
        </Col>
        <Col xs={8} sm={6} md={6} lg={3}>
          <div className='current-weather-top-item'>
            Humidity: {Math.round(currentWeather.humidity * 100)} <i className='wi wi-humidity' />
          </div>
        </Col>
        <Col xs={8} sm={6} md={6} lg={4}>
          <div className='current-weather-top-item'>
            Pressure: {Utils.getPressure(currentWeather.pressure, filter.units)}
          </div>
        </Col>
        <Col xs={8} sm={8} md={8} lg={3}>
          <div className='current-weather-top-item'>
            Dew Point: {Utils.getTemperature(currentWeather.dewPoint, filter.units)}
          </div>
        </Col>
        <Col xs={8} sm={8} md={8} lg={3}>
          <div className='current-weather-top-item'>UV Index: {currentWeather.uvIndex}</div>
        </Col>
        <Col xs={6} sm={8} md={8} lg={3}>
          <div className='current-weather-top-item'>
            Visibility: {Utils.getDistance(currentWeather.visibility, filter.units)}
          </div>
        </Col>
      </Row>
      <Row justify='center' className='current-weather-location'>
        {location}
      </Row>
      <Row justify='center'>
        <Col xs={3} sm={3} md={2} lg={2} xl={1} className='current-weather-icon'>
          <WeatherIcon icon={currentWeather.icon} size={!Utils.isMobile() ? '4rem' : '3rem'} />
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={4}>
          <div className='current-weather-summary'>
            <div>{Utils.getLocalTime(currentWeather.time, timezone.offset, 'YYYY-MM-DD HH:mm')}</div>
            <div>
              {currentWeather.summary} {Utils.getTemperature(currentWeather.temperature, filter.units)}
            </div>
            <div>Feels like {Utils.getTemperature(currentWeather.apparentTemperature, filter.units)}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
