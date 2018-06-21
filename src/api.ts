import axios from 'axios';

const CLOUD_FUNCTION_URL = 'https://us-central1-react-beautiful-weather-app.cloudfunctions.net/';

export const getGeocode = (latitude: number, longitude: number, address: string) => {
	const requestUrl = encodeURIComponent(`${CLOUD_FUNCTION_URL}getGeocode?lat=${latitude}&lon=${longitude}&address=${address}`);

	return axios.get(requestUrl).then(res => {
		return res.data;
	});
};

export const getWeather = (latitude: number, longitude: number, exclude: string) => {
	const requestUrl = encodeURIComponent(`${CLOUD_FUNCTION_URL}getWeather?lat=${latitude}&lon=${longitude}&exclude=${exclude}`);

	return axios.get(requestUrl).then(res => {
		return res.data;
	});
};

export const getForecast = (latitude: number, longitude: number, time: number, exclude: string) => {
	const requestUrl = encodeURIComponent(`${CLOUD_FUNCTION_URL}getForecast?lat=${latitude}&lon=${longitude}&time=${time}&exclude=${exclude}`);

	return axios.get(requestUrl).then(res => {
		return res.data;
	});
};
