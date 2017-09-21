import axios from 'axios';

const OPEN_WEATHER_MAP_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?appid=c4e735ea8bd7e7b6dc8368c752517b2d&units=metric';
const OPEN_WEATHER_MAP_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?appid=c4e735ea8bd7e7b6dc8368c752517b2d&units=metric';

export const getForecast = (location: string) => {
	const encodedLocation = encodeURIComponent(location);
	const requestUrl = `${OPEN_WEATHER_MAP_FORECAST_URL}&q=${encodedLocation}`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};

export const getCurrentWeather = (location: string) => {
	const encodedLocation = encodeURIComponent(location);
	const requestUrl = `${OPEN_WEATHER_MAP_WEATHER_URL}&q=${encodedLocation}`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};