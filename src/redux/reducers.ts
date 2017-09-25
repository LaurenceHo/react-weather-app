import { SET_ALL_WEATHER_DATA_INTO_STORE } from './actions';

const initialState = {
	location: '',
	weather: {},
	timezone: {},
	forecast: {},
	isLoading: false
}

export const reducers = (state: any = initialState, action: any) => {
	switch (action.type) {
		case SET_ALL_WEATHER_DATA_INTO_STORE:
			return {...state};

		default:
			return state
	}
}