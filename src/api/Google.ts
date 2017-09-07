import axios from 'axios';
import * as moment from 'moment';

const GOOGLE_TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json?location=';
const GOOGLE_GETCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';

export const getTimeZone = (latitude: number, longitude: number) => {
	const latitudeAndLongitude = latitude + ',' + longitude;

	const requestUrl = `${GOOGLE_TIMEZONE_API_URL}${latitudeAndLongitude}&timestamp=${moment().unix()}`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};

export const getGeoCode = (latitude: number, longitude: number) => {
	const latitudeAndLongitude = latitude + ',' + longitude;

	const requestUrl = `${GOOGLE_GETCODE_API_URL}${latitudeAndLongitude}&sensor=true`;

	return axios.get(requestUrl).then((res) => {
		return res.data;
	});
};