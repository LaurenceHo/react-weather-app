import { Row } from 'antd';
import * as React from 'react';
import * as echarts from 'echarts/lib/echarts';

import { chartConfig } from './ChartConfig';
import { Timezone } from './DataModel';

interface HourlyForecastPropTypes {
	timezone: Timezone,
	units: string,
	hourly: any
}

export class HourlyForecast extends React.Component<HourlyForecastPropTypes, any> {
	componentDidMount() {
		this.renderChart();
	}

	renderChart = () => {
		// Generate div element dynamically for ECharts
		const divElement: HTMLDivElement = document.createElement('div');
		divElement.setAttribute('id', 'weather-chart');
		divElement.setAttribute('class', 'weather-chart');
		document.getElementById('weather-chart-wrapper').appendChild(divElement);

		let chart = echarts.getInstanceByDom(divElement);
		if (!chart) {
			chart = echarts.init(divElement, null, { renderer: 'canvas' });
		}

		chart.setOption(
			chartConfig(this.props.units, this.props.timezone, this.props.hourly)
		);
	};

	render() {
		const { hourly } = this.props;
		return (
			<div>
				<Row type="flex" justify="center" className='forecast-summary'>
					{hourly.summary}
				</Row>
				<Row type="flex" justify="center" id='weather-chart-wrapper'/>
			</div>
		)
	}
}
