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

    const renderDailyForecastTable = () => (
      <Table dataSource={dailyForecast.data} pagination={false} rowKey={(data: any) => data.time}>
        <Column
          dataIndex='icon'
          key='icon'
          align='center'
          render={icon => (
            <span>
              <WeatherIcon icon={icon} size='1.6rem' />
            </span>
          )}
        />
        <Column
          dataIndex='time'
          key='time'
          align='center'
          render={(time, data, index) => (
            <span>{index === 0 ? 'Today' : Utils.getLocalTime(time, timezone.offset, 'ddd')}</span>
          )}
        />
        <Column
          title='Sunrise'
          dataIndex='sunriseTime'
          key='sunriseTime'
          align='center'
          render={sunriseTime => (
            <span>
              <i className='wi wi-sunrise' />
              <div className='daily-forecast-item'>@{Utils.getLocalTime(sunriseTime, timezone.offset, 'HH:mm')}</div>
            </span>
          )}
        />
        <Column
          title='Sunset'
          dataIndex='sunsetTime'
          key='sunsetTime'
          align='center'
          render={sunsetTime => (
            <span>
              <i className='wi wi-sunset' />
              <div className='daily-forecast-item'>@{Utils.getLocalTime(sunsetTime, timezone.offset, 'HH:mm')}</div>
            </span>
          )}
        />
        <Column
          title='Moon'
          dataIndex='moonPhase'
          key='moonPhase'
          align='center'
          render={moonPhase => (
            <span>
              <MoonIcon moonPhase={moonPhase} latitude={timezone.latitude} size='1.8rem' />
            </span>
          )}
        />
        <Column
          title='Low'
          key='temperatureLow'
          align='center'
          render={(text, data: any) => (
            <span>
              {Utils.getTemperature(data.temperatureLow, filter.units)}
              <div className='daily-forecast-item'>
                @{Utils.getLocalTime(data.temperatureLowTime, timezone.offset, 'ha')}
              </div>
            </span>
          )}
        />
        <Column
          title='High'
          key='temperatureHigh'
          align='center'
          render={(text, data: any) => (
            <span>
              {Utils.getTemperature(data.temperatureHigh, filter.units)}
              <div className='daily-forecast-item'>
                @{Utils.getLocalTime(data.temperatureHighTime, timezone.offset, 'ha')}
              </div>
            </span>
          )}
        />
        <Column
          title='Rain'
          key='precipProbability'
          align='center'
          render={(text, data: any) => (
            <span>
              {Utils.getRain(data.precipIntensity, data.precipProbability, filter.units)}{' '}
              <i className='wi wi-humidity' />
            </span>
          )}
        />
        <Column
          title='Humidity'
          dataIndex='humidity'
          key='humidity'
          align='center'
          render={humidity => (
            <span>
              {Math.round(humidity * 100)} <i className='wi wi-humidity' />
            </span>
          )}
        />
      </Table>
    );

    return (
      <div>
        <Row type='flex' justify='center' className='forecast-title'>
          7 days forecast
        </Row>
        <Row type='flex' justify='center' className='forecast-summary'>
          {dailyForecast.summary}
        </Row>
        <Row type='flex' justify='center' className='daily-forecast-table-outer'>
          <Col xs={24} sm={24} md={16} lg={16} xl={12} xxl={10}>
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
