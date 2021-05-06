import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

export default class SelectField extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    errorText: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChangeHandler: PropTypes.func
  }

  constructor (props) {
    super(props);
    const val = props.defaultValue ? props.defaultValue : '';
    this.state = {
      selectedValue: val,
      value: val.value ? val.value : val
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const nextValue = nextProps.defaultValue ? nextProps.defaultValue.value : '';
    const currentValue = this.props.defaultValue ? this.props.defaultValue.value : '';
    if (currentValue !== nextValue) {
      const val = nextProps.defaultValue ? nextProps.defaultValue : '';
      this.setState({
        selectedValue: val,
        value: val.value ? val.value : val
      });
    }
  }

  onChangeHandler = (selected) => {
    this.setState({
      selectedValue: selected,
      value: selected.value
    });
    if (this.props.onChangeHandler) {
      setTimeout(() => {
        this.props.onChangeHandler(selected);
      });
    }
  }

  get value () {
    return this.state.value;
  }

  render () {
    const { name, errorText, label, placeholder, options } = this.props;
    const { selectedValue } = this.state;

    let errorClass = '';
    let errorTextMessage;
    if (errorText) {
      errorClass = 'has-error';
      errorTextMessage = (
        <span className='text-danger error-message'>{errorText}</span>
      );
    }

    return (
      <div className={`form-group ${errorClass}`}>
        <label htmlFor={name} className='control-label col-sm-3'>{label}</label>
        <div>
          {errorTextMessage}
          <Select
            name={name}
            clearable={false}
            placeholder={placeholder}
            options={options}
            value={selectedValue}
            searchable
            onChange={this.onChangeHandler} />
        </div>
      </div>
    );
  }
}
