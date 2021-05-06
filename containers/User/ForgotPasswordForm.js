import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as userActions } from '../../redux/modules/user';

import ForgotPasswordForm from '../../components/user/ForgotPasswordForm';

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userActions, dispatch)
  };
};

export class ForgotPasswordFormContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.any.isRequired,
    requestHashCode: PropTypes.func.isRequired,
    getGuestTokens: PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.getGuestTokens();
  }

  render () {
    return (
      <ForgotPasswordForm {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordFormContainer);
