import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Table from 'antd/es/table';
import Column from 'antd/es/table/Column';
import * as React from 'react';
import { Filter, Timezone, Weather } from '../constants/types';
import { Utils } from '../utils';
import { MoonIcon } from './icon/moon-icon';
import { WeatherIcon } from './icon/weather-icon';
import { WindIcon } from './icon/wind-icon';

interface DailyForecastProps {
  filter: Filter;
  timezone: Timezone;
  dailyForecast: {
    summary: string;
    icon: string;
    data: Weather[];
  };
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  filter,
  timezone,
  dailyForecast,
}: DailyForecastProps) => {
  const isMobile = Utils.isMobile();

  const expandedRowRender = (data: Weather) => (
    <div>
      <Row>
        <div className='daily-forecast-sub-item-wrapper'>
          <div className='daily-forecast-sub-item-summary'>{data.summary}</div>
        </div>
      </Row>
      <Row justify='center'>
        <Col span={8} lg={4} xl={4} xxl={4} className='daily-forecast-sub-item-wrapper'>
          <div className='daily-forecast-sub-item-summary'>Sunrise</div>
          <div className='daily-forecast-item'>
            <i className='wi wi-sunrise' />
            <div>@{Utils.getLocalTime(data.sunriseTime, timezone.offset, 'HH:mm')}</div>
          </div>
        </Col>
        <Col span={8} lg={4} xl={4} xxl={4} className='daily-forecast-sub-item-wrapper'>
          <div className='daily-forecast-sub-item-summary'>Sunset</div>
          <div className='daily-forecast-item'>
            <i className='wi wi-sunset' />
            <div>@{Utils.getLocalTime(data.sunsetTime, timezone.offset, 'HH:mm')}</div>
          </div>
        </Col>
        <Col span={8} lg={4} xl={4} xxl={4} className='daily-forecast-sub-item-wrapper'>
          <div className='daily-forecast-sub-item-summary'>Moon</div>
          <MoonIcon moonPhase={data.moonPhase} latitude={timezone.latitude} size='1.8rem' />
        </Col>
        {!isMobile ? (
          <Col span={6} className='daily-forecast-sub-item-wrapper'>
            <div className='daily-forecast-sub-item-summary'>Rain</div>
            <div className='daily-forecast-item'>
              {Utils.getRain(data.precipIntensity, data.precipProbability, filter.units)}
            </div>
          </Col>
        ) : null}
        {!isMobile ? (
          <Col span={6} className='daily-forecast-sub-item-wrapper'>
            <div className='daily-forecast-sub-item-summary'>Humidity</div>
            <div className='daily-forecast-item'>
              {Math.round(data.humidity * 100)} <i className='wi wi-humidity' />
            </div>
          </Col>
        ) : null}
      </Row>
      {isMobile ? (
        <Row justify='center'>
          <Col span={12} className='daily-forecast-sub-item-wrapper'>
            <div className='daily-forecast-sub-item-summary'>Rain</div>
            <div className='daily-forecast-item'>
              {Utils.getRain(data.precipIntensity, data.precipProbability, filter.units)}
            </div>
          </Col>
          <Col span={12} className='daily-forecast-sub-item-wrapper'>
            <div className='daily-forecast-sub-item-summary'>Humidity</div>
            <div className='daily-forecast-item'>
              {Math.round(data.humidity * 100)} <i className='wi wi-humidity' />
            </div>
          </Col>
        </Row>
      ) : null}
    </div>
  );

  const renderDailyForecastTable = () => (
    <Table
      dataSource={dailyForecast.data}
      pagination={false}
      rowKey={(data: Weather) => String(data.time)}
      expandedRowRender={expandedRowRender}>
      <Column
        dataIndex='icon'
        key='icon'
        align='center'
        width='5rem'
        render={(icon) => (
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
        title='Low'
        key='temperatureLow'
        align='center'
        width='7rem'
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
        width='7rem'
        render={(text, data: any) => (
          <div className='daily-forecast-item'>
            {Utils.getTemperature(data.temperatureHigh, filter.units)}
            <div>@{Utils.getLocalTime(data.temperatureHighTime, timezone.offset, 'ha')}</div>
          </div>
        )}
      />
      <Column
        title='Wind'
        key='windSpeed'
        align='center'
        width='7rem'
        render={(text, data: any) => (
          <div className='daily-forecast-item'>
            {Utils.getWindSpeed(data.windSpeed, filter.units)} <WindIcon size='1.2rem' degree={data.windBearing} />
          </div>
        )}
      />
    </Table>
  );

  return (
    <div>
      <Row justify='center' className='forecast-title'>
        {dailyForecast.data.length} days forecast
      </Row>
      <Row justify='center' className='forecast-summary'>
        {dailyForecast.summary}
      </Row>
      <Row justify='center' className='daily-forecast-table-outer'>
        <Col xs={24} sm={20} md={16} lg={12} xl={10} xxl={8}>
          {renderDailyForecastTable()}
        </Col>
      </Row>
    </div>
  );
};
