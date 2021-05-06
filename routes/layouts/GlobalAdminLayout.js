import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import AccountFormView from '../../views/AccountFormView/AccountFormView';
import AccountUsersView from '../../views/AccountUsersView/AccountUsersView';
import EditUserFormView from '../../views/EditUserFormView/EditUserFormView';
import AddUserFormView from '../../views/AddUserFormView/AddUserFormView';

export default withRouter(class GlobalAdminLayout extends React.Component {
  render () {
    return (
        <div>
          <Route exact path="/" component={() => <Redirect to="/accounts" />}/>
          <Route path='/accounts/add' component={AccountFormView} />
          <Route exact path='/accounts/:id' component={AccountUsersView} />
          <Route path='/accounts/:organizationId/users/edit/:id' component={EditUserFormView} />
          <Route path='/accounts/:organizationId/add/user' component={AddUserFormView} />
          <Route path='/accounts/:organizationId/edit' component={AccountFormView} />
        </div>
    );
  }
});
