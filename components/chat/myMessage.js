import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export class MyMessage extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    message: PropTypes.object.isRequired
  };

  render () {
    const { message } = this.props;
    const date = moment.utc(message.createdDate);
    if (!message.senderName || !message.messageText || !date.isValid()) return null;
    const postedDate = date.local().format('HH:mm A');

    return (
      <div className='my-message chat-message'>
        <div className='message-info'>
          <strong className='sender-name'>{message.senderName}</strong>
          <span className='date'>{postedDate}</span>
        </div>
        <div className='message-text'>
          {message.messageText.split('\n').map((item, i) => (<span key={item + i}>{item}<br /></span>))}
        </div>
      </div>
    );
  }
}
export default MyMessage;
