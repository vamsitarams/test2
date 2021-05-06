import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserHistory } from 'history';
import i18n from './i18n';
import cookie from 'cookie';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { loggedInUser } from './redux/modules/user';
import { localStorage } from './helpers/localStorage';
import config from './config';
import ReactGA from 'react-ga';
import createRootReducer from './redux/rootReducer';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Provider } from 'react-redux';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import {routes} from '../Routes'
import './styles/core.scss';
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'
import GuestLayout from './routes/layouts/GuestLayout';
import { isAdmin } from './helpers/user';


const appSettings = localStorage.get('appSettings');
const initialState = {
  appSettings
};

export const history = createBrowserHistory({
  basename: process.env.BASENAME
});

const store = createStore(createRootReducer(history),
  initialState,
  compose(
    applyMiddleware(thunk, routerMiddleware(history)))
);

ReactGA.initialize(config.googleAnalytics.apiKey);
history.listen((state) => {
  ReactGA.pageview(state.pathname);
});

const locale = cookie.parse(document.cookie).locale || config.locale.defaultLocale;

axios.get(`/lang/${locale}.json`).then((response) => {
  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }
  return response.data;
}).then((localeData) => {
  const i18nTools = new i18n.Tools({ localeData, locale });
  // save translations
  localStorage.set('localeData', localeData);

  // check authorized user session
  const user = localStorage.get('user');
  if (user) {
    const sessionTime = new Date(user.sessionExpiration);
    const currentTime = new Date();
    if (currentTime < sessionTime) {
      store.dispatch(loggedInUser(user));
    } else {
      localStorage.remove('user');
    }
  }

  // Now that we have the Redux store, we can create our routes. We provide
  // the store to the route definitions so that routes have access to it for
  // hooks such as `onEnter`.
  function routeslist(route,i) {
    return (<Route key={i} exact={route.subRoutes.some(r=>r.exact)} path={route.subRoutes.map(r=>r.path)}>
      <route.layout>
        {route.subRoutes.map((subRoute,i) => <Route key={i} {...subRoute} /> )}
      </route.layout>
    </Route>);
  }

  function App() {
    const state = store.getState();
    const { user, loading } = state;

    const admin = isAdmin(user.roleName);
    console.log(user);
    return (
      <>
      <Switch>
        {!user.isAuthenticated && (<Route component={GuestLayout} />)}
        {routes.map(routeslist)}           }

        <Redirect to="/not-found" />
      </Switch>
        </>
    );
  }





  // Render the React application to the DOM
  ReactDOM.render(
    <i18n.Provider i18n={i18nTools}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </i18n.Provider>,
    document.getElementById('root')
  );
});
