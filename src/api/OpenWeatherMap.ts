import axios from 'axios';

const OPEN_WEATHER_MAP_WEATHER_API = 'c4e735ea8bd7e7b6dc8368c752517b2d';
const OPEN_WEATHER_MAP_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?appid=' + OPEN_WEATHER_MAP_WEATHER_API + '&units=metric';
const OPEN_WEATHER_MAP_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + OPEN_WEATHER_MAP_WEATHER_API + '&units=metric';

export const getForecastByCity: any = (location: string) => {
	const encodedLocation = encodeURIComponent(location);
	const requestUrl = `${OPEN_WEATHER_MAP_FORECAST_URL}&q=${encodedLocation}`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};

export const getForecastByCoordinates: any = (lat: number, lon: number) => {
	const encodedLocation = 'lat=' + lat + '&lon=' + lon;
	const requestUrl = `${OPEN_WEATHER_MAP_FORECAST_URL}&${encodedLocation}`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};

export const getCurrentWeatherByCity: any = (location: string) => {
	const encodedLocation = encodeURIComponent(location);
	const requestUrl = `${OPEN_WEATHER_MAP_WEATHER_URL}&q=${encodedLocation}`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};

export const getCurrentWeatherByCoordinates: any = (lat: number, lon: number) => {
	const encodedLocation = 'lat=' + lat + '&lon=' + lon;
	const requestUrl = `${OPEN_WEATHER_MAP_WEATHER_URL}&${encodedLocation}`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};