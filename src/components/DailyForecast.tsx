import { Col, Row } from 'antd';
import * as React from 'react';
import * as moment from 'moment';

import { Timezone, Weather } from './DataModel';
import { WeatherIcon } from './icon/WeatherIcon';

interface DailyForecastPropTypes {
	timezone: Timezone,
	units: string,
	daily: any
}


export class DailyForecast extends React.Component<DailyForecastPropTypes, any> {
	render() {
		const { timezone, daily, units } = this.props;

		const renderDailyForecast = daily.data.map((f: Weather, i: number) =>
			<Row type="flex" justify="center" className='daily-forecast-item-wrapper' key={f.time}>
				<Col span={1}>
					<WeatherIcon icon={f.icon} size='1.6rem'/>
				</Col>
				<Col span={2} className='daily-forecast-item-column'>
					{i === 0 ? 'Today' : moment.unix(f.time).utcOffset(timezone.offset).format('ddd')}
				</Col>
				<Col span={1} className='daily-forecast-item-column'>
					{Math.round(f.temperatureLow)}{units === 'us' ? '℉' : '℃'}
					<div className='daily-forecast-item-font'>
						@{moment.unix(f.temperatureLowTime).utcOffset(timezone.offset).format('ha')}
					</div>
				</Col>
				<Col span={1} className='daily-forecast-item-column'>
					{Math.round(f.temperatureHigh)}{units === 'us' ? '℉' : '℃'}
					<div className='daily-forecast-item-font'>
						@{moment.unix(f.temperatureHighTime).utcOffset(timezone.offset).format('ha')}
					</div>
				</Col>
				<Col span={3} className='daily-forecast-item-column'>
					<span>
						{Math.round(f.precipProbability * 100)} <i className="wi wi-humidity"/> / {f.precipIntensity.toFixed(2)} {units === 'us' ? 'in' : 'mm'}
					</span>
				</Col>
				<Col span={1} className='daily-forecast-item-column'>
					<span>
						{Math.round(f.humidity * 100)} <i className="wi wi-humidity"/>
					</span>
				</Col>
			</Row>
		);

		return (
			<div>
				<Row type="flex" justify="center" className='forecast-title'>
					7 days forecast
				</Row>
				<Row type="flex" justify="center" className='forecast-summary'>
					{daily.summary}
				</Row>
				<Row type="flex" justify="center" className='daily-forecast-item-wrapper'>
					<Col span={1}/>
					<Col span={2}/>
					<Col span={1} className='daily-forecast-item-column'>
						Low
					</Col>
					<Col span={1} className='daily-forecast-item-column'>
						High
					</Col>
					<Col span={3} className='daily-forecast-item-column'>
						Rain
					</Col>
					<Col span={1} className='daily-forecast-item-column'>
						Humidity
					</Col>
				</Row>
				{renderDailyForecast}
			</div>
		)
	}
};
