import Alert from 'antd/es/alert';
import BackTop from 'antd/es/back-top';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Spin from 'antd/es/spin';
import clsx from 'clsx';
import * as echarts from 'echarts/lib/echarts';
import { find, isEmpty, last } from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { ApiKey } from '../constants/api-key';
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

  const coordinates: { region: string; coordinates: number[] }[] = [
    // North Island
    { region: 'Auckland', coordinates: [174.762301, -36.848779] },
    { region: 'Bay of Plenty', coordinates: [176.731423, -38.044809] },
    { region: 'Gisborne', coordinates: [177.916522, -38.544078] },
    { region: "Hawke's Bay", coordinates: [176.7416374, -39.1089867] },
    { region: 'Manawatu-Whanganui', coordinates: [175.4375574, -39.7273356] },
    { region: 'Northland', coordinates: [173.7624053, -35.5795461] },
    { region: 'Taranaki', coordinates: [174.4382721, -39.3538149] },
    { region: 'Waikato', coordinates: [175.250159, -37.777292] },
    { region: 'Wellington', coordinates: [175.377054, -41.193314] },
    // South Island
    { region: 'Canterbury', coordinates: [171.1637245, -43.7542275] },
    { region: 'Nelson Marlborough', coordinates: [173.4216613, -41.57269] },
    { region: 'Otago Southland', coordinates: [169.177806, -45.362409] },
    { region: 'West Coast', coordinates: [171.3399414, -42.6919232] },
  ];

  const renderMapbox = () => {
    const features: {
      type: 'Feature';
      geometry: {
        type: 'Point';
        coordinates: number[];
      };
      properties: {
        id: string;
        case: number;
      };
    }[] = [];

    let aucklandCases = 0;
    let wellingtonCases = 0;
    let waikatoCases = 0;
    let whanganuiCases = 0;
    let canterburyCases = 0;

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
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: find(coordinates, (coordinate) =>
              key === 'Tairāwhiti' ? coordinate.region === 'Gisborne' : coordinate.region === 'Otago Southland'
            ).coordinates,
          },
          properties: { id: key === 'Tairāwhiti' ? 'Gisborne' : 'Otago Southland', case: covidState.location[key] },
        });
      } else {
        // features.push([key, covidState.location[key]]);
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: find(coordinates, (coordinate) => coordinate.region === key).coordinates,
          },
          properties: { id: key, case: covidState.location[key] },
        });
      }
    });
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: find(coordinates, (coordinate) => coordinate.region === 'Auckland').coordinates,
      },
      properties: { id: 'Auckland', case: aucklandCases },
    });
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: find(coordinates, (coordinate) => coordinate.region === 'Waikato').coordinates,
      },
      properties: { id: 'Waikato', case: waikatoCases },
    });
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: find(coordinates, (coordinate) => coordinate.region === 'Manawatu-Whanganui').coordinates,
      },
      properties: { id: 'Manawatu-Whanganui', case: whanganuiCases },
    });
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: find(coordinates, (coordinate) => coordinate.region === 'Wellington').coordinates,
      },
      properties: { id: 'Wellington', case: wellingtonCases },
    });
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: find(coordinates, (coordinate) => coordinate.region === 'Canterbury').coordinates,
      },
      properties: { id: 'Canterbury', case: canterburyCases },
    });

    mapboxgl.accessToken = ApiKey.mapbox;
    const map = new mapboxgl.Map({
      container: 'new-zealand-map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [173.295319, -41.288483], // [lng, lat], Nelson
      zoom: 5,
    });

    map.on('load', () => {
      map.addSource('covidCases', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      map.addLayer({
        id: 'regions',
        type: 'circle',
        source: 'covidCases',
        paint: {
          'circle-color': ['interpolate', ['linear'], ['get', 'case'], 1, '#FCA107', 300, '#7F3121'],
          'circle-opacity': 0.6,
          'circle-radius': ['interpolate', ['linear'], ['get', 'case'], 1, 10, 300, 40],
        },
      });

      map.addLayer({
        id: 'cases-count',
        type: 'symbol',
        source: 'covidCases',
        layout: {
          'text-field': '{case}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': 'rgba(0,0,0,0.5)',
        },
      });
    });
  };

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
      renderChart();
      renderMapbox();
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
          <div style={{ display: 'flex', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
            <div>Total Cases by Regions</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div id='new-zealand-map' />
          </div>
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
