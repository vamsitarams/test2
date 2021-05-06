import PropTypes from 'prop-types';
import React from 'react';
import TimeAgo from '../common/timeAgo';

export default class TravelerMessageIcon extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    lastMessage: PropTypes.any
  };

  render () {
    const { lastMessage } = this.props;
    if (!lastMessage || !lastMessage.message || !lastMessage.timestampUTC) {
      return null;
    }
    return (
      <em className='message-icon'>
        <span title={lastMessage.message} className='message-text'>{lastMessage.message}</span>
        <TimeAgo timestampUTC={lastMessage.timestampUTC.$date} />
      </em>
    );
  }
}
