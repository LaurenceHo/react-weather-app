import { Spin } from 'antd';
import Row from 'antd/lib/row';
import * as echarts from 'echarts/lib/echarts';
import * as React from 'react';
import { useEffect } from 'react';
import { dailyChartConfig, pieChartConfig } from './chart-config';
import { isEmpty } from 'lodash';

declare let process: {
  env: {
    NODE_ENV: string;
  };
};

const CLOUD_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/covidData'
    : 'https://covid19nz.s3.amazonaws.com/covid-19.json';

export const Covid19: React.FC = () => {
  const [isLoadingState, setIsloadingState] = React.useState(false);
  const [covidDailyState, setCovidDailyState] = React.useState(null);

  useEffect(() => {
    setIsloadingState(true);
    fetch(CLOUD_URL)
      .then((response: any): any => response.json())
      .then((data: any) => {
        setCovidDailyState(data);
        setIsloadingState(false);
      })
      .catch((error) => setIsloadingState(false));
  }, []);

  useEffect(() => {
    if (!isLoadingState && !isEmpty(covidDailyState)) {
      const renderChart = () => {
        try {
          const covidChart = document.getElementById('covid-daily-chart');
          covidChart.parentNode.removeChild(covidChart);
        } catch (err) {}

        // Generate div element dynamically for ECharts
        const covidDailyDivElement: HTMLDivElement = document.createElement('div');
        covidDailyDivElement.setAttribute('id', 'covid-daily-chart');
        covidDailyDivElement.setAttribute('class', 'covid-daily-chart');
        document.getElementById('covid-chart-wrapper').appendChild(covidDailyDivElement);

        const covidPieDivElement: HTMLDivElement = document.createElement('div');
        covidPieDivElement.setAttribute('id', 'covid-pie-chart');
        covidPieDivElement.setAttribute('class', 'covid-pie-chart');
        document.getElementById('covid-pie-wrapper').appendChild(covidPieDivElement);

        let dailyChart = echarts.getInstanceByDom(covidDailyDivElement);
        let pieChart = echarts.getInstanceByDom(covidPieDivElement);
        if (!dailyChart && !pieChart) {
          dailyChart = echarts.init(covidDailyDivElement);
          dailyChart.setOption(dailyChartConfig(covidDailyState.daily));

          pieChart = echarts.init(covidPieDivElement);
          pieChart.setOption(pieChartConfig(covidDailyState.ages));
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
        <>
          <Row type='flex' justify='center' id='covid-chart-wrapper' />
          <Row type='flex' justify='center' id='covid-pie-wrapper' />
        </>
      )}
    </div>
  );
};
