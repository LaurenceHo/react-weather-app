import { Col, Row } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { Utils } from '../utils';
import { WeatherIcon } from './icon/WeatherIcon';
import { WindIcon } from './icon/WindIcon';

export class CurrentWeather extends React.Component<any, any> {
  render() {
    const {weather, location, timezone, units} = this.props;
    
    return (
      <div>
        <Row type='flex' justify='center' className='current-weather-top'>
          <Col span={3}>
            <span>
              Rain: {Utils.getRain(weather.precipIntensity, weather.precipProbability, units)}
              <i className='wi wi-humidity'/>
            </span>
          </Col>
          <Col span={2}>
            Wind: {Utils.getWindSpeed(weather.windSpeed, units)} <WindIcon degree={weather.windBearing}/>
          </Col>
          <Col span={2}><span>Humidity: {Math.round(weather.humidity * 100)} <i
            className='wi wi-humidity'
          /></span></Col>
          <Col span={3}>Pressure: {Utils.getPressure(weather.pressure, units)}</Col>
          <Col span={2}>Dew Point: {Utils.getTemperature(weather.dewPoint, units)}</Col>
          <Col span={2}>UV Index: {weather.uvIndex}</Col>
          <Col span={2}>Visibility: {Utils.getDistance(weather.visibility, units)}</Col>
        </Row>
        <Row type='flex' justify='center' className='current-weather-location'>
          {location}
        </Row>
        <Row type='flex' justify='center'>
          <Col span={1}>
            <WeatherIcon icon={weather.icon} size='3rem'/>
          </Col>
          <Col span={3}>
            <div>{Utils.getLocalTime(weather.time, timezone.offset, 'YYYY-MM-DD HH:mm')}</div>
            <div>{weather.summary} {Utils.getTemperature(weather.temperature, units)}</div>
            <div className='current-weather-sub-content'>
              Feels like {Utils.getTemperature(weather.apparentTemperature, units)}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    units: state.units,
    filter: state.filter,
    location: state.location,
    weather: state.weather,
    forecast: state.forecast,
    timezone: state.timezone,
    isLoading: state.isLoading,
    error: state.error
  };
};

export default connect(mapStateToProps)(CurrentWeather);
