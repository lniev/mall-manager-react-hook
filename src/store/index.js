import { createStore, combineReducers, applyMiddleware } from 'redux';
import { loginReducer, RightReducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
const reducers = combineReducers({ loginReducer, RightReducer });
// const logger = createLogger() // 创建logger实例




const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)))

export default store;