import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { reducers } from './reducers';

const rootReducer = () =>
  combineReducers({
    weather: reducers,
  });

const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer(), composeEnhancer(applyMiddleware(thunk)));
export default store;
