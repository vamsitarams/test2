import PropTypes from 'prop-types';
import React from 'react';
import MessageItem from './messageItem';

export default class MessagesBlock extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    unreadMessagesLength: PropTypes.number.isRequired,
    groupLastMessages: PropTypes.shape({
      helped: PropTypes.array,
      nonHelped: PropTypes.array
    }),
    loading: PropTypes.bool.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    const { groupLastMessages: { helped, nonHelped }, loading, unreadMessagesLength } = this.props;
    if (loading) return null;

    const hasMessagesClass = unreadMessagesLength !== 0 ? 'has-messages' : '';
    let helpedTravelersMessages, newTravelersMessages;
    if (helped && helped.length) {
      helpedTravelersMessages = (
        <div>
          <h4>{l('Helped by me')}</h4>
          {helped.map((traveler) => (
            <MessageItem key={traveler._id.$oid} helped traveler={traveler} {...this.props} />
          ))}
        </div>
      );
    }
    if (nonHelped && nonHelped.length) {
      newTravelersMessages = (
        <div>
          <h4>{l('New Messages')}</h4>
          {nonHelped.map((traveler) => (
            <MessageItem key={traveler._id.$oid} traveler={traveler} {...this.props} />
          ))}
        </div>
      );
    }
    return (
      <div className={'last-messages-block ' + hasMessagesClass}>
        {unreadMessagesLength ? <span className='unread-messages-length'>{unreadMessagesLength}</span> : ''}
        <div className='last-messages-drop'>
          <h3>{l('Incoming Chat Messages')}</h3>
          <div className='area'>
            {helpedTravelersMessages}
            {newTravelersMessages}
          </div>
        </div>
      </div>
    );
  }
}
