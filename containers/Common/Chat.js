import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import PusherService from '../../helpers/pusher';
import config from '../../config';
import moment from 'moment';
import Chat from '../../components/chat/chat';

import { actions as messagesActions } from '../../redux/modules/messages';
import { actions as pusherActions } from '../../redux/modules/pusher';
import { actions as travelerActions, stateTraveler } from '../../redux/modules/travelerDetails';
import { stateUser } from '../../redux/modules/user';

const mapStateToProps = createSelector(
  stateTraveler,
  stateUser,
  (traveler, user, userSettings) => {
    const messageId = traveler.lastMessage && traveler.lastMessage._id ? traveler.lastMessage._id.$oid : '';
    const userId = user._id || '';
    const travelerIsActive = traveler.status === 'active';
    const userName = user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : '';
    let helpedStatus = 'not-helped';
    if (traveler.helpedBy && traveler.helpedBy._id && traveler.helpedBy.status === 'opened') {
      if (traveler.helpedBy._id.$oid === userId) {
        helpedStatus = 'helped-by-me';
      } else {
        helpedStatus = 'helped-by-someone';
      }
    }
    return {
      messageId,
      user,
      traveler,
      travelerIsActive,
      userName,
      helpedStatus
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(messagesActions, dispatch),
    ...bindActionCreators(travelerActions, dispatch),
    ...bindActionCreators(pusherActions, dispatch)
  };
};

export class ChatContainer extends React.Component {
  static propTypes = {
    traveler: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    travelerIsActive: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
    helpedStatus: PropTypes.string.isRequired,
    height: PropTypes.number,
    changeTravelerOnlineStatus: PropTypes.func.isRequired,
    updateViewedMessages: PropTypes.func.isRequired,
    newMessages: PropTypes.func
  };

  constructor (props) {
    super(props);
    this._historyNumer = 0;
    this.state = {
      history: [],
      sessionMessages: []
    };
  }

  getChannelMessages = (msgObj) => {
    const updatesSessionMessages = [...this.state.sessionMessages, msgObj];
    this.setState({
      sessionMessages: updatesSessionMessages
    });

    if (this.props.newMessages) {
      this.props.newMessages(updatesSessionMessages);
    }
  }

  UNSAFE_componentWillMount () {
    if (this.props.user._id && this.props.traveler && this.props.traveler._id) {
      if (this.props.messageId) {
        this.props.updateViewedMessages(this.props.messageId);
      }

      PusherService.subscribe(
        config.pusher.chatChannelPrefix + this.props.traveler._id.$oid,
        (context, message) => {
          if (context.indexOf('pusher:') === -1) {
            this.getChannelMessages(message);
          }
        }
      );
    }
  }

  componentWillUnmount () {
    if (this.props.traveler && this.props.traveler._id) {
      PusherService.unsubscribe(config.pusher.chatChannelPrefix + this.props.traveler._id.$oid);
    }
  }

  sendMessage = (msgText) => {
    if (this.props.user._id && this.props.traveler && this.props.traveler._id) {
      const msgObj = {
        createdDate: moment.utc().valueOf(),
        messageText: msgText,
        senderName: this.props.userName,
        subscriberId: this.props.user._id,
        aps: {
          alert: msgText,
          class: 'message'
        }
      };

      PusherService.publish(config.pusher.chatChannelPrefix + this.props.traveler._id.$oid, 'chat', msgObj,
        (status) => status);
    }
  }

  render () {
    const { history, sessionMessages } = this.state;
    const { traveler, user, helpedStatus, height, travelerIsActive } = this.props;

    return (
      <Chat
        traveler={traveler}
        user={user}
        travelerIsActive={travelerIsActive}
        history={history}
        sessionMessages={sessionMessages}
        helpedStatus={helpedStatus}
        height={height}
        sendMessage={this.sendMessage} />
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
