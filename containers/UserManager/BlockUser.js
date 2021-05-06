import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingIcon from '../../components/common/loadingIcon';
import { createSelector } from 'reselect';
import { STATUS_ACTIVE } from '../../helpers/user';

import { actions as userManagerActions, stateBlockLoading } from '../../redux/modules/userManager';

const mapStateToProps = createSelector(
  stateBlockLoading,
  (blockLoading) => {
    return {
      blockLoading
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userManagerActions, dispatch)
  };
};

class BlockUser extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    userId: PropTypes.string.isRequired,
    userStatus: PropTypes.string.isRequired,
    blockUserRequest: PropTypes.func.isRequired,
    unblockUserRequest: PropTypes.func.isRequired,
    blockLoading: PropTypes.bool.isRequired
  };

  toggleUserState = (id) => (e) => {
    e.preventDefault();
    const { l } = this.context.i18n;
    const { userStatus } = this.props;
    const modalMessage = userStatus === STATUS_ACTIVE
      ? l('Are you sure you want to block this user?')
      : l('Are you sure you want to unblock this user?');

    if (confirm(modalMessage)) {
      if (this.props.userStatus === 'active') {
        this.props.blockUserRequest(id);
      } else {
        this.props.unblockUserRequest(id);
      }
    }
  };

  render () {
    const { l } = this.context.i18n;
    const { userId, userStatus } = this.props;
    const blockedClass = userStatus === STATUS_ACTIVE ? 'block-user' : 'unblock-user';
    const text = userStatus === STATUS_ACTIVE ? l('Block User') : l('Unblock User');
    return (
      <span>
        <a className={blockedClass} href='#' onClick={this.toggleUserState(userId)}>{text}</a>
        <LoadingIcon loading={this.props.blockLoading} />
      </span>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockUser);
