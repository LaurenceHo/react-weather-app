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
import { coordinates } from '../constants/coordinates';
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

  const renderMapbox = () => {
    const features: {
      type: 'Feature';
      geometry: {
        type: 'Point';
        coordinates: number[];
      };
      properties: {
        region: string;
        case: number;
        percentage: number;
      };
    }[] = [];

    let totalCases = 0;
    Object.keys(covidState.location).forEach((key) => {
      totalCases += covidState.location[key];
    });

    const caseByRegion = {
      Auckland: 0,
      Wellington: 0,
      Waikato: 0,
      'Manawatu-Whanganui': 0,
      Canterbury: 0,
    };

    Object.keys(covidState.location).forEach((key) => {
      if (key === 'Auckland' || key === 'Counties Manukau' || key === 'Waitemata') {
        // Auckland region
        caseByRegion['Auckland'] += covidState.location[key];
      } else if (key === 'Capital and Coast' || key === 'Hutt Valley' || key === 'Wairarapa') {
        // Wellington region
        caseByRegion['Wellington'] += covidState.location[key];
      } else if (key === 'Waikato' || key === 'Lakes') {
        // Waikato region
        caseByRegion['Waikato'] += covidState.location[key];
      } else if (key === 'Whanganui' || key === 'MidCentral') {
        // Manawatu-Whanganui region
        caseByRegion['Manawatu-Whanganui'] += covidState.location[key];
      } else if (key === 'Canterbury' || key === 'South Canterbury') {
        // Canterbury region
        caseByRegion['Canterbury'] += covidState.location[key];
      } else {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: find(coordinates, (coordinate) =>
              key === 'Tairāwhiti'
                ? coordinate.region === 'Gisborne'
                : key === 'Southern'
                ? coordinate.region === 'Otago Southland'
                : coordinate.region === key
            ).coordinates,
          },
          properties: {
            region: key === 'Tairāwhiti' ? 'Gisborne' : key === 'Southern' ? 'Otago Southland' : key,
            case: covidState.location[key],
            percentage: Math.ceil((covidState.location[key] / totalCases) * 100),
          },
        });
      }
    });

    Object.keys(caseByRegion).forEach((region) => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: find(coordinates, (coordinate) => coordinate.region === region).coordinates,
        },
        properties: {
          region: region,
          case: caseByRegion[region],
          percentage: Math.ceil((caseByRegion[region] / totalCases) * 100),
        },
      });
    });

    mapboxgl.accessToken = ApiKey.mapbox;
    const map = new mapboxgl.Map({
      container: 'new-zealand-map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [173.295319, -41.288483], // [lng, lat], Nelson
      zoom: 5,
    });
    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    map.on('load', () => {
      map.addSource('covidCases', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      // Add a layer showing the places.
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

      // Add a layer showing the number of cases.
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

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on('mouseenter', 'covidCases', (event: any) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        const coordinates = event.features[0].geometry.coordinates.slice();
        const description = `<strong>${event.features[0].properties.region}</strong>: ${event.features[0].properties.case} cases, ${event.features[0].properties.percentage}%`;
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on('mouseleave', 'covidCases', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
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
