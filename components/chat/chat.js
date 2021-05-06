import PropTypes from 'prop-types';
import React from 'react';
import config from '../../config';
import moment from 'moment';
import $ from 'jquery';
import MyMessage from './myMessage';
import SomeoneMessage from './someoneMessage';
import ChatSubmitForm from './chatSubmitForm';
import HelpedBlock from '../../containers/Traveler/HelpedBlock';
import { isCompanyUser, isAdmin } from '../../helpers/user';

export class Chat extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    history: PropTypes.array.isRequired,
    sessionMessages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    traveler: PropTypes.object.isRequired,
    travelerIsActive: PropTypes.bool.isRequired,
    helpedStatus: PropTypes.string.isRequired,
    height: PropTypes.number,
    sendMessage: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._messagesRef = React.createRef();
  }

  scrollToBottom () {
    if (this._messagesHolder) {
      this._messagesHolder.animate({ scrollTop: this._messagesHolder.prop('scrollHeight') }, 1000);
    }
  }

  componentDidMount () {
    this._messagesHolder = $(this._messagesRef.current);
    this._firstLoad = true;
  }

  componentDidUpdate () {
    if (this._firstLoad) {
      this._firstLoad = false;
      this._messagesHolder.scrollTop(this._messagesHolder.prop('scrollHeight'));
    } else {
      this.scrollToBottom();
    }
  }

  get submitForm () {
    const { helpedStatus, sendMessage, traveler, user, travelerIsActive } = this.props;
    const { l } = this.context.i18n;
    const travelerId = traveler._id ? traveler._id.$oid : '';

    if (!travelerIsActive) {
      return null;
    }
    let status = helpedStatus + (isCompanyUser(user.roleName) ? '-but-its-cu' : '');
    if (isAdmin(user.roleName)) {
      status = helpedStatus + '-but-its-admin';
    }

    switch (status) {
      case 'helped-by-me':
      case 'not-helped-but-its-cu':
      case 'helped-by-someone-but-its-cu':
        return <ChatSubmitForm sendMessage={sendMessage} />;
      case 'not-helped':
        return (
          <div className='nomessages-area'>
            <div>
              <p>{l('To chat with traveler click')}</p>
              <HelpedBlock travelerId={travelerId} helpedBy={traveler.helpedBy} />
            </div>
          </div>
        );
      case 'not-helped-but-its-admin':
      default:
        return null;
    }
  }

  render () {
    const { history, sessionMessages, user, height } = this.props;
    const userId = user._id;
    let day = '';
    const chatMessages = [...history, ...sessionMessages].map((msg) => {
      const messageDay = moment.utc(msg.createdDate).local().format('MMM DD, YYYY');
      let messageDate;
      if (messageDay && day !== messageDay && moment.utc(msg.createdDate).isValid()) {
        day = messageDay;
        messageDate = (<em className='day-date'><span>{messageDay}</span></em>);
      }
      if (userId === msg.subscriberId) {
        return (
          <div className='holder' key={msg.createdDate + msg.messageText}>
            {messageDate}
            <MyMessage message={msg} />
          </div>
        );
      } else {
        return (
          <div className='holder' key={msg.createdDate + msg.messageText}>
            {messageDate}
            <SomeoneMessage message={msg} />
          </div>
        );
      }
    });

    const submitForm = this.submitForm;
    const chatMessagesHolderHeight = !submitForm ? height : height - config.layout.travelerDetailsChatSubmitHeight;

    return (
      <div className='chat'>
        <div className='chat-messages scroll' ref={this._messagesRef} style={{ height: chatMessagesHolderHeight }}>
          {chatMessages}
        </div>
        {submitForm}
      </div>
    );
  }
}
export default Chat;
