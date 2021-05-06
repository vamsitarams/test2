import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import TravelerMessageIcon from '../../components/messages/travelerMessageIcon';

import {
  stateLastMessages, stateViewedMessages, stateMessagesLoading
} from '../../redux/modules/messages';

const mapStateToProps = createSelector(
  stateLastMessages,
  stateViewedMessages,
  stateMessagesLoading,
  (lastMessages, viewedMessages, loading) => {
    // remove viewed messages
    lastMessages = filter(lastMessages, (traveler) => {
      const viewedMessage = find(viewedMessages, { id: traveler.lastMessage._id.$oid });
      if (viewedMessage) {
        return traveler.lastMessage.timestampUTC.$date > viewedMessage.timeUTC;
      }
      return true;
    });

    return {
      lastMessages,
      loading
    };
  }
);

export class MessagesContainer extends React.Component {
  static propTypes = {
    travelerId: PropTypes.string.isRequired,
    lastMessages: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return !isEqual(nextProps, this.props);
  }

  render () {
    const { travelerId, lastMessages, loading } = this.props;
    const traveler = find(lastMessages, ['_id.$oid', travelerId]);
    if (loading || !traveler || !traveler.lastMessage) return null;
    return <TravelerMessageIcon lastMessage={traveler.lastMessage} />;
  };
}

export default connect(mapStateToProps, null)(MessagesContainer);
