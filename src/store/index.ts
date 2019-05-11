import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, compose, combineReducers, createStore } from 'redux';

import { reducers } from './reducers';

export const history: History<any> = createBrowserHistory();
const rootReducer = (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    weather: reducers,
  });

const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer(history), composeEnhancer(applyMiddleware(routerMiddleware(history))));
export default store;
