import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingIcon from '../../components/common/loadingIcon';

import { actions as travelerManagerActions } from '../../redux/modules/travelerManager';

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerManagerActions, dispatch)
  };
};

class SendInvitationsBlock extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    travelerId: PropTypes.string.isRequired,
    text: PropTypes.string,
    resendDisabled: PropTypes.bool,
    sendInvitation: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  };

  sendInvitationHandler = (id) => (e) => {
    e.preventDefault();
    this.props.sendInvitation(id);
  }

  render () {
    const { l } = this.context.i18n;
    const { travelerId, text, resendDisabled } = this.props;
    let linkText = l('Send Invitation');
    if (text) linkText = text;

    if (resendDisabled) {
      return (
        <span className='invitationDisabled'>
          <a>{linkText}</a>
          <LoadingIcon loading={this.props.loading} />
        </span>
      );
    } else {
      return (
        <span className='invitation'>
          <a href='#' onClick={this.sendInvitationHandler(travelerId)}>{linkText}</a>
          <LoadingIcon loading={this.props.loading} />
        </span>
      );
    }
  }
}

export default connect(null, mapDispatchToProps)(SendInvitationsBlock);
