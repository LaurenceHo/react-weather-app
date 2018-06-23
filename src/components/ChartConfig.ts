import * as _ from 'lodash';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import * as moment from 'moment';

import { Timezone } from './DataModel';


export const chartConfig: any = (units: string, timezone: Timezone, hourly: any) => {
	const formatterXAxisLabel = (value: number, index: number) => {
		if (index === 0) {
			return 'Now';
		}
		return moment.unix(value).utcOffset(timezone.offset).format('HH:mm').toString();
	};

	const formatterTooltip = (params: any) => {
		const temperature = params[0];
		const rain = params[1];
		const time = moment.unix(temperature.name).utcOffset(timezone.offset).format('YYYY-MM-DD HH:mm').toString();

		return `
    <div style="font-size:1rem; color:#949494; line-height:1.1rem;">${time}</div></br>
    <div style="color:#2E2E2E; font-size:14px; font-weight:500;	line-height: 16px;">Temperature: ${temperature.value}${units === 'us' ? '℉' : '℃'}</div></br>
    <div style="color:#2E2E2E; font-size:14px; font-weight:500;	line-height: 16px;">Rain: ${rain.value} ${units === 'us' ? 'in' : 'mm'}</div>
   `;
	};

	const temperatureMax = (Math.round(Math.max.apply(null, _.map(hourly.data, 'temperature')) / 10) + 1.5) * 10;
	const rainMax = Math.max.apply(null, _.map(hourly.data, 'precipIntensity'));

	return {
		legend: {
			data: ['Temperature', 'Rain'],
			right: '10%'
		},
		xAxis: {
			type: 'category',
			data: _.map(hourly.data, 'time').slice(0, 23),
			axisLabel: {
				formatter: formatterXAxisLabel
			}
		},
		yAxis: [
			{
				type: 'value',
				max: temperatureMax,
				axisLabel: {
					formatter: units === 'us' ? '{value} ℉' : '{value} ℃'
				},
				splitLine: {
					show: false
				},
				splitArea: {
					show: true,
					areaStyle: {
						color: ['rgba(255,255,255,0.3)', 'rgba(200,200,200,0.1)']
					}
				}
			},
			{
				type: 'value',
				min: 0,
				max: rainMax,
				axisLabel: {
					formatter: units === 'us' ? '{value} in' : '{value} mm'
				}
			}
		],
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#FFF',
			borderWidth: 1,
			borderColor: '#ccc',
			padding: [8, 17],
			extraCssText: 'box-shadow: 0 2px 4px 0 #CDCDCD;',
			formatter: formatterTooltip,
			axisPointer: {
				lineStyle: {
					color: '#666666',
					type: 'dashed'
				}
			},
		},
		series: [
			{
				name: 'Temperature',
				data: _.map(hourly.data, 'temperature').slice(0, 23),
				type: 'line',
				smooth: true,
				lineStyle: {
					color: '#1869b7',
					width: 2
				},
				itemStyle: {
					color: '#1869b7',
				},
			},
			{
				name: 'Rain',
				type: 'bar',
				data: _.map(hourly.data, 'precipIntensity').slice(0, 23),
				yAxisIndex: 1,
				itemStyle: {
					color: '#A4A4A4'
				}
			}
		]
	};
};
