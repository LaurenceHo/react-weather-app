export const SET_ALL_WEATHER_DATA_INTO_STORE = 'SET_ALL_WEATHER_DATA_INTO_STORE';
export const GET_LOCATION = 'GET_LOCATION';

export function setAllWeatherDataIntoStore(payload: any) {
	return {
		type: SET_ALL_WEATHER_DATA_INTO_STORE,
		payload
	}
}
