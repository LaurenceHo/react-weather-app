import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import * as React from 'react';
import { connect } from 'react-redux';
import { Utils } from '../utils';
import { WeatherIcon } from './icon/weather-icon';
import { WindIcon } from './icon/wind-icon';

export class CurrentWeather extends React.Component<any, any> {
  render() {
    const {weather, location, timezone, units} = this.props;
    
    return (
      <div>
        <Row type='flex' justify='center' className='current-weather-top'>
          <Col xs={4} sm={4} md={4} lg={3} xl={3}>
            <span>
              Rain: {Utils.getRain(weather.precipIntensity, weather.precipProbability, units)}
              <i className='wi wi-humidity'/>
            </span>
          </Col>
          <Col xs={3} sm={3} md={3} lg={2} xl={2}>
            Wind: {Utils.getWindSpeed(weather.windSpeed, units)} <WindIcon degree={weather.windBearing}/>
          </Col>
          <Col xs={3} sm={3} md={3} lg={2} xl={2}><span>Humidity: {Math.round(weather.humidity * 100)} <i
            className='wi wi-humidity'
          /></span></Col>
          <Col xs={4} sm={4} md={4} lg={3} xl={3}>Pressure: {Utils.getPressure(weather.pressure, units)}</Col>
          <Col xs={3} sm={3} md={3} lg={2} xl={2}>Dew Point: {Utils.getTemperature(weather.dewPoint, units)}</Col>
          <Col xs={3} sm={3} md={3} lg={2} xl={2}>UV Index: {weather.uvIndex}</Col>
          <Col xs={3} sm={3} md={3} lg={2} xl={2}>Visibility: {Utils.getDistance(weather.visibility, units)}</Col>
        </Row>
        <Row type='flex' justify='center' className='current-weather-location'>
          {location}
        </Row>
        <Row type='flex' justify='center'>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1}>
            <WeatherIcon icon={weather.icon} size='4rem'/>
          </Col>
          <Col span={3}>
            <div style={{paddingTop: '1rem'}}>
              <div>{Utils.getLocalTime(weather.time, timezone.offset, 'YYYY-MM-DD HH:mm')}</div>
              <div>{weather.summary} {Utils.getTemperature(weather.temperature, units)}</div>
              <div>Feels like {Utils.getTemperature(weather.apparentTemperature, units)}</div>
            </div>
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
