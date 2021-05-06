import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as userActions } from '../../redux/modules/user';

import SetNewPasswordForm from '../../components/user/SetNewPasswordForm';

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userActions, dispatch)
  };
};

export class SetNewPasswordFormContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.any.isRequired,
    user: PropTypes.any.isRequired,
    saveNewPassword: PropTypes.func.isRequired,
    getGuestTokens: PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.getGuestTokens();
  }

  render () {
    return (
      <SetNewPasswordForm {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetNewPasswordFormContainer);
