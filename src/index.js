import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Intercept from 'router/intercept';

import { HashRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from 'store'
import Login from './pages/Login';


function Router() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Route path="/" component={Intercept}></Route>
        <Route path="/Home" component={App}></Route>
        <Route path="/Login" component={Login}></Route>
      </HashRouter>
    </Provider>

  );
}

ReactDOM.render(<Router />, document.getElementById('root'));

