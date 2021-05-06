import PropTypes from 'prop-types';
import React from 'react';

export default class CheckboxField extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    errorText: PropTypes.string,
    defaultValue: PropTypes.bool,
    label: PropTypes.string,
    onChangeHandler: PropTypes.func,
    checkUpdate: PropTypes.bool
  }

  constructor (props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue ? props.defaultValue : false
    };
  }

  onChangeHandler = () => {
    if (this.props.onChangeHandler) {
      this.props.onChangeHandler();
    }
  }

  get value () {
    return this._text ? this._text.checked : this.props.defaultValue;
  }

  render () {
    const { name, errorText, label, checkUpdate } = this.props;
    const { defaultValue } = this.state;

    let errorClass = '';
    let errorTextMessage;
    if (errorText) {
      errorClass = 'has-error';
      errorTextMessage = (
        <span className='text-danger error-message'>{errorText}</span>
      );
    }

    const refFn = (ref) => { this._text = ref; };

    return (
      <div className={`${errorClass}`}>
        <input
          type='checkbox'
          id={name}
          onChange={this.onChangeHandler}
          ref={refFn}
          {...(checkUpdate && { checked: this.props.defaultValue })}
          {...(!checkUpdate && { defaultChecked: defaultValue })} />
        <label htmlFor={name}>{label}</label>
        {errorTextMessage}
      </div>
    );
  }
}
