import { Alert, Col, Row, Spin } from 'antd/lib';
import { isEmpty, isUndefined } from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGeocode } from '../api';
import { USE_DEFAULT_LOCATION } from '../constants/message';
import { RootState, WeatherMapState } from '../constants/types';

export const WeatherMap: React.FC<any> = () => {
  const filter = useSelector((state: RootState) => state.weather.filter);
  const location = useSelector((state: RootState) => state.weather.location);
  const timezone = useSelector((state: RootState) => state.weather.timezone);

  const [searchedLocation, setSearchedLocation] = React.useState(filter.searchedLocation);
  const [weatherMapState, setWeatherMapState] = React.useState<WeatherMapState>({
    latitude: 0,
    longitude: 0,
    location: '',
    isLoading: false,
    error: '',
  });

  const renderMap = () => {
    try {
      const weatherMap = document.getElementById('windy');
      weatherMap.parentNode.removeChild(weatherMap);
    } catch (err) {}

    const divElement: HTMLDivElement = document.createElement('div');
    divElement.setAttribute('id', 'windy');
    divElement.setAttribute('class', 'windy');
    document.getElementById('weather-map-wrapper').appendChild(divElement);

    const options = {
      key: 'bRpzkzPp38FdrEGhYHWBzBf8lT3mIPSw',
      lat: weatherMapState.latitude,
      lon: weatherMapState.longitude,
    };

    windyInit(options, (windyAPI: any) => {
      const { map } = windyAPI;
      map.options.minZoom = 4;
      map.options.maxZoom = 17;

      const topLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 12,
        maxZoom: 17,
      }).addTo(map);
      topLayer.setOpacity('0');

      map.on('zoomend', () => {
        if (map.getZoom() >= 12) {
          topLayer.setOpacity('1');
        } else {
          topLayer.setOpacity('0');
        }
      });
      map.setZoom(10);

      L.popup()
        .setLatLng([weatherMapState.latitude, weatherMapState.longitude])
        .setContent(weatherMapState.location)
        .openOn(map);
    });
  };

  const fetchLatitudeAndLongitude = (lat: number, lon: number, city: string) => {
    if (lat !== 0 && lon !== 0) {
      setWeatherMapState({
        latitude: lat,
        longitude: lon,
        location: city,
        isLoading: false,
        error: '',
      });
      renderMap();
    } else {
      getGeocode(null, null, city)
        .then((geocode: any) => {
          if (geocode.status === 'OK') {
            setWeatherMapState({
              latitude: geocode.latitude,
              longitude: geocode.longitude,
              location: city,
              isLoading: false,
              error: '',
            });
            renderMap();
          }
        })
        .catch(error => setWeatherMapState({ ...weatherMapState, error }));
    }
  };

  /**
   * Only be called when error occurs
   * @param {string} message
   */
  const searchByDefaultLocation = (message: string) => {
    setWeatherMapState({ ...weatherMapState, error: message });
    setTimeout(() => {
      fetchLatitudeAndLongitude(-36.8484597, 174.7633315, 'Auckland');
    }, 5000);
  };

  useEffect(() => {
    const { latitude, longitude } = timezone || {};
    if (isUndefined(latitude) || isUndefined(longitude)) {
      setWeatherMapState({ ...weatherMapState, isLoading: true });
      // Get user's coordinates when user access the web app, it will ask user's location permission
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      const handleLocation = (location: any) => {
        getGeocode(location.coords.latitude, location.coords.longitude, '')
          .then((geocode: any) => {
            if (geocode.status === 'OK') {
              setWeatherMapState({
                latitude: geocode.latitude,
                longitude: geocode.longitude,
                location: geocode.address,
                isLoading: false,
                error: '',
              });
              renderMap();
            }
          })
          .catch(error => searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`));
      };

      const handleError = (error: any) => searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`);

      if (process.env.NODE_ENV === 'development') {
        searchByDefaultLocation(USE_DEFAULT_LOCATION);
      } else {
        navigator.geolocation.getCurrentPosition(handleLocation, handleError, options);
      }
    } else {
      setWeatherMapState({ ...weatherMapState, latitude, longitude, location });
      renderMap();
    }
  }, []);

  useEffect(() => {
    if (filter.searchedLocation !== searchedLocation) {
      setWeatherMapState({ ...weatherMapState, isLoading: true });
      fetchLatitudeAndLongitude(0, 0, filter.searchedLocation);
      setSearchedLocation(filter.searchedLocation);
    }
  });

  return (
    <div>
      {weatherMapState.isLoading ? (
        <Row type='flex' justify='center' className='fetching-weather-content'>
          <h2>Fetching location</h2>
          <Spin className='fetching-weather-spinner' size='large' />
        </Row>
      ) : !isEmpty(weatherMapState.error) ? (
        <div>
          <Row type='flex' justify='center' className='fetching-weather-content'>
            <Col xs={24} sm={24} md={18} lg={16} xl={16}>
              <Alert message='Error' description={weatherMapState.error} type='error' showIcon={true} />
            </Col>
          </Row>
        </div>
      ) : (
        <div id='weather-map-wrapper' />
      )}
    </div>
  );
};
