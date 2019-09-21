import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getGeocode, getWeatherByTime } from '../api';
import { Forecast, RootState, Timezone } from '../constants/types';

export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS';
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE';

export const SET_FILTER = 'SET_FILTER';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_TIMEZONE = 'SET_TIMEZONE';

export const SET_CURRENT_WEATHER = 'SET_CURRENT_WEATHER';
export const SET_HOURLY_FORECAST = 'SET_HOURLY_FORECAST';
export const SET_DAILY_FORECAST = 'SET_DAILY_FORECAST';

export const setFilter = (filter: any) => {
  return {
    type: SET_FILTER,
    filter,
  };
};

const setLocation = (location: string) => {
  return {
    type: SET_LOCATION,
    location,
  };
};

const setTimezone = (timezone: any) => {
  return {
    type: SET_TIMEZONE,
    timezone,
  };
};

const setCurrentWeather = (currentWeather: any) => {
  return {
    type: SET_CURRENT_WEATHER,
    currentWeather,
  };
};

const setHourlyForecast = (hourlyForecast: any) => {
  return {
    type: SET_HOURLY_FORECAST,
    hourlyForecast,
  };
};

const setDailyForecast = (dailyForecast: any) => {
  return {
    type: SET_DAILY_FORECAST,
    dailyForecast,
  };
};

export const fetchingData = () => {
  return {
    type: FETCHING_DATA,
  };
};

const fetchingDataSuccess = () => {
  return {
    type: FETCHING_DATA_SUCCESS,
  };
};

export const fetchingDataFailure = (error: string) => {
  return {
    type: FETCHING_DATA_FAILURE,
    error,
  };
};

const EXCLUDE = 'flags,minutely';

/**
 * If you set lat along with lon, then you must set city name as well, otherwise set (0, 0, city)
 * @param {number} lat
 * @param {number} lon
 * @param {string} city
 */
export const getWeatherData = (lat: number, lon: number, city: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>, getState: any) => {
    dispatch(fetchingData());
    if (lat !== 0 && lon !== 0) {
      getWeatherByTime(lat, lon, getState().weather.filter.timestamp, EXCLUDE, getState().weather.filter.units)
        .then((results: Forecast) => {
          const timezone: Timezone = {
            timezone: results.timezone,
            offset: results.offset,
            latitude: results.latitude,
            longitude: results.longitude,
          };
          dispatch(setLocation(city));
          dispatch(setTimezone(timezone));
          dispatch(setCurrentWeather(results.currently));
          dispatch(setHourlyForecast(results.hourly));
          dispatch(setDailyForecast(results.daily));
          dispatch(fetchingDataSuccess());
        })
        .catch(error => dispatch(fetchingDataFailure(error)));
    } else {
      // Get coordinates by city at first, after that get the weather and forecast info by coordinates
      getGeocode(null, null, city)
        .then((geocode: any) => {
          if (geocode.status === 'OK') {
            dispatch(getWeatherData(geocode.latitude, geocode.longitude, geocode.city));
          }
        })
        .catch(error => dispatch(fetchingDataFailure(error)));
    }
  };
};
