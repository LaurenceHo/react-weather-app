export const SET_ALL_WEATHER_DATA_INTO_STORE = 'SET_ALL_WEATHER_DATA_INTO_STORE';
export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHING_DATA_SUCCESS = 'FETCHING_DATA_SUCCESS';
export const FETCHING_DATA_FAILURE = 'FETCHING_DATA_FAILURE';

export function fetchingData(filter: string) {
	return {
		type: FETCHING_DATA,
		filter
	}
}

export function fetchingDataSuccess() {
	return {
		type: FETCHING_DATA_SUCCESS,
	}
}

export function fetchingDataFailure(error: string) {
	return {
		type: FETCHING_DATA_FAILURE,
		error
	}
}


export function setAllWeatherDataIntoStore(payload: any) {
	return {
		type: SET_ALL_WEATHER_DATA_INTO_STORE,
		payload
	}
}
