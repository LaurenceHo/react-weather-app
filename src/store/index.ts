import { connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { combineReducers, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { reducers } from './reducers';

export const history = createBrowserHistory();
const rootReducer = (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    reducers,
  });

const store = createStore(rootReducer(history), devToolsEnhancer({}));
export default store;
