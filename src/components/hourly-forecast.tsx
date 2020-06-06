import Row from 'antd/es/row';
import * as echarts from 'echarts/lib/echarts';
import * as React from 'react';
import { useEffect } from 'react';
import { Filter, Timezone, Weather } from '../constants/types';
import { chartConfig } from './chart-config';

interface HourlyForecastProps {
  filter: Filter;
  timezone: Timezone;
  hourlyForecast: {
    summary: string;
    icon: string;
    data: Weather[];
  };
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  filter,
  timezone,
  hourlyForecast,
}: HourlyForecastProps) => {
  useEffect(() => {
    const renderChart = () => {
      try {
        const weatherChart = document.getElementById('weather-chart');
        weatherChart.parentNode.removeChild(weatherChart);
      } catch (err) {}

      // Generate div element dynamically for ECharts
      const divElement: HTMLDivElement = document.createElement('div');
      divElement.setAttribute('id', 'weather-chart');
      divElement.setAttribute('class', 'weather-chart');
      document.getElementById('weather-chart-wrapper').appendChild(divElement);

      let chart = echarts.getInstanceByDom(divElement);
      if (!chart) {
        chart = echarts.init(divElement);
        chart.setOption(chartConfig(filter.units, timezone, hourlyForecast));
      }
    };
    renderChart();
  });

  return (
    <div>
      <Row justify='center' className='forecast-summary'>
        {hourlyForecast.summary}
      </Row>
      <Row justify='center' id='weather-chart-wrapper' />
    </div>
  );
};
