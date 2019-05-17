import { Table } from 'antd';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Column from 'antd/lib/table/Column';
import * as React from 'react';
import { connect } from 'react-redux';

import { Utils } from '../utils';
import { MoonIcon } from './icon/moon-icon';
import { WeatherIcon } from './icon/weather-icon';

export class DailyForecast extends React.Component<any, any> {
  render() {
    const { timezone, dailyForecast, filter } = this.props;
    const isMobile = Utils.isMobile();
    const scroll = isMobile ? { x: '130%', y: '100%' } : {};

    const renderDailyForecastTable = () => (
      <Table dataSource={dailyForecast.data} pagination={false} rowKey={(data: any) => data.time} scroll={scroll}>
        <Column
          dataIndex='icon'
          key='icon'
          align='center'
          width='5rem'
          render={icon => (
            <div>
              <WeatherIcon icon={icon} size='1.6rem' />
            </div>
          )}
        />
        <Column
          title='Date'
          dataIndex='time'
          key='time'
          align='center'
          width='5rem'
          render={(time, data, index) => (
            <div className='daily-forecast-item'>
              {index === 0 ? 'Today' : Utils.getLocalTime(time, timezone.offset, 'ddd')}
            </div>
          )}
        />
        <Column
          title='Sunrise'
          dataIndex='sunriseTime'
          key='sunriseTime'
          align='center'
          width='9rem'
          render={sunriseTime => (
            <div className='daily-forecast-item'>
              <i className='wi wi-sunrise' />
              <div>@{Utils.getLocalTime(sunriseTime, timezone.offset, 'HH:mm')}</div>
            </div>
          )}
        />
        <Column
          title='Sunset'
          dataIndex='sunsetTime'
          key='sunsetTime'
          align='center'
          width='9rem'
          render={sunsetTime => (
            <div className='daily-forecast-item'>
              <i className='wi wi-sunset' />
              <div>@{Utils.getLocalTime(sunsetTime, timezone.offset, 'HH:mm')}</div>
            </div>
          )}
        />
        <Column
          title='Moon'
          dataIndex='moonPhase'
          key='moonPhase'
          align='center'
          width='5.5rem'
          render={moonPhase => <MoonIcon moonPhase={moonPhase} latitude={timezone.latitude} size='1.8rem' />}
        />
        <Column
          title='Low'
          key='temperatureLow'
          align='center'
          width='8rem'
          render={(text, data: any) => (
            <div className='daily-forecast-item'>
              {Utils.getTemperature(data.temperatureLow, filter.units)}
              <div>@{Utils.getLocalTime(data.temperatureLowTime, timezone.offset, 'ha')}</div>
            </div>
          )}
        />
        <Column
          title='High'
          key='temperatureHigh'
          align='center'
          width='8rem'
          render={(text, data: any) => (
            <div className='daily-forecast-item'>
              {Utils.getTemperature(data.temperatureHigh, filter.units)}
              <div>@{Utils.getLocalTime(data.temperatureHighTime, timezone.offset, 'ha')}</div>
            </div>
          )}
        />
        <Column
          title='Rain'
          key='precipProbability'
          align='center'
          width='13rem'
          render={(text, data: any) => (
            <div className='daily-forecast-item'>
              {Utils.getRain(data.precipIntensity, data.precipProbability, filter.units)}
            </div>
          )}
        />
        <Column
          title='Humidity'
          dataIndex='humidity'
          key='humidity'
          align='center'
          width='9rem'
          render={humidity => (
            <div className='daily-forecast-item'>
              {Math.round(humidity * 100)} <i className='wi wi-humidity' />
            </div>
          )}
        />
      </Table>
    );

    return (
      <div>
        <Row type='flex' justify='center' className='forecast-title'>
          {dailyForecast.data.length} days forecast
        </Row>
        <Row type='flex' justify='center' className='forecast-summary'>
          {dailyForecast.summary}
        </Row>
        <Row type='flex' justify='center' className='daily-forecast-table-outer'>
          <Col xs={24} sm={24} md={22} lg={22} xl={16} xxl={12}>
            {renderDailyForecastTable()}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    filter: state.weather.filter,
    timezone: state.weather.timezone,
    dailyForecast: state.weather.dailyForecast,
  };
};

export default connect(mapStateToProps)(DailyForecast);
