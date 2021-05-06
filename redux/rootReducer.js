import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import user from './modules/user';
import pusher from './modules/pusher';
import loading from './modules/loading';
import messages from './modules/messages';
import activeTravelers from './modules/activeTravelers';
import helpedTravelers from './modules/helpedTravelers';
import travelerDetails from './modules/travelerDetails';
import travelersList from './modules/travelersList';
import accountsList from './modules/accountsList';
import organizationUsers from './modules/organizationUsers';
import users from './modules/users';
import companiesList from './modules/companiesList';
import flightsStatus from './modules/flightsStatus';
import reservations from './modules/reservations';
import flightsStatusMap from './modules/flightsStatusMap';
import airportStatuses from './modules/airportStatuses';
import atMap from './modules/atMap';
import search from './modules/search';
import notification from './modules/notification';
import appSettings from './modules/appSettings';
import timeline from './modules/timeline';
import travelerManager from './modules/travelerManager';
import userManager from './modules/userManager';
import importTravelers from './modules/importTravelers';
import importTravelersBase from './modules/importTravelersBase';
import organizationManager from './modules/organizationManager';
import userSettings from './modules/userSettings';
import travelAdvisory from './modules/travelAdvisory';
import sidebar from './modules/sidebar'

const createRootReducer = (history) => combineReducers({
  pusher,
  atMap,
  user,
  users,
  messages,
  travelerDetails,
  activeTravelers,
  helpedTravelers,
  travelersList,
  accountsList,
  organizationUsers,
  companiesList,
  reservations,
  flightsStatus,
  flightsStatusMap,
  airportStatuses,
  router: connectRouter(history),
  search,
  notification,
  loading,
  appSettings,
  travelerManager,
  timeline,
  userManager,
  importTravelers,
  importTravelersBase,
  organizationManager,
  userSettings,
  travelAdvisory,
  sidebar
});

export default createRootReducer;
