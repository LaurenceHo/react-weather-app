import { ForecastState } from '../constants/types';
import * as ACTION from './actions';

const initialState: ForecastState = {
  isLoading: false,
  filter: {
    units: 'si',
    searchedLocation: '',
    timestamp: 0,
  },
  location: '',
  timezone: null,
  currentWeather: null,
  hourlyForecast: null,
  dailyForecast: null,
  error: '',
};

export const reducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case ACTION.FETCHING_DATA:
      return {
        ...state,
        isLoading: true,
        error: '',
      };

    case ACTION.FETCHING_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case ACTION.FETCHING_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case ACTION.SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };

    case ACTION.SET_LOCATION:
      return {
        ...state,
        location: action.location,
      };

    case ACTION.SET_TIMEZONE:
      return {
        ...state,
        timezone: action.timezone,
      };

    case ACTION.SET_CURRENT_WEATHER:
      return {
        ...state,
        currentWeather: action.currentWeather,
      };

    case ACTION.SET_HOURLY_FORECAST:
      return {
        ...state,
        hourlyForecast: action.hourlyForecast,
      };

    case ACTION.SET_DAILY_FORECAST:
      return {
        ...state,
        dailyForecast: action.dailyForecast,
      };

    default:
      return state;
  }
};
