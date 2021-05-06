import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ForgotPasswordForm from '../../containers/User/ForgotPasswordForm';

// import classes from './HomeView.scss'

const mapStateToProps = (state) => ({
  user: state.user
});

export class ForgotPasswordView extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.any.isRequired
  };

  redirectIfAuthenticated (user) {
    if (user.isAuthenticated) {
      this.context.router.push('/');
    }
  }

  UNSAFE_componentWillUpdate (nextProps, nextState) {
    this.redirectIfAuthenticated(nextProps.user);
  }

  componentDidMount () {
    this.redirectIfAuthenticated(this.props.user);
  }

  render () {
    return (
      <div className='text-center'>
        <ForgotPasswordForm />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(ForgotPasswordView);
