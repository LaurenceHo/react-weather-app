import { Table } from 'antd';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Column from 'antd/lib/table/Column';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import * as React from 'react';
import { connect } from 'react-redux';

import { Utils } from '../utils';
import { Weather } from './data-model';
import { MoonIcon } from './icon/moon-icon';
import { WeatherIcon } from './icon/weather-icon';

export class DailyForecast extends React.Component<any, any> {
  render() {
    const { timezone, dailyForecast, filter } = this.props;

    const renderDailyForecastTable = () => (
      <Table dataSource={dailyForecast.data}>
        <Column
          dataIndex='icon'
          key='icon'
          render={icon => (
            <span>
              <WeatherIcon icon={icon} size='1.6rem' />
            </span>
          )}
        />
        <Column
          dataIndex='time'
          key='time'
          render={time => <span>{Utils.getLocalTime(time, timezone.offset, 'ddd')}</span>}
        />
        <ColumnGroup title='Sun'>
          <Column
            dataIndex='sunriseTime'
            key='sunriseTime'
            render={sunriseTime => (
              <span>
                <i className='wi wi-sunrise' />
                <div className='daily-forecast-item-font'>
                  @{Utils.getLocalTime(sunriseTime, timezone.offset, 'HH:mm')}
                </div>
              </span>
            )}
          />
          <Column
            dataIndex='sunsetTime'
            key='sunsetTime'
            render={sunsetTime => (
              <span>
                <i className='wi wi-sunset' />
                <div className='daily-forecast-item-font'>
                  @{Utils.getLocalTime(sunsetTime, timezone.offset, 'HH:mm')}
                </div>
              </span>
            )}
          />
        </ColumnGroup>
        <Column
          title='Moon'
          dataIndex='moonPhase'
          key='moonPhase'
          render={moonPhase => (
            <span>
              <MoonIcon moonPhase={moonPhase} latitude={timezone.latitude} size='1.8rem' />
            </span>
          )}
        />
        <Column
          title='Low'
          key='temperatureLow'
          render={(text, data: any) => (
            <span>
              {Utils.getTemperature(data.temperatureLow, filter.units)}
              <div className='daily-forecast-item-font'>
                @{Utils.getLocalTime(data.temperatureLowTime, timezone.offset, 'ha')}
              </div>
            </span>
          )}
        />
        <Column
          title='High'
          key='temperatureHigh'
          render={(text, data: any) => (
            <span>
              {Utils.getTemperature(data.temperatureHigh, filter.units)}
              <div className='daily-forecast-item-font'>
                @{Utils.getLocalTime(data.temperatureHighTime, timezone.offset, 'ha')}
              </div>
            </span>
          )}
        />
        <Column
          title='Rain'
          key='precipProbability'
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
          render={humidity => (
            <span>
              {Math.round(humidity * 100)} <i className='wi wi-humidity' />
            </span>
          )}
        />
      </Table>
    );

    const renderDailyForecast = dailyForecast.data.map((f: Weather, i: number) => (
      <Row type='flex' justify='center' className='daily-forecast-item-wrapper' key={f.time}>
        <Col span={1}>
          <WeatherIcon icon={f.icon} size='1.6rem' />
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          {i === 0 ? 'Today' : Utils.getLocalTime(f.time, timezone.offset, 'ddd')}
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          <i className='wi wi-sunrise' />
          <div className='daily-forecast-item-font'>@{Utils.getLocalTime(f.sunriseTime, timezone.offset, 'HH:mm')}</div>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          <i className='wi wi-sunset' />
          <div className='daily-forecast-item-font'>@{Utils.getLocalTime(f.sunsetTime, timezone.offset, 'HH:mm')}</div>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          <MoonIcon moonPhase={f.moonPhase} latitude={timezone.latitude} size='1.8rem' />
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
            {Utils.getRain(f.precipIntensity, f.precipProbability, filter.units)} <i className='wi wi-humidity' />
          </span>
        </Col>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={1} className='daily-forecast-item-column'>
          <span>
            {Math.round(f.humidity * 100)} <i className='wi wi-humidity' />
          </span>
        </Col>
      </Row>
    ));

    return (
      <div>
        <Row type='flex' justify='center' className='forecast-title'>
          7 days forecast
        </Row>
        <Row type='flex' justify='center' className='forecast-summary'>
          {dailyForecast.summary}
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
    dailyForecast: state.dailyForecast,
  };
};

export default connect(mapStateToProps)(DailyForecast);
