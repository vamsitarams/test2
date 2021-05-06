import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as userActions } from '../../redux/modules/user';
import LoginForm from '../../components/user/LoginForm';

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userActions, dispatch)
  };
};

export class LoginFormContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.any.isRequired,
    logInUser: PropTypes.func.isRequired,
    getGuestTokens: PropTypes.func.isRequired,
    toggleError: PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.getGuestTokens();
  }

  render () {
    return (
      <LoginForm {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormContainer);
