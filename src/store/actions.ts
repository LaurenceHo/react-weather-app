import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getGeocode, getWeatherByTime } from '../api';
import { Filter, Forecast, GeoCode, RootState, Timezone, Weather } from '../constants/types';

export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS';
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE';

export const SET_FILTER = 'SET_FILTER';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_TIMEZONE = 'SET_TIMEZONE';

export const SET_CURRENT_WEATHER = 'SET_CURRENT_WEATHER';
export const SET_HOURLY_FORECAST = 'SET_HOURLY_FORECAST';
export const SET_DAILY_FORECAST = 'SET_DAILY_FORECAST';

export const setFilter = (filter: Filter) => {
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

const setTimezone = (timezone: Timezone) => {
  return {
    type: SET_TIMEZONE,
    timezone,
  };
};

const setCurrentWeather = (currentWeather: Weather) => {
  return {
    type: SET_CURRENT_WEATHER,
    currentWeather,
  };
};

const setHourlyForecast = (hourlyForecast: { summary: string; icon: string; data: Weather[] }) => {
  return {
    type: SET_HOURLY_FORECAST,
    hourlyForecast,
  };
};

const setDailyForecast = (dailyForecast: { summary: string; icon: string; data: Weather[] }) => {
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
 * If you set lat along with lon, you must set city name as well, otherwise set (0, 0, city)
 * @param {number} lat
 * @param {number} lon
 * @param {string} city
 */
export const getWeatherData = (lat: number, lon: number, city: string) => {
  return async (dispatch: ThunkDispatch<RootState, any, AnyAction>, getState: any) => {
    dispatch(fetchingData());
    try {
      if (lat !== 0 && lon !== 0) {
        const results: Forecast = await getWeatherByTime(
          lat,
          lon,
          getState().weather.filter.timestamp,
          EXCLUDE,
          getState().weather.filter.units
        );
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
      } else {
        // Get coordinates by city at first, after that get the weather and forecast info by coordinates
        const geocode: GeoCode = await getGeocode(null, null, city);
        if (geocode.status === 'OK') {
          await dispatch(getWeatherData(geocode.latitude, geocode.longitude, geocode.address));
        } else {
          dispatch(fetchingDataFailure('ERROR!'));
        }
      }
    } catch (error) {
      dispatch(fetchingDataFailure(error.message));
    }
  };
};
