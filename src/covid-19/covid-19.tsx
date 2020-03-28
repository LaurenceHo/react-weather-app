import { Alert, Col, Row, Spin } from 'antd';
import * as echarts from 'echarts/lib/echarts';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { dailyChartConfig, pieChartConfig } from './chart-config';

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
  const [errorState, setErrorState] = React.useState(null);
  const [covidDailyState, setCovidDailyState] = React.useState(null);

  useEffect(() => {
    setIsloadingState(true);
    fetch(CLOUD_URL)
      .then((response: any): any => response.json())
      .then((data: any) => {
        setCovidDailyState(data);
        setIsloadingState(false);
      })
      .catch((error) => {
        setIsloadingState(false);
        setErrorState(error);
      });
  }, []);

  useEffect(() => {
    if (!isLoadingState && !isEmpty(covidDailyState)) {
      let totalCases = 0;
      Object.keys(covidDailyState.location).forEach((key) => {
        totalCases += covidDailyState.location[key];
      });
      let aucklandCases = 0;
      let wellingtonCases = 0;
      let waikatoCases = 0;
      let whanganuiCases = 0;
      let canterburyCases = 0;
      const mapData: any = [];
      mapData.push(['Region', 'Cases', 'Area Percentage']);

      Object.keys(covidDailyState.location).forEach((key) => {
        if (key === 'Auckland' || key === 'Counties Manukau' || key === 'Waitemata') {
          // Auckland region
          aucklandCases += covidDailyState.location[key];
        } else if (key === 'Capital and Coast' || key === 'Hutt Valley' || key === 'Wairarapa') {
          // Wellington region
          wellingtonCases += covidDailyState.location[key];
        } else if (key === 'Waikato' || key === 'Lakes') {
          // Waikato region
          waikatoCases += covidDailyState.location[key];
        } else if (key === 'Whanganui' || key === 'MidCentral') {
          // Manawatu-Whanganui region
          whanganuiCases += covidDailyState.location[key];
        } else if (key === 'Canterbury' || key === 'South Canterbury') {
          // Canterbury region
          canterburyCases += covidDailyState.location[key];
        } else if (key === 'Tairāwhiti' || key === 'Southern') {
          // Gisborne region and Otago Southland region
          mapData.push([
            key === 'Tairāwhiti' ? 'Gisborne' : 'Otago Southland',
            covidDailyState.location[key],
            Math.ceil((covidDailyState.location[key] / totalCases) * 100),
          ]);
        } else {
          mapData.push([
            key,
            covidDailyState.location[key],
            Math.ceil((covidDailyState.location[key] / totalCases) * 100),
          ]);
        }
      });
      mapData.push(['Auckland', aucklandCases, Math.ceil((aucklandCases / totalCases) * 100)]);
      mapData.push(['Wellington', wellingtonCases, Math.ceil((wellingtonCases / totalCases) * 100)]);
      mapData.push(['Waikato', waikatoCases, Math.ceil((waikatoCases / totalCases) * 100)]);
      mapData.push(['Manawatu-Whanganui', whanganuiCases, Math.ceil((whanganuiCases / totalCases) * 100)]);
      mapData.push(['Canterbury', canterburyCases, Math.ceil((canterburyCases / totalCases) * 100)]);

      const drawRegionsMap = () => {
        const data = google.visualization.arrayToDataTable(mapData);

        const options = {
          sizeAxis: { minValue: 0, maxValue: 200 },
          region: 'NZ',
          displayMode: 'markers',
          colorAxis: { colors: ['#e7711c', '#4374e0'] }, // orange to blue
        };

        const chart = new google.visualization.GeoChart(document.getElementById('new-zealand-map'));

        chart.draw(data, options);
      };
      google.charts.setOnLoadCallback(drawRegionsMap);

      const renderChart = () => {
        try {
          const covidChart = document.getElementById('covid-daily-chart');
          covidChart.parentNode.removeChild(covidChart);

          const pieChart = document.getElementById('covid-pie-chart');
          pieChart.parentNode.removeChild(pieChart);
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
      <Row type='flex' justify='center'>
        [<a href='#new-zealand-map'>Map</a>]
      </Row>
      {isLoadingState ? (
        <Row type='flex' justify='center' className='fetching-weather-content'>
          <Spin className='fetching-weather-spinner' size='large' />
          <h2>Loading...</h2>
        </Row>
      ) : !isEmpty(errorState) ? (
        <div>
          <Row type='flex' justify='center' className='fetching-weather-content'>
            <Col xs={24} sm={24} md={18} lg={16} xl={16}>
              <Alert message='Error' description={errorState} type='error' showIcon={true} />
            </Col>
          </Row>
        </div>
      ) : (
        <>
          <Row type='flex' justify='center' id='covid-chart-wrapper' />
          <Row type='flex' justify='center' id='covid-pie-wrapper' />
          <Row type='flex' justify='center' id='new-zealand-map' />
        </>
      )}
    </div>
  );
};
