import PropTypes from 'prop-types';
import React from 'react';
import { isGlobalAdmin } from '../../helpers/user';

export default class ChatInvitation extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    traveler: PropTypes.object.isRequired,
    sendInvitation: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  sendInvitation = (e) => {
    e.preventDefault();
    this.props.sendInvitation(this.props.traveler._id.$oid);
  }

  render () {
    const { l, getTimezoneTime } = this.context.i18n;
    const { traveler: { invitation }, userRole } = this.props;
    let lastInvitationRequest;
    let invitationBlock;
    if (invitation && invitation.timestampUTC) {
      lastInvitationRequest = (
        <span className='note'>
          {l('Invitations sent')}: {invitation.total ? invitation.total : 1}{'. '}
          {l('Last sent on')}: {getTimezoneTime(invitation.timestampUTC.$date, 'MMM DD, YYYY')}
        </span>
      );
    }

    if (isGlobalAdmin(userRole)) {
      if (this.props.traveler.isGeneratedEmail) {
        invitationBlock = (<div>
          <p className='disabledText'>{l('Invite traveler to download 4site mobile app')}</p>
          {lastInvitationRequest}
          <button className='btn btn02' disabled>{l('Send Invitation')}</button>
        </div>);
      } else {
        invitationBlock = (<div>
          <p>{l('Invite traveler to download 4site mobile app')}</p>
          {lastInvitationRequest}
          <button className='btn btn02' onClick={this.sendInvitation}>{l('Send Invitation')}</button>
        </div>);
      }
    } else {
      invitationBlock = (<div>
        {lastInvitationRequest}
      </div>);
    }

    return (
      <div className='nomessages-area'>
        {invitationBlock}
      </div>
    );
  };
}
