export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS';
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE';

export const SET_FILTER = 'SET_FILTER';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_TIMEZONE = 'SET_TIMEZONE';

export const SET_WEATHER = 'SET_WEATHER';
export const SET_HOURLY_FORECAST = 'SET_HOURLY_FORECAST';
export const SET_DAILY_FORECAST = 'SET_DAILY_FORECAST';

export const fetchingData = () => {
  return {
    type: FETCHING_DATA
  };
};

export const fetchingDataSuccess = () => {
  return {
    type: FETCHING_DATA_SUCCESS
  };
};

export const fetchingDataFailure = (error: string) => {
  return {
    type: FETCHING_DATA_FAILURE,
    error
  };
};

export const setFilter = (filter: any) => {
  return {
    type: SET_FILTER,
    filter
  };
};

export const setLocation = (location: string) => {
  return {
    type: SET_LOCATION,
    location
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
