import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import LoginFrom from '../../containers/User/LoginForm';

// import classes from './HomeView.scss'

const mapStateToProps = (state) => ({
  user: state.user
});

export class LoginView extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.any.isRequired
  };

  redirectIfAuthenticated (user) {
    if (user.isAuthenticated) {
      this.context.router.push('/Home');
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
        <LoginFrom />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(LoginView);
