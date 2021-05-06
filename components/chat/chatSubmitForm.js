import PropTypes from 'prop-types';
import React from 'react';
import Keypress from 'react-keypress';

export class ChatSubmitForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    sendMessage: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._messageRef = React.createRef();
  }

  onSubmit = (e) => {
    e.preventDefault();
    const msgText = this._messageRef.current.value.trim();
    if (msgText) {
      this._messageRef.current.value = '';
      this.props.sendMessage(msgText);
    }
  }

  render () {
    return (
      <div className='chat-form'>
        <form onSubmit={this.onSubmit}>
          <textarea
            ref={this._messageRef}
            onKeyPress={Keypress('ctrl enter', this.onSubmit)} />
          <button type='submit'>Send</button>
        </form>
      </div>
    );
  }
}
export default ChatSubmitForm;
