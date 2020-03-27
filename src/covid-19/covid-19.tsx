import { Spin } from 'antd';
import Row from 'antd/lib/row';
import * as echarts from 'echarts/lib/echarts';
import * as React from 'react';
import { useEffect } from 'react';
import { chartConfig } from './chart-config';
import { isEmpty } from 'lodash';

export const Covid19: React.FC = () => {
  const [isLoadingState, setIsloadingState] = React.useState(false);
  const [covidDailyState, setCovidDailyState] = React.useState(null);

  useEffect(() => {
    setIsloadingState(true);
    fetch('https://covid19nz.s3.amazonaws.com/covid-19-daily.json')
      .then((response: any): any => response.json())
      .then((data: any) => {
        setCovidDailyState(data);
        setIsloadingState(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoadingState && !isEmpty(covidDailyState)) {
      const renderChart = () => {
        try {
          const covidChart = document.getElementById('covid-daily-chart');
          covidChart.parentNode.removeChild(covidChart);
        } catch (err) {}

        // Generate div element dynamically for ECharts
        const divElement: HTMLDivElement = document.createElement('div');
        divElement.setAttribute('id', 'covid-daily-chart');
        divElement.setAttribute('class', 'covid-daily-chart');
        document.getElementById('covid-daily-chart-wrapper').appendChild(divElement);

        let chart = echarts.getInstanceByDom(divElement);
        if (!chart) {
          chart = echarts.init(divElement);
          chart.setOption(chartConfig(covidDailyState));
        }
      };
      renderChart();
    }
  });

  return (
    <div>
      <Row type='flex' justify='center' className='covid-title'>
        Covid-19 in New Zealand
      </Row>
      {isLoadingState ? (
        <Row type='flex' justify='center' className='fetching-weather-content'>
          <Spin className='fetching-weather-spinner' size='large' />
          <h2>Loading...</h2>
        </Row>
      ) : (
        <Row type='flex' justify='center' id='covid-daily-chart-wrapper' />
      )}
    </div>
  );
};
