export const SET_ALL_WEATHER_DATA_INTO_STORE = 'SET_ALL_WEATHER_DATA_INTO_STORE';
export const GET_LOCATION = 'GET_LOCATION';

export function setAllWeatherDataIntoStore(data: any) {
	return {
		type: SET_ALL_WEATHER_DATA_INTO_STORE,
		data
	}
}

export function getLocation() {
	return {
		type: GET_LOCATION
	}
}
