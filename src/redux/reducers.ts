import * as ACTION from './actions';

const initialState = {
	location: '',
	weather: {},
	timezone: {},
	forecast: {},
	isLoading: false
}

export const reducers = (state: any = initialState, action: any) => {
	switch (action.type) {
		case ACTION.FETCHING_DATA:
			return {
				...state,
				isLoading: true
			}

		case ACTION.FETCHING_DATA_SUCCESS:
			return {
				...state,
				isLoading: false
			}

		case ACTION.FETCHING_DATA_FAILURE:
			return {
				...state,
				isLoading: false
			}

		case ACTION.SET_ALL_WEATHER_DATA_INTO_STORE:
			return action.payload;

		default:
			return state
	}
}