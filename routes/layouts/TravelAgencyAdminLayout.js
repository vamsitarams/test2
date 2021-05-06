import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import CompaniesListView from '../../views/CompaniesListView/CompaniesListView';
import AccountFormView from '../../views/AccountFormView/AccountFormView';
import CompanyUsersView from '../../views/CompanyUsersView/CompanyUsersView';
import EditUserFormView from '../../views/EditUserFormView/EditUserFormView';
import AddUserFormView from '../../views/AddUserFormView/AddUserFormView';
import Home from '../../views/DashoardView/Home';
// import Terms from '../../terms';

export default withRouter(class TravelAgencyAdminLayout extends React.Component {
  render () {
    return (
        <Switch>
          {/* <Route exact path="/" component={() => <Redirect to="/terms" />}/>
          <Route exact path='/terms' component={Terms}/> */}
          <Route path='/Home' component={Home} />
          <Route path='/companies' component={CompaniesListView} />
          <Route exact path='/companies/:id' component={CompanyUsersView} />
          <Route path='/companies/:organizationId/users/edit/:id' component={EditUserFormView} />
          <Route path='/companies/:organizationId/add/user' component={AddUserFormView} />
          <Route path='/companies/:organizationId/edit' component={AccountFormView} />
        </Switch>
    );
  }
});
