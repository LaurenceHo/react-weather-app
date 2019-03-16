import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import * as React from 'react';
import { connect } from 'react-redux';

import { Utils } from '../utils';
import { Weather } from './data-model';
import { MoonIcon } from './icon/moon-icon';
import { WeatherIcon } from './icon/weather-icon';

export class DailyForecast extends React.Component<any, any> {
  render() {
    const {timezone, dailyForecast, filter} = this.props;
    
    const renderDailyForecast = dailyForecast.data.map((f: Weather, i: number) =>
      <Row type='flex' justify='center' className='daily-forecast-item-wrapper' key={f.time}>
        <Col span={1}>
          <WeatherIcon icon={f.icon} size='1.6rem'/>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          {i === 0 ? 'Today' : Utils.getLocalTime(f.time, timezone.offset, 'ddd')}
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          <i className='wi wi-sunrise'/>
          <div className='daily-forecast-item-font'>
            @{Utils.getLocalTime(f.sunriseTime, timezone.offset, 'HH:mm')}
          </div>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          <i className='wi wi-sunset'/>
          <div className='daily-forecast-item-font'>
            @{Utils.getLocalTime(f.sunsetTime, timezone.offset, 'HH:mm')}
          </div>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          <div style={{fontSize: '1.8rem'}}>
            <MoonIcon moonPhase={f.moonPhase} latitude={timezone.latitude}/>
          </div>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          {Utils.getTemperature(f.temperatureLow, filter.units)}
          <div className='daily-forecast-item-font'>
            @{Utils.getLocalTime(f.temperatureLowTime, timezone.offset, 'ha')}
          </div>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          {Utils.getTemperature(f.temperatureHigh, filter.units)}
          <div className='daily-forecast-item-font'>
            @{Utils.getLocalTime(f.temperatureHighTime, timezone.offset, 'ha')}
          </div>
        </Col>
        <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={3} className='daily-forecast-item-column'>
            <span>
              {Utils.getRain(f.precipIntensity, f.precipProbability, filter.units)} <i className='wi wi-humidity'/>
            </span>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
            <span>
              {Math.round(f.humidity * 100)} <i className='wi wi-humidity'/>
            </span>
        </Col>
      </Row>
    );
    
    return (
      <div>
        <Row type='flex' justify='center' className='forecast-title'>
          7 days forecast
        </Row>
        <Row type='flex' justify='center' className='forecast-summary'>
          {dailyForecast.summary}
        </Row>
        <Row type='flex' justify='center' className='daily-forecast-item-wrapper'>
          <Col xs={3} sm={3} md={2} lg={3} xl={3} xxl={2}/>
          <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={2} className='daily-forecast-item-column'>
            Sun
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1}>
            Moon
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
            Low
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
            High
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={3} className='daily-forecast-item-column'>
            Rain
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
            Humidity
          </Col>
        </Row>
        {renderDailyForecast}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    filter: state.filter,
    timezone: state.timezone,
    dailyForecast: state.dailyForecast
  };
};

export default connect(mapStateToProps)(DailyForecast);
