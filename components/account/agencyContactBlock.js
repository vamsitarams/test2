import PropTypes from 'prop-types';
import React from 'react';
import InputText from '../../components/forms/inputText';

export class AgencyContactBlock extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    contact: PropTypes.object,
    index: PropTypes.number,
    onRemoveContact: PropTypes.func,
    onUpdateContact: PropTypes.func,
    contactsValidationErrors: PropTypes.array
  };

  constructor (props) {
    super(props);

    this._nameRef = React.createRef();
    this._infoRef = React.createRef();
  }

  onChange = () => {
    const contact = {
      ...this.props.contact,
      name: this._nameRef.current.value,
      info: this._infoRef.current.value
    };

    if (Object.prototype.hasOwnProperty.call(this.props, 'onUpdateContact')) {
      this.props.onUpdateContact(contact);
    }
  };

  onDelete = () => {
    if (Object.prototype.hasOwnProperty.call(this.props, 'onRemoveContact')) {
      this.props.onRemoveContact();
    }
  }

  render () {
    const { l } = this.context.i18n;
    const { contact, contactsValidationErrors, index } = this.props;

    const isExisted = Object.prototype.hasOwnProperty.call(contact, 'existed');
    const errors = [];
    if (contactsValidationErrors && contactsValidationErrors instanceof Array && contactsValidationErrors.length > 0) {
      contactsValidationErrors.forEach((elem) => {
        if (elem.ref === index) {
          if (!errors[elem.field]) {
            errors[elem.field] = [];
          }
          errors[elem.field].push(elem.message);
        }
      });
    }

    return (
      <div className='agency-contact'>
        <InputText
          ref={this._nameRef}
          name='name'
          placeholder={l('Enter Name')}
          errorText={errors && errors.name ? errors.name[0] : ''}
          defaultValue={contact.name}
          onChangeHandler={this.onChange}
          required={isExisted}
        />
        <InputText
          type='tel'
          ref={this._infoRef}
          name='info'
          placeholder={l('Enter Phone')}
          errorText={errors && errors.info ? errors.info[0] : ''}
          defaultValue={contact.info}
          onChangeHandler={this.onChange}
          required={isExisted}
        />
        {isExisted
          ? <button className='accounts-contact-delete' type='button' onClick={this.onDelete}>Х</button>
          : ''
        }
      </div>
    );
  }
}
export default AgencyContactBlock;
