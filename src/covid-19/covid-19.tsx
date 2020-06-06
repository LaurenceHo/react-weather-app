import Alert from 'antd/es/alert';
import BackTop from 'antd/es/back-top';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Spin from 'antd/es/spin';
import clsx from 'clsx';
import * as echarts from 'echarts/lib/echarts';
import { find, get, isEmpty, last, map } from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { ApiKey } from '../constants/api-key';
import { coordinates } from '../constants/coordinates';
import { dailyChartConfig, pieChartConfig, testsChartConfig } from './chart-config';

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
  const [largestState, setLargestState] = React.useState(0);
  const [totalCasesState, setTotalCasesState] = React.useState(0);

  const renderChart = () => {
    try {
      const covidChart = document.getElementById('covid-daily-chart');
      covidChart.parentNode.removeChild(covidChart);

      const pieChart = document.getElementById('covid-pie-chart');
      pieChart.parentNode.removeChild(pieChart);

      const testsChart = document.getElementById('covid-tests-chart');
      testsChart.parentNode.removeChild(testsChart);
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

    const covidTestsDivElement: HTMLDivElement = document.createElement('div');
    covidTestsDivElement.setAttribute('id', 'covid-tests-chart');
    covidTestsDivElement.setAttribute('class', 'covid-tests-chart');
    document.getElementById('covid-tests-wrapper').appendChild(covidTestsDivElement);

    let dailyChart = echarts.getInstanceByDom(covidDailyDivElement);
    let pieChart = echarts.getInstanceByDom(covidPieDivElement);
    let testsChart = echarts.getInstanceByDom(covidTestsDivElement);
    if (!dailyChart && !pieChart && !testsChart) {
      dailyChart = echarts.init(covidDailyDivElement);
      dailyChart.setOption(dailyChartConfig(covidState.daily));

      pieChart = echarts.init(covidPieDivElement);
      pieChart.setOption(pieChartConfig(covidState.ages, covidState.ethnicity));

      testsChart = echarts.init(covidTestsDivElement);
      testsChart.setOption(testsChartConfig(covidState.daily));
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
        totalCases: number;
        femaleCases: number;
        maleCases: number;
        unknownCases: number;
        percentage: number;
      };
    }[] = [];

    const caseByRegion = {
      Auckland: {
        total: 0,
        female: 0,
        male: 0,
        unknown: 0,
      },
      Wellington: {
        total: 0,
        female: 0,
        male: 0,
        unknown: 0,
      },
      Waikato: {
        total: 0,
        female: 0,
        male: 0,
        unknown: 0,
      },
      'Manawatu-Whanganui': {
        total: 0,
        female: 0,
        male: 0,
        unknown: 0,
      },
      Canterbury: {
        total: 0,
        female: 0,
        male: 0,
        unknown: 0,
      },
    };

    // Calculate the totalCases
    const totalCases = last(covidState.daily)['totalConfirmed'] + last(covidState.daily)['totalProbable'];
    setTotalCasesState(totalCases);

    const regionTotalCases = (key: string) => {
      return (
        get(covidState.location[key], 'female', 0) +
        get(covidState.location[key], 'male', 0) +
        get(covidState.location[key], 'unknown', 0)
      );
    };

    const getCaseDataByRegion = (caseByRegion: any, key: string, region: string) => {
      caseByRegion[region].total += regionTotalCases(key);
      caseByRegion[region].female += get(covidState.location[key], 'female', 0);
      caseByRegion[region].male += get(covidState.location[key], 'male', 0);
      caseByRegion[region].unknown += get(covidState.location[key], 'unknown', 0);
    };

    // Prepare GeoJson data
    Object.keys(covidState.location).forEach((key) => {
      if (key === 'Auckland' || key === 'Counties Manukau' || key === 'Waitemata') {
        // Auckland region
        getCaseDataByRegion(caseByRegion, key, 'Auckland');
      } else if (key === 'Capital and Coast' || key === 'Hutt Valley' || key === 'Wairarapa') {
        // Wellington region
        getCaseDataByRegion(caseByRegion, key, 'Wellington');
      } else if (key === 'Waikato' || key === 'Lakes') {
        // Waikato region
        getCaseDataByRegion(caseByRegion, key, 'Waikato');
      } else if (key === 'Whanganui' || key === 'MidCentral') {
        // Manawatu-Whanganui region
        getCaseDataByRegion(caseByRegion, key, 'Manawatu-Whanganui');
      } else if (key === 'Canterbury' || key === 'South Canterbury') {
        // Canterbury region
        getCaseDataByRegion(caseByRegion, key, 'Canterbury');
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
            totalCases: regionTotalCases(key),
            femaleCases: get(covidState.location[key], 'female', 0),
            maleCases: get(covidState.location[key], 'male', 0),
            unknownCases: get(covidState.location[key], 'unknown', 0),
            percentage: Math.ceil((regionTotalCases(key) / totalCases) * 100),
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
          totalCases: caseByRegion[region].total,
          femaleCases: caseByRegion[region].female,
          maleCases: caseByRegion[region].male,
          unknownCases: caseByRegion[region].unknown,
          percentage: Math.ceil((caseByRegion[region].total / totalCases) * 100),
        },
      });
    });

    // Find the largest number in the regions
    const largest = Math.max.apply(Math, map(features, 'properties.totalCases'));
    setLargestState(largest);

    // Initial Mapbox
    mapboxgl.accessToken = ApiKey.mapbox;
    const mapBox = new mapboxgl.Map({
      container: 'new-zealand-map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [173.295319, -41.288483], // [lng, lat], Nelson
      zoom: 5,
    });
    // disable map rotation using right click + drag
    mapBox.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    mapBox.touchZoomRotate.disableRotation();

    mapBox.on('load', () => {
      mapBox.addSource('covidCases', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      // Add a layer showing the places.
      mapBox.addLayer({
        id: 'regions',
        interactive: true,
        type: 'circle',
        source: 'covidCases',
        paint: {
          'circle-color': ['interpolate', ['linear'], ['get', 'totalCases'], 1, '#FCA107', largest, '#7F3121'],
          'circle-opacity': 0.65,
          'circle-radius': ['interpolate', ['linear'], ['get', 'totalCases'], 1, 10, largest, Math.ceil(largest / 7)],
        },
      });

      // Add a layer showing the number of cases.
      mapBox.addLayer({
        id: 'cases-count',
        type: 'symbol',
        source: 'covidCases',
        layout: {
          'text-field': '{totalCases}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': 'rgba(0,0,0,0.45)',
        },
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      mapBox.on('mouseenter', 'regions', (event: any) => {
        // Change the cursor style as a UI indicator.
        mapBox.getCanvas().style.cursor = 'pointer';

        const coordinates = event.features[0].geometry.coordinates.slice();
        const description =
          `<strong>${event.features[0].properties.region}</strong><br/>` +
          `${event.features[0].properties.totalCases} cases, ${event.features[0].properties.percentage}%<br/>` +
          `female: ${event.features[0].properties.femaleCases}, male: ${event.features[0].properties.maleCases}, unknown: ${event.features[0].properties.unknownCases}`;
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(mapBox);
      });

      mapBox.on('mouseleave', 'regions', () => {
        mapBox.getCanvas().style.cursor = '';
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
      <Row justify='center' className='covid-title'>
        Covid-19 in New Zealand
      </Row>
      {isLoadingState ? (
        <Row justify='center' className='fetching-weather-content'>
          <Spin className='fetching-weather-spinner' size='large' />
          <h2 className='loading-text'>Loading...</h2>
        </Row>
      ) : !isEmpty(errorState) ? (
        <div>
          <Row justify='center' className='fetching-weather-content'>
            <Col xs={24} sm={24} md={18} lg={16} xl={16}>
              <Alert message='Error' description={errorState} type='error' showIcon={true} />
            </Col>
          </Row>
        </div>
      ) : (
        <>
          {/* Grid */}
          <Row justify='center' gutter={16}>
            <Col sm={6} md={6} lg={4} xl={4} xxl={3} className='covid-cases-card'>
              <Card title='Total Confirmed'>
                <div className='covid-cases-card-content'>{last(covidState.daily)['totalConfirmed']}</div>
              </Card>
            </Col>
            <Col sm={6} md={6} lg={4} xl={4} xxl={3} className='covid-cases-card'>
              <Card title='Total Cases'>
                <div className='covid-cases-card-content'>{totalCasesState}</div>
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
          <Row justify='center' style={{ padding: '1rem 0' }}>
            [<a href='#covid-pie-wrapper'>Age, Gender and Ethnicity Groups</a>] [<a href='#new-zealand-map'>Map</a>] [
            <a href='#covid-tests-wrapper'>Tests v.s Cases</a>]
          </Row>
          <Row justify='center'>
            <div className='forecast-summary'>1st case on 28-02-2020</div>
          </Row>
          {/* Chart */}
          <Row justify='center' id='covid-chart-wrapper' />
          <Row justify='center' id='covid-pie-wrapper' />
          <Row justify='center' id='covid-tests-wrapper' />
          {/* Map */}
          <Row justify='center'>
            <div className='map-title'>Total Cases by Regions</div>
          </Row>
          <Row justify='center'>
            <div style={{ position: 'relative' }}>
              <div id='new-zealand-map' />
              <div className='map-legend-overlay'>
                <div className='map-legend-wrapper'>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>1</div>
                      <div>{largestState}</div>
                    </div>
                    <div className='map-legend' />
                    <div>Cases</div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
          {/* Last updated */}
          <Row justify='center'>
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
