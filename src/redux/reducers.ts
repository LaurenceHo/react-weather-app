import { GET_LOCATION, SET_ALL_WEATHER_DATA_INTO_STORE } from './actions';

export const reducers = (state: any = {}, action: any) => {
	switch (action.type) {
		case SET_ALL_WEATHER_DATA_INTO_STORE:
			console.log('SET_ALL_WEATHER_DATA_INTO_STORE: ' ,state);
			return state;

		case GET_LOCATION:
			console.log('GET_LOCATION: ' , state)
			return state;

		default:
			return state
	}
}