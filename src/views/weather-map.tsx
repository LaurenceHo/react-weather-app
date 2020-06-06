import Alert from 'antd/es/alert';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Spin from 'antd/es/spin';
import { isEmpty, isUndefined } from 'lodash';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGeocode } from '../api';
import { ApiKey } from '../constants/api-key';
import { USE_DEFAULT_LOCATION } from '../constants/message';
import { GeoCode, RootState, WeatherMapState } from '../constants/types';
import { getWeatherData } from '../store/actions';

const usePrevious = (value: any) => {
  const ref = useRef<any>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const WeatherMap: React.FC<any> = () => {
  const dispatch = useDispatch();

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
  const prevState = usePrevious(weatherMapState);

  const renderMap = () => {
    try {
      const weatherMap = document.getElementById('windy');
      weatherMap.parentNode.removeChild(weatherMap);
    } catch (err) {
      console.log('map does not exist');
    }

    const divElement: HTMLDivElement = document.createElement('div');
    divElement.setAttribute('id', 'windy');
    divElement.setAttribute('class', 'windy');
    document.getElementById('weather-map-wrapper').appendChild(divElement);
    const options = {
      key: ApiKey.windy,
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

  const fetchLatitudeAndLongitude = async (lat: number, lon: number, city: string) => {
    if (lat !== 0 && lon !== 0) {
      setWeatherMapState({
        latitude: lat,
        longitude: lon,
        location: city,
        isLoading: false,
        error: '',
      });
    } else {
      try {
        const geocode: GeoCode = await getGeocode(null, null, city);
        if (geocode.status === 'OK') {
          setWeatherMapState({
            latitude: geocode.latitude,
            longitude: geocode.longitude,
            location: geocode.address,
            isLoading: false,
            error: '',
          });
          dispatch(getWeatherData(geocode.latitude, geocode.longitude, geocode.address));
        }
      } catch (error) {
        setWeatherMapState({ ...weatherMapState, error: error.message });
      }
    }
  };

  /**
   * Only be called when error occurs
   * @param {string} message
   */
  const searchByDefaultLocation = (message: string) => {
    setWeatherMapState({ ...weatherMapState, error: message });
    setTimeout(async () => {
      await fetchLatitudeAndLongitude(-36.8484597, 174.7633315, 'Auckland');
    }, 5000);
  };

  // Do initialise data, get user's location at first
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

      const handleLocation = async (location: any) => {
        try {
          const geocode: GeoCode = await getGeocode(location.coords.latitude, location.coords.longitude, '');
          if (geocode.status === 'OK') {
            setWeatherMapState({
              latitude: geocode.latitude,
              longitude: geocode.longitude,
              location: geocode.address,
              isLoading: false,
              error: '',
            });
            renderMap();
            dispatch(getWeatherData(geocode.latitude, geocode.longitude, geocode.address));
          }
        } catch (error) {
          searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`);
        }
      };

      const handleError = (error: any) => searchByDefaultLocation(`${error.message}.${USE_DEFAULT_LOCATION}`);

      if (process.env.NODE_ENV === 'development') {
        searchByDefaultLocation(USE_DEFAULT_LOCATION);
      } else {
        navigator.geolocation.getCurrentPosition(handleLocation, handleError, options);
      }
    } else {
      setWeatherMapState({ ...weatherMapState, latitude, longitude, location });
    }
  }, []);

  useEffect(() => {
    if (
      weatherMapState.latitude !== 0 &&
      weatherMapState.longitude !== 0 &&
      (weatherMapState.latitude !== prevState.latitude || weatherMapState.longitude !== prevState.longitude)
    ) {
      renderMap();
    }

    if (filter.searchedLocation !== searchedLocation) {
      setWeatherMapState({ ...weatherMapState, isLoading: true });
      fetchLatitudeAndLongitude(0, 0, filter.searchedLocation);
      setSearchedLocation(filter.searchedLocation);
    }
  });

  return (
    <div>
      {weatherMapState.isLoading ? (
        <Row justify='center' className='fetching-weather-content'>
          <Spin className='fetching-weather-spinner' size='large' />
          <h2 className='loading-text'>Fetching location...</h2>
        </Row>
      ) : !isEmpty(weatherMapState.error) ? (
        <div>
          <Row justify='center' className='fetching-weather-content'>
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
