import Alert from 'antd/es/alert';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Spin from 'antd/es/spin';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGeocode } from '../api';
import { CurrentWeather } from '../components/current-weather';
import { DailyForecast } from '../components/daily-forecast';
import { HourlyForecast } from '../components/hourly-forecast';
import { USE_DEFAULT_LOCATION } from '../constants/message';
import { Filter, GeoCode, RootState } from '../constants/types';
import { fetchingData, fetchingDataFailure, getWeatherData } from '../store/actions';

export const WeatherMain: React.FC<any> = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state: RootState) => state.weather.isLoading);
  const filter = useSelector((state: RootState) => state.weather.filter);
  const location = useSelector((state: RootState) => state.weather.location);
  const timezone = useSelector((state: RootState) => state.weather.timezone);
  const currentWeather = useSelector((state: RootState) => state.weather.currentWeather);
  const hourlyForecast = useSelector((state: RootState) => state.weather.hourlyForecast);
  const dailyForecast = useSelector((state: RootState) => state.weather.dailyForecast);
  const error = useSelector((state: RootState) => state.weather.error);

  const [filterState, setFilterState] = React.useState<Filter>(filter);

  const searchByDefaultLocation = (message: string) => {
    dispatch(fetchingDataFailure(message));
    setTimeout(() => {
      dispatch(getWeatherData(-36.8484597, 174.7633315, 'Auckland'));
    }, 5000);
  };

  useEffect(() => {
    if (isEmpty(location) && isEmpty(currentWeather) && isEmpty(hourlyForecast) && isEmpty(dailyForecast)) {
      dispatch(fetchingData());
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
    }
  }, []);

  useEffect(() => {
    // When user search weather by city name
    if (filter.searchedLocation !== filterState.searchedLocation) {
      dispatch(getWeatherData(0, 0, filter.searchedLocation));
      setFilterState({ ...filterState, searchedLocation: filter.searchedLocation });
    }
    // When user change units
    if (filter.units !== filterState.units) {
      if (timezone.latitude && timezone.longitude) {
        dispatch(getWeatherData(timezone.latitude, timezone.longitude, location));
      } else {
        dispatch(getWeatherData(0, 0, location));
      }
      setFilterState({ ...filterState, units: filter.units });
    }

    // When user search weather by particular time
    if (filter.timestamp !== filterState.timestamp) {
      dispatch(getWeatherData(timezone.latitude, timezone.longitude, location));
      setFilterState({ ...filterState, timestamp: filter.timestamp });
    }
  });

  const renderWeatherAndForecast = () => {
    if (error) {
      return (
        <div>
          <Row justify='center' className='fetching-weather-content'>
            <Col xs={24} sm={24} md={18} lg={16} xl={16}>
              <Alert message='Error' description={error} type='error' showIcon={true} />
            </Col>
          </Row>
        </div>
      );
    } else if (currentWeather && location) {
      return (
        <div>
          <CurrentWeather location={location} filter={filter} timezone={timezone} currentWeather={currentWeather} />
          <HourlyForecast filter={filter} timezone={timezone} hourlyForecast={hourlyForecast} />
          <DailyForecast filter={filter} timezone={timezone} dailyForecast={dailyForecast} />
        </div>
      );
    }
  };

  return (
    <div>
      {isLoading ? (
        <Row justify='center' className='fetching-weather-content'>
          <Spin className='fetching-weather-spinner' size='large' />
          <h2 className='loading-text'>Loading...</h2>
        </Row>
      ) : (
        renderWeatherAndForecast()
      )}
    </div>
  );
};
