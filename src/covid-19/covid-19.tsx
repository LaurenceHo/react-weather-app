import Alert from 'antd/es/alert';
import BackTop from 'antd/es/back-top';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Spin from 'antd/es/spin';
import clsx from 'clsx';
import * as echarts from 'echarts/lib/echarts';
import { isEmpty, last } from 'lodash';
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
  const [isLoadingState, setIsloadingState] = React.useState(true);
  const [errorState, setErrorState] = React.useState(null);
  const [covidState, setCovidState] = React.useState(null);

  useEffect(() => {
    fetch(CLOUD_URL)
      .then((response: any): any => response.json())
      .then((data: any) => {
        setCovidState(data);
        setIsloadingState(false);
      })
      .catch((error) => {
        setIsloadingState(false);
        setErrorState(error);
      });
  }, []);

  useEffect(() => {
    if (!isLoadingState && !isEmpty(covidState)) {
      let totalCases = 0;
      Object.keys(covidState.location).forEach((key) => {
        totalCases += covidState.location[key];
      });
      let aucklandCases = 0;
      let wellingtonCases = 0;
      let waikatoCases = 0;
      let whanganuiCases = 0;
      let canterburyCases = 0;
      const mapData: any = [];
      mapData.push(['Region', 'Cases']);

      Object.keys(covidState.location).forEach((key) => {
        if (key === 'Auckland' || key === 'Counties Manukau' || key === 'Waitemata') {
          // Auckland region
          aucklandCases += covidState.location[key];
        } else if (key === 'Capital and Coast' || key === 'Hutt Valley' || key === 'Wairarapa') {
          // Wellington region
          wellingtonCases += covidState.location[key];
        } else if (key === 'Waikato' || key === 'Lakes') {
          // Waikato region
          waikatoCases += covidState.location[key];
        } else if (key === 'Whanganui' || key === 'MidCentral') {
          // Manawatu-Whanganui region
          whanganuiCases += covidState.location[key];
        } else if (key === 'Canterbury' || key === 'South Canterbury') {
          // Canterbury region
          canterburyCases += covidState.location[key];
        } else if (key === 'Tairāwhiti' || key === 'Southern') {
          // Gisborne region and Otago Southland region
          mapData.push([key === 'Tairāwhiti' ? 'Gisborne' : 'Otago Southland', covidState.location[key]]);
        } else {
          mapData.push([key, covidState.location[key]]);
        }
      });
      mapData.push(['Auckland', aucklandCases]);
      mapData.push(['Wellington', wellingtonCases]);
      mapData.push(['Waikato', waikatoCases]);
      mapData.push(['Manawatu-Whanganui', whanganuiCases]);
      mapData.push(['Canterbury', canterburyCases]);

      const drawRegionsMap = () => {
        const data = google.visualization.arrayToDataTable(mapData);

        const options = {
          sizeAxis: { minValue: 0, maxValue: 100 },
          region: 'NZ',
          displayMode: 'markers',
          colorAxis: { colors: ['#e7711c', '#4374e0'] }, // orange to blue
          resolution: 'provinces',
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
          dailyChart.setOption(dailyChartConfig(covidState.daily));

          pieChart = echarts.init(covidPieDivElement);
          pieChart.setOption(pieChartConfig(covidState.ages, covidState.ethnicity));
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
          <Row type='flex' justify='center' gutter={16}>
            <Col sm={6} md={6} lg={4} xl={4} xxl={3} className='covid-cases-card'>
              <Card title='Total Confirmed'>
                <div className='covid-cases-card-content'>{last(covidState.daily)['totalConfirmed']}</div>
              </Card>
            </Col>
            <Col sm={6} md={6} lg={4} xl={4} xxl={3} className='covid-cases-card'>
              <Card title='Total Cases'>
                <div className='covid-cases-card-content'>
                  {last(covidState.daily)['totalConfirmed'] + last(covidState.daily)['totalProbable']}
                </div>
              </Card>
            </Col>
            <Col sm={6} md={6} lg={4} xl={4} xxl={3} className='covid-cases-card'>
              <Card title='Total Recovered'>
                <div className={clsx('covid-recovered-cases-content', 'covid-cases-card-content')}>
                  {last(covidState.daily)['totalRecovered']}
                </div>
              </Card>
            </Col>
            <Col sm={6} md={6} lg={4} xl={4} xxl={3} className='covid-cases-card'>
              <Card title='Total Death'>
                <div className={clsx('covid-death-cases-content', 'covid-cases-card-content')}>
                  {last(covidState.daily)['totalDeath']}
                </div>
              </Card>
            </Col>
          </Row>
          <Row type='flex' justify='center' style={{ padding: '1rem 0' }}>
            [<a href='#covid-pie-wrapper'>Age, Gender and Ethnicity Groups</a>] [<a href='#new-zealand-map'>Map</a>]
          </Row>
          <Row type='flex' justify='center' id='covid-chart-wrapper' />
          <Row type='flex' justify='center' id='covid-pie-wrapper' />
          <Row type='flex' justify='center' id='new-zealand-map' />
          <Row type='flex' justify='center'>
            <Col span={24} className={clsx('covid-cases-card', 'last-updated')}>
              Last updated: {covidState.lastUpdated}
            </Col>
          </Row>
        </>
      )}
      <BackTop />
    </div>
  );
};
