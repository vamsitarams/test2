import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import AddUserFormView from '../../views/AddUserFormView/AddUserFormView';
import EditUserFormView from '../../views/EditUserFormView/EditUserFormView';

export default withRouter(class CompanyAdminLayout extends React.Component {
  render () {
    return (
      <div>
        <Route exact path="/" component={() => <Redirect to="/users" />}/>
        <Route path='/users/add' component={AddUserFormView} />
        <Route path='/users/edit/:id' component={EditUserFormView} />
      </div>
    );
  }
});
