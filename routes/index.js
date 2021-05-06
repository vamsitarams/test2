/* eslint-disable react/display-name */
import React from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { isAdmin } from '../helpers/user';

import GuestLayout from './layouts/GuestLayout';

import TravelersListView from '../views/TravelersListView/TravelersListView';
import SettingsContainerView from '../views/SettingsContainerView/SettingsContainerView';

import FlightsStatusView from '../views/FlightsStatusView/FlightsStatusView';
import Covid19View from '../views/Covid19View/Covid19View';
import Covid19TravelAdvisoryView from '../views/Covid19TravelAdvisoryView/Covid19TravelAdvisoryView';
import TravelAdvisoryView from '../views/TravelAdvisoryView/TravelAdvisoryView';
import SetNewPasswordView from '../views/SetNewPasswordView/SetNewPasswordView';
import ActiveTravelersView from '../views/ActiveTravelersView/ActiveTravelersView';
import TravelerView from '../views/TravelerView/TravelerView';
import NotFoundView from '../views/NotFoundView/NotFoundView';

import ImportTravelersView from '../views/ImportTravelersView/ImportTravelersView';
import AddTravelerFormView from '../views/AddTravelerFormView/AddTravelerFormView';
import EditTravelerFormView from '../views/EditTravelerFormView/EditTravelerFormView';
import AddUserFormView from '../views/AddUserFormView/AddUserFormView';
import EditUserFormView from '../views/EditUserFormView/EditUserFormView';
import AccountFormView from '../views/AccountFormView/AccountFormView';
import AppSettings from '../containers/Common/AppSettings';
import PusherUpdates from '../containers/Common/PusherUpdates';
import AirportStatuses from '../containers/Common/AirportStatuses';
import FlightsStatusMap from '../containers/Common/FlightsStatusMap';
import TabsCommunication from '../containers/Common/TabsCommunication';
import Terms from '../terms';
import Onboarding from '../Onboarding';
import HealthView from '../views/Health/HealthView';
import WorldHub from '../views/WorldhubView/WorldHub';
import Message from '../views/DashoardView/Message';
// import Header from '../containers/Header/Header';
// import SettingsTabs from '../components/common/settingsTabs';

export default withRouter((store) => {
  const state = store.getState();
  const { user, loading } = state;

  const admin = isAdmin(user.roleName);
  return (
    <div className='page'>
      {!user.isAuthenticated && (<Route component={GuestLayout} />)}

      {user.isAuthenticated && (
        <main>
          <AppSettings />
          <PusherUpdates />
          <AirportStatuses />
          <FlightsStatusMap />
          <TabsCommunication />
          {/* <Header /> */}
          {/* <SettingsTabs/> */}
          <div className='main'>
            <Switch>
              <Route exact path='/' component={() => <Redirect to="/onboarding" />}/>
              <Route path ='/onboarding' component={Onboarding}/>
              <Route path='/travelers-list' component={TravelersListView} />
              <Route path='/covid19' component={Covid19View} />
              <Route path='/covid19-travel-advisories' component={Covid19TravelAdvisoryView} />
              <Route path='/travel-advisories' component={TravelAdvisoryView} />
              <Route path='/terms' component={Terms}/>
              <Route path='/health' component={HealthView}/>
              <Route path='/worldhub' component={WorldHub}/>
              <Route path='/message' component={Message}/>

              {admin && (<Route path='/flights-status' component={FlightsStatusView} />)}
              {admin && (<Route path='/active-travelers' component={ActiveTravelersView} />)}
              {admin && (<Route path='/import/traveler' component={ImportTravelersView} />)}
              {admin && (<Route path='/add/traveler' component={AddTravelerFormView} />)}
              {admin && (<Route exact path='/traveler/:id/edit' component={EditTravelerFormView} />)}
              {admin && (<Route path='/users/add' component={AddUserFormView} />)}
              {admin && (<Route path='/companies/add' component={AccountFormView} />)}
              {admin && (<Route path='/users/edit/:id' component={EditUserFormView} />)}
          
              <Route exact path='/traveler/:id' component={TravelerView} />
              <Route path='/traveler/:id/reservations' component={TravelerView} />
              <Route path='/traveler/:id/maps' component={TravelerView} />
              <Route path='/traveler/:id/flight-status' component={TravelerView} />
              <Route path='/traveler/:id/travel-advisories' component={TravelerView} />
              <Route path='/traveler/:id/case-history' component={TravelerView} />

              <Route render={(props) => (
                <SettingsContainerView {...props} user={user} loading={loading} />
              )} />
            </Switch>
          </div>
        </main>
      )}
      <Route path='/set-new-password/:code' component={SetNewPasswordView} />
      <Route path='/404' component={NotFoundView} />
    </div>
  );
});
