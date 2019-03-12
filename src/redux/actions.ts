export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS';
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE';

export const SET_UNITS = 'SET_UNITS';
export const SET_TIMESTAMP = 'SET_TIMESTAMP';
export const SET_TIMEZONE = 'SET_TIMEZONE';

export const SET_WEATHER = 'SET_WEATHER';
export const SET_HOURLY_FORECAST = 'SET_HOURLY_FORECAST';
export const SET_DAILY_FORECAST = 'SET_DAILY_FORECAST';

export const fetchingData = (location: string) => {
  return {
    type: FETCHING_DATA,
    location
  };
};

export const fetchingDataSuccess = () => {
  return {
    type: FETCHING_DATA_SUCCESS,
  };
};

export const fetchingDataFailure = (error: string) => {
  return {
    type: FETCHING_DATA_FAILURE,
    error
  };
};

export const setUnits = (units: string) => {
  return {
    type: SET_UNITS,
    units
  };
};

export const setTimestamp = (timestamp: number) => {
  return {
    type: SET_TIMESTAMP,
    timestamp
  };
};

export const setTimezone = (timezone: any) => {
  return {
    type: SET_TIMEZONE,
    timezone
  };
};

export const setWeather = (weather: any) => {
  return {
    type: SET_WEATHER,
    weather
  };
};

export const setHourlyForecast = (hourlyForecast: any) => {
  return {
    type: SET_HOURLY_FORECAST,
    hourlyForecast
  };
};

export const setDailyForecast = (dailyForecast: any) => {
  return {
    type: SET_DAILY_FORECAST,
    dailyForecast
  };
};
