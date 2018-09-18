import { location } from '../sample/location';
import { weather_us } from '../sample/weather_us';
import { weather_si } from '../sample/weather_si';

const CLOUD_FUNCTION_URL = 'https://us-central1-react-beautiful-weather-app.cloudfunctions.net/';

const checkStatus = (response: any) => {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		throw new Error(response.statusText);
	}
};

const parseJSON = (response: any) => response.json();

export const getGeocode = (latitude: number, longitude: number, address: string) => {
	if (process.env.NODE_ENV === 'development') {
		return new Promise(resolve => setTimeout(resolve, 1000, location));
	} else {
		const requestUrl = `${CLOUD_FUNCTION_URL}getGeocode?lat=${latitude}&lon=${longitude}&address=` + encodeURIComponent(address);
		return fetch(requestUrl)
			.then(checkStatus)
			.then(parseJSON)
			.then(data => data)
			.catch(error => console.error('request failed', error));
	}
};

export const getWeather = (latitude: number, longitude: number, exclude: string, units: string) => {
	if (process.env.NODE_ENV === 'development') {
		if (units === 'us') {
			return new Promise(resolve => setTimeout(resolve, 1000, weather_us));
		} else {
			return new Promise(resolve => setTimeout(resolve, 1000, weather_si));
		}
	} else {
		const requestUrl = `${CLOUD_FUNCTION_URL}getWeather?lat=${latitude}&lon=${longitude}&exclude=${encodeURIComponent(exclude)}&units=${encodeURIComponent(units)}`;
		return fetch(requestUrl)
			.then(checkStatus)
			.then(parseJSON)
			.then(data => data)
			.catch(error => console.error('request failed', error));
	}
};

export const getForecast = (latitude: number, longitude: number, time: number, exclude: string, units: string) => {
	if (process.env.NODE_ENV === 'development') {
		//TODO
	} else {
		const requestUrl = `${CLOUD_FUNCTION_URL}getForecast?lat=${latitude}&lon=${longitude}&time=${time}&exclude=${encodeURIComponent(exclude)}&units=${encodeURIComponent(units)}`;
		return fetch(requestUrl)
			.then(checkStatus)
			.then(parseJSON)
			.then(data => data)
			.catch(error => console.error('request failed', error));
	}
};
