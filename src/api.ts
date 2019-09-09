import { Forecast } from './constants/types';

declare let process: {
  env: {
    NODE_ENV: string;
  };
};

const CLOUD_FUNCTION_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://us-central1-reactjs-weather.cloudfunctions.net/';

const checkStatus = (response: any): any => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
};

const parseJSON = (response: any): any => response.json();

export const getGeocode = (latitude: number, longitude: number, address: string): Promise<any> => {
  const requestUrl =
    `${CLOUD_FUNCTION_URL}getGeocode?lat=${latitude}&lon=${longitude}&address=` + encodeURIComponent(address);
  return fetch(requestUrl)
    .then(checkStatus)
    .then(parseJSON)
    .then((data: any) => data)
    .catch((error: any) => console.error('request failed', error));
};

export const getWeather = (latitude: number, longitude: number, exclude: string, units: string): Promise<Forecast> => {
  const requestUrl =
    `${CLOUD_FUNCTION_URL}getWeather?lat=${latitude}&lon=${longitude}&` +
    `exclude=${encodeURIComponent(exclude)}&units=${encodeURIComponent(units)}`;
  return fetch(requestUrl)
    .then(checkStatus)
    .then(parseJSON)
    .then((data: any) => data)
    .catch((error: any) => console.error('request failed', error));
};

export const getWeatherByTime = (
  latitude: number,
  longitude: number,
  time: number,
  exclude: string,
  units: string
): Promise<Forecast> => {
  const requestUrl =
    `${CLOUD_FUNCTION_URL}getWeather?lat=${latitude}&lon=${longitude}&time=${time}` +
    `&exclude=${encodeURIComponent(exclude)}&units=${encodeURIComponent(units)}`;
  return fetch(requestUrl)
    .then(checkStatus)
    .then(parseJSON)
    .then((data: any) => data)
    .catch((error: any) => console.error('request failed', error));
};
