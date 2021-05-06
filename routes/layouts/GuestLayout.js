import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import LoginView from '../../views/LoginView/LoginView';
import ForgotPasswordView from '../../views/ForgotPasswordView/ForgotPasswordView';
// import Terms from '../../terms';

export default withRouter(class GuestLayout extends React.Component {
  render () {
    return (
      <div>
          <Route exact path="/" component={() => <Redirect to="/login" />}/>
          <Route path='/login' component={LoginView} />
          <Route path='/forgot-password' component={ForgotPasswordView} />
          {/* <Route path='/terms' component={Terms} /> */}

      </div>
    );
  }
});
