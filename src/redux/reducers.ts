import * as ACTION from './actions';

const initialState = {
  isLoading: false,
  units: 'si',
  location: '',
  timestamp: 0,
  timezone: {},
  weather: {},
  hourlyForecast: {},
  dailyForecast: {},
  error: ''
};

export const reducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case ACTION.FETCHING_DATA:
      return {
        ...state,
        location: action.location,
        isLoading: true,
        error: ''
      };
    
    case ACTION.FETCHING_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    
    case ACTION.FETCHING_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    
    case ACTION.SET_UNITS:
      return {
        ...state,
        units: action.units
      };
    
    case ACTION.SET_TIMESTAMP:
      return {
        ...state,
        timestamp: action.timestamp
      };
    
    case ACTION.SET_TIMEZONE:
      return {
        ...state,
        timezone: action.timezone
      };
    
    case ACTION.SET_WEATHER:
      return {
        ...state,
        weather: action.weather
      };
    
    case ACTION.SET_HOURLY_FORECAST:
      return {
        ...state,
        hourlyForecast: action.hourlyForecast
      };
    
    case ACTION.SET_DAILY_FORECAST:
      return {
        ...state,
        dailyForecast: action.dailyForecast
      };
    
    default:
      return state;
  }
};
