import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import MessagesBlock from '../../components/messages/messagesBlock';
import { isAdmin } from '../../helpers/user';

import {
  actions as messagesActions,
  stateLastMessages, stateViewedMessages, stateMessagesLoading
} from '../../redux/modules/messages';

import { actions as pusherActions } from '../../redux/modules/pusher';

import { stateHelpedTravelers } from '../../redux/modules/helpedTravelers';
import { stateUserRole } from '../../redux/modules/user';

const mapStateToProps = createSelector(
  stateLastMessages,
  stateViewedMessages,
  stateMessagesLoading,
  stateHelpedTravelers,
  stateUserRole,
  (lastMessages, viewedMessages, loading, helpedTravelers, userRole) => {
    let groupLastMessages = {};

    // remove viewed messages
    lastMessages = filter(lastMessages, (traveler) => {
      const viewedMessage = find(viewedMessages, { id: traveler.lastMessage._id.$oid });
      if (viewedMessage) {
        return traveler.lastMessage.timestampUTC.$date > viewedMessage.timeUTC;
      }
      return true;
    });

    // group by helped and nonHelped by TA
    if (helpedTravelers.travelers.length) {
      groupLastMessages = groupBy(lastMessages, (traveler) => {
        return find(helpedTravelers.travelers, ['_id.$oid', traveler._id.$oid]) ? 'helped' : 'nonHelped';
      });
    } else {
      groupLastMessages.nonHelped = lastMessages;
    }

    let unreadMessagesLength = groupLastMessages.helped ? groupLastMessages.helped.length : 0;

    if (groupLastMessages.nonHelped && groupLastMessages.nonHelped.length) {
      groupLastMessages.nonHelped = filter(groupLastMessages.nonHelped, (traveler) => {
        return traveler.helpedBy && traveler.helpedBy.status !== 'opened';
      });

      unreadMessagesLength += groupLastMessages.nonHelped.length;
    }

    return {
      unreadMessagesLength,
      groupLastMessages,
      userRole,
      loading
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(messagesActions, dispatch),
    ...bindActionCreators(pusherActions, dispatch)
  };
};

export class MessagesContainer extends React.Component {
  static propTypes = {
    unreadMessagesLength: PropTypes.number.isRequired,
    groupLastMessages: PropTypes.shape({
      helped: PropTypes.array,
      nonHelped: PropTypes.array
    }),
    loading: PropTypes.bool.isRequired,
    userRole: PropTypes.string,
    requestLastMessages: PropTypes.func.isRequired,
    helpTraveler: PropTypes.func.isRequired,
    releaseTraveler: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.unreadMessagesLength, nextProps.unreadMessagesLength) ||
      !isEqual(this.props.groupLastMessages, nextProps.groupLastMessages) ||
      !isEqual(this.props.userRole, nextProps.userRole) ||
      !isEqual(this.props.loading, nextProps.loading)
    );
  }

  componentDidMount () {
    this.props.requestLastMessages();
  }

  render () {
    if (isAdmin(this.props.userRole)) return null;
    return <MessagesBlock {...this.props} />;
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer);
