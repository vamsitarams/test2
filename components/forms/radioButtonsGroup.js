import PropTypes from 'prop-types';
import React from 'react';
import find from 'lodash/find';

export default class RadioButtonsGroup extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    label: PropTypes.string,
    onRadioGroupChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    updateChecked: PropTypes.bool
  }

  constructor (props) {
    super(props);

    const checkedVal = find(this.props.fields, { checked: true });

    this.state = {
      checkedValue: checkedVal ? checkedVal.value : ''
    };
  }

  get value () {
    return this.state.checkedValue;
  }

  onChange = (e) => {
    if (!this.props.updateChecked) {
      this.setState({
        checkedValue: e.target.value
      });
    }

    if (this.props.onRadioGroupChange) {
      this.props.onRadioGroupChange(e.target.value);
    }
  }

  get fields () {
    const { fields, name, disabled } = this.props;

    return fields.map((field) => {
      const id = field.label.split(' ').join('_');
      return (
        <div className='cust-rb' key={field.value}>
          <input
            id={id}
            type='radio'
            name={name}
            value={field.value}
            checked={this.state.checkedValue === field.value}
            className='form-control'
            onChange={this.onChange}
            disabled={disabled}
          />
          <label htmlFor={id}>{field.label}</label>
        </div>
      );
    });
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.updateChecked) {
      const checked = find(nextProps.fields, { checked: true });

      this.setState({
        checkedValue: checked ? checked.value : ''
      });
    }
  }

  render () {
    const { name, label } = this.props;

    const labelEl = label ? (<label htmlFor={name} className='control-label col-sm-3'>{label}</label>) : null;

    return (
      <div className='form-group'>
        {labelEl}
        {this.fields}
      </div>
    );
  }
}
