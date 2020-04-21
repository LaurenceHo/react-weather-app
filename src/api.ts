import { Forecast, GeoCode } from './constants/types';

declare let process: {
  env: {
    NODE_ENV: string;
  };
};

const CLOUD_FUNCTION_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://us-central1-reactjs-weather.cloudfunctions.net/';

const checkStatus = async (response: Response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let errorJson: any = null;
    try {
      errorJson = await response.json();
    } catch (error) {
      throw new Error(response.statusText);
    }
    if (errorJson.error) {
      throw new Error(errorJson.error);
    } else {
      throw new Error(response.statusText);
    }
  }
};

const parseJSON = (response: Response) => {
  return response
    .json()
    .then((data) => data)
    .catch(() => response);
};

export const getGeocode = (latitude: number, longitude: number, address: string): Promise<GeoCode> => {
  const requestUrl =
    `${CLOUD_FUNCTION_URL}getGeocode?lat=${latitude}&lon=${longitude}&address=` + encodeURIComponent(address);
  return fetch(requestUrl).then(checkStatus).then(parseJSON);
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
  return fetch(requestUrl).then(checkStatus).then(parseJSON);
};
