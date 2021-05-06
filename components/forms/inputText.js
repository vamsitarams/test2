import PropTypes from 'prop-types';
import React from 'react';

export default class InputText extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    errorText: PropTypes.string,
    type: PropTypes.string,
    defaultValue: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    note: PropTypes.string,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    maxLength: PropTypes.number,
    onChangeHandler: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue ? props.defaultValue : ''
    };
  }

  onChangeHandler = () => {
    if (this.props.onChangeHandler) {
      this.props.onChangeHandler();
    }
  }

  get value () {
    return this._text ? this._text.value.trim() : this.props.defaultValue;
  }

  render () {
    const { name, errorText, label, placeholder, note, readOnly, disabled, required, type, maxLength } = this.props;
    const { defaultValue } = this.state;

    const maxLengthValue = maxLength || 255;

    let errorClass = '';
    let errorTextMessage;
    if (errorText) {
      errorClass = 'has-error';
      errorTextMessage = (
        <span className='text-danger error-message'>{errorText}</span>
      );
    }

    const noteEl = note ? (<span className='note text-muted'>{note}</span>) : '';
    const noteHolderClass = note ? 'input-hold' : '';

    const refFn = (ref) => { this._text = ref; };

    return (
      <div className={`form-group ${errorClass} ${noteHolderClass}`}>
        <label htmlFor={name} className='control-label col-sm-3'>{label}</label>
        <div>
          {errorTextMessage}
          {noteEl}
          <input
            ref={refFn}
            type={type || 'text'}
            id={name}
            required={required}
            readOnly={!!readOnly}
            disabled={!!disabled}
            className='form-control'
            placeholder={placeholder}
            defaultValue={defaultValue}
            maxLength={maxLengthValue}
            onChange={this.onChangeHandler} />
        </div>
      </div>
    );
  }
}
