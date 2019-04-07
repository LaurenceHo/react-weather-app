import location from '../sample/location.json';
import weatherSi from '../sample/weather-si.json';
import weatherUs from '../sample/weather-us.json';
import { Forecast } from './components/data-model';

declare var process: {
  env: {
    NODE_ENV: string;
  };
};

const CLOUD_FUNCTION_URL = 'https://us-central1-react-beautiful-weather-app.cloudfunctions.net/';

const checkStatus = (response: any): any => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
};

const parseJSON = (response: any): any => response.json();

export const getGeocode = (latitude: number, longitude: number, address: string): Promise<any> => {
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve: any) => setTimeout(resolve, 1000, location));
  } else {
    const requestUrl =
      `${CLOUD_FUNCTION_URL}getGeocode?lat=${latitude}&lon=${longitude}&address=` + encodeURIComponent(address);
    return fetch(requestUrl)
      .then(checkStatus)
      .then(parseJSON)
      .then((data: any) => data)
      .catch((error: any) => console.error('request failed', error));
  }
};

export const getWeather = (latitude: number, longitude: number, exclude: string, units: string): Promise<Forecast> => {
  if (process.env.NODE_ENV === 'development') {
    if (units === 'us') {
      return new Promise((resolve: any) => setTimeout(resolve, 1000, weatherUs));
    } else {
      return new Promise((resolve: any) => setTimeout(resolve, 1000, weatherSi));
    }
  } else {
    const requestUrl =
      `${CLOUD_FUNCTION_URL}getWeather?lat=${latitude}&lon=${longitude}&` +
      `exclude=${encodeURIComponent(exclude)}&units=${encodeURIComponent(units)}`;
    return fetch(requestUrl)
      .then(checkStatus)
      .then(parseJSON)
      .then((data: any) => data)
      .catch((error: any) => console.error('request failed', error));
  }
};

export const getForecast = (
  latitude: number,
  longitude: number,
  time: number,
  exclude: string,
  units: string
): Promise<Forecast> => {
  if (process.env.NODE_ENV === 'development') {
    if (units === 'us') {
      return new Promise((resolve: any) => setTimeout(resolve, 1000, weatherUs));
    } else {
      return new Promise((resolve: any) => setTimeout(resolve, 1000, weatherSi));
    }
  } else {
    const requestUrl =
      `${CLOUD_FUNCTION_URL}getForecast?lat=${latitude}&lon=${longitude}&time=${time}` +
      `&exclude=${encodeURIComponent(exclude)}&units=${encodeURIComponent(units)}`;
    return fetch(requestUrl)
      .then(checkStatus)
      .then(parseJSON)
      .then((data: any) => data)
      .catch((error: any) => console.error('request failed', error));
  }
};
