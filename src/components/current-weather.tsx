import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import * as React from 'react';
import { connect } from 'react-redux';

import { Utils } from '../utils';
import { WeatherIcon } from './icon/weather-icon';
import { WindIcon } from './icon/wind-icon';

export class CurrentWeather extends React.Component<any, any> {
  render() {
    const { weather, location, timezone, filter } = this.props;

    return (
      <div>
        <Row type='flex' justify='center' className='current-weather-top'>
          <Col xs={8} sm={6} md={6} lg={4}>
            <div className='current-weather-top-item'>
              Rain: {Utils.getRain(weather.precipIntensity, weather.precipProbability, filter.units)}
            </div>
          </Col>
          <Col xs={8} sm={6} md={6} lg={3}>
            <div className='current-weather-top-item'>
              Wind: {Utils.getWindSpeed(weather.windSpeed, filter.units)} <WindIcon degree={weather.windBearing} />
            </div>
          </Col>
          <Col xs={8} sm={6} md={6} lg={3}>
            <div className='current-weather-top-item'>
              Humidity: {Math.round(weather.humidity * 100)} <i className='wi wi-humidity' />
            </div>
          </Col>
          <Col xs={8} sm={6} md={6} lg={4}>
            <div className='current-weather-top-item'>
              Pressure: {Utils.getPressure(weather.pressure, filter.units)}
            </div>
          </Col>
          <Col xs={8} sm={8} md={8} lg={3}>
            <div className='current-weather-top-item'>
              Dew Point: {Utils.getTemperature(weather.dewPoint, filter.units)}
            </div>
          </Col>
          <Col xs={8} sm={8} md={8} lg={3}>
            <div className='current-weather-top-item'>UV Index: {weather.uvIndex}</div>
          </Col>
          <Col xs={6} sm={8} md={8} lg={3}>
            <div className='current-weather-top-item'>
              Visibility: {Utils.getDistance(weather.visibility, filter.units)}
            </div>
          </Col>
        </Row>
        <Row type='flex' justify='center' className='current-weather-location'>
          {location}
        </Row>
        <Row type='flex' justify='center'>
          <Col xs={3} sm={3} md={2} lg={2} xl={1} className='current-weather-icon'>
            <WeatherIcon icon={weather.icon} size={!Utils.isMobile() ? '4rem' : '3rem'} />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <div className='current-weather-summary'>
              <div>{Utils.getLocalTime(weather.time, timezone.offset, 'YYYY-MM-DD HH:mm')}</div>
              <div>
                {weather.summary} {Utils.getTemperature(weather.temperature, filter.units)}
              </div>
              <div>Feels like {Utils.getTemperature(weather.apparentTemperature, filter.units)}</div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    filter: state.weather.filter,
    location: state.weather.location,
    weather: state.weather.weather,
    forecast: state.weather.forecast,
    timezone: state.weather.timezone,
    isLoading: state.weather.isLoading,
    error: state.weather.error,
  };
};

export default connect(mapStateToProps)(CurrentWeather);
