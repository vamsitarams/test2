import PropTypes from 'prop-types';
import React from 'react';
import { validateField } from '../../helpers/form';
import Validator from '../../helpers/validator';
import { TYPE_AGENCY } from '../../helpers/organization';
import $ from 'jquery';
import config from '../../config';

import LoadingIcon from '../../components/common/loadingIcon';
import InputText from '../../components/forms/inputText';
import AgencyContactBlock from './agencyContactBlock';

export class AgencyForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    currentUser: PropTypes.object,
    organization: PropTypes.object,
    errorMessage: PropTypes.string.isRequired,
    isEdit: PropTypes.bool,
    cancelBtnLink: PropTypes.string.isRequired,
    formLoading: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    saveOrganization: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._nameRef = React.createRef();
    this._cisAccountIdRef = React.createRef();
    this.state = {
      validationErrors: {},
      canBeSubmitted: false,
      contacts: [],
      contactsValidationErrors: []
    };

    if (Object.prototype.hasOwnProperty.call(this.props, 'organization') &&
      Object.prototype.hasOwnProperty.call(this.props.organization, 'contacts')) {
      this.state.contacts = this.props.organization.contacts.map((element, idx) => {
        return { ...element, ref: idx, existed: true };
      });
    } else {
      this.state.contacts = [];
    }

    this.state.contacts.push({
      ref: this.state.contacts.length,
      name: '',
      type: 'Phone Number',
      subtype: '',
      info: ''
    });

    this._validationErrors = this.state.validationErrors;
  }

  componentDidMount () {
    this.canBeSubmited();
    $('input[type="tel"]').mask(config.mask.phone);
  }

  componentDidUpdate () {
    $('input[type="tel"]').mask(config.mask.phone);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const primaryEmailErrorPreffix = 'accountId: ';
    const primaryEmailErrorIndex = nextProps.errorMessage.indexOf(primaryEmailErrorPreffix);
    if (primaryEmailErrorIndex !== -1) {
      const message = nextProps.errorMessage.substr(primaryEmailErrorIndex + primaryEmailErrorPreffix.length);
      const newAccountIdError = [message];
      this.setState({
        validationErrors: {
          ...this._validationErrors,
          cisAccountId: newAccountIdError
        }
      });
    } else {
      this.setState({
        validationErrors: {
          ...this.state.validationErrors,
          serverErrors: nextProps.errorMessage
        }
      });
    }
  }

  canBeSubmited () {
    const isFull = this.validateMaxLength() && this.checkFormFullness();
    if (this.state.canBeSubmitted !== isFull) {
      this.setState({
        canBeSubmitted: isFull
      });
    }
  }

  validateMaxLength () {
    const fields = [{ name: 'name', ref: this._nameRef.current }, { name: 'cisAccountId', ref: this._cisAccountIdRef }];
    let isValid = true;
    fields.forEach((field) => {
      const validationObj = validateField(field.name, field.ref, this._validationErrors, 'maxLength');
      this._validationErrors = validationObj.validationErrors;
      if (!validationObj.isValid) {
        isValid = false;
      }
    });
    this.setState({ validationErrors: this._validationErrors });
    return isValid;
  }

  checkFormFullness () {
    return this._nameRef && this._nameRef.current && this._nameRef.current.value &&
      this._cisAccountIdRef && this._cisAccountIdRef.current && this._cisAccountIdRef.current.value;
  }

  validateContacts () {
    let isValid = true;
    const { l } = this.context.i18n;
    const _contactsValidationErrors = [];
    this.state.contacts.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(item, 'ref') &&
        Object.prototype.hasOwnProperty.call(item, 'existed')) {
        if (Validator.isNotEmpty(item.name) === false) {
          _contactsValidationErrors.push({
            ref: item.ref,
            field: 'name',
            message: l('Field is required')
          });
          isValid = false;
        }
        if (Validator.isNotEmpty(item.info) === false) {
          _contactsValidationErrors.push({
            ref: item.ref,
            field: 'info',
            message: l('Field is required')
          });
          isValid = false;
        }
        if (Validator.isValidPhone(item.info) === false) {
          _contactsValidationErrors.push({
            ref: item.ref,
            field: 'info',
            message: l('Phone number is invalid')
          });
          isValid = false;
        }
      }
    });

    this.setState({ ...this.state, contactsValidationErrors: _contactsValidationErrors });
    return isValid;
  }

  onChange = () => () => {
    this.canBeSubmited();
  }

  onCancel = () => {
    this.props.cancelForm(this.props.cancelBtnLink);
  }

  onSubmitFn = (e) => {
    e.preventDefault();
    this.setState({ validationErrors: {} }, () => {
      const isValid = this.validateContacts();
      if (isValid) {
        const formData = {
          name: this._nameRef.current.value,
          cisAccountId: this._cisAccountIdRef.current.value,
          type: TYPE_AGENCY,
          contacts: this.state.contacts.filter((elem) => {
            return (
              typeof elem.name === 'string' && elem.name.length > 0 &&
              typeof elem.info === 'string' && elem.info.length > 0
            );
          }).map((elem) => {
            return {
              name: elem.name,
              subtype: elem.name.replace(/\s+/g, ''),
              type: elem.type,
              info: elem.info
            };
          })
        };

        if (this.props.isEdit) {
          const etag = this.props.organization._etag ? this.props.organization._etag.$oid : '';
          const organizationId = this.props.organization._id.$oid;
          this.props.saveOrganization(formData, organizationId, etag);
        } else {
          this.props.saveOrganization(formData, null, null, this.props.cancelBtnLink);
        }
      }
    });
  }

  removeContact = (index) => {
    this.setState({ ...this.state, contacts: this.state.contacts.filter(elem => elem.ref !== index) });
  }

  updateContact = (index, contact) => {
    let contacts = this.state.contacts;
    let idx = -1;
    contacts.forEach((elem, ind) => { if (elem.ref === index) { idx = ind; }; });
    if (contacts instanceof Array && idx !== -1) {
      if (Object.prototype.hasOwnProperty.call(contacts[idx], 'existed')) {
        contacts = this.state.contacts.map(elem => (elem.ref === index ? contact : elem));
      } else {
        if (
          typeof contact.name === 'string' && contact.name.length > 0 &&
          typeof contact.info === 'string' && contact.info.length > 0
        ) {
          contact.existed = true;
          contacts = this.state.contacts.map(elem => (elem.ref === index ? contact : elem));
          let newRef = 0;
          contacts.forEach((elem) => {
            newRef = (elem.ref > newRef ? elem.ref : newRef);
          });
          contacts.push({
            ref: (newRef + 1),
            name: '',
            type: 'Phone Number',
            subtype: '',
            info: ''
          });
        }
      }
      this.setState({ ...this.state, contacts: contacts });
    }
  }

  get contactsBlock () {
    const { l } = this.context.i18n;
    const { contacts, contactsValidationErrors } = this.state;

    let contactsExisted;
    if (contacts && contacts instanceof Array && contacts.length > 0) {
      contactsExisted = contacts.map((contact) => {
        return <AgencyContactBlock
          contact={contact}
          contactsValidationErrors={contactsValidationErrors}
          key={contact.ref}
          index={contact.ref}
          onRemoveContact={this.removeContact(contact.ref)}
          onUpdateContact={this.updateContact(contact.ref)}
        />;
      });
    }

    return (
      <div rel='contacts'>
        <div>
          <h4 className='control-label'>{l('Contacts')}</h4>
          <div>
            {contactsExisted}
          </div>
        </div>
      </div>
    );
  }

  render () {
    const { l } = this.context.i18n;
    const { organization, formLoading, cancelBtnLink } = this.props;
    const { validationErrors } = this.state;

    let loading;
    if (formLoading) {
      loading = (<LoadingIcon loading />);
    }

    let error;
    if (this.state.validationErrors.serverErrors) {
      error = (
        <div className='notifications-wrapper'>
          <div className='notification-error'>
            <div className='notification-message'>{this.props.errorMessage}</div>
          </div>
        </div>
      );
    }

    const addBtnText = this.props.isEdit ? l('Save Changes') : l('Add Agency');

    return (
      <form className='panel-body form-horizontal' onSubmit={this.onSubmitFn}>
        <InputText
          ref={this._nameRef}
          name='name'
          label={l('Name')}
          placeholder={l('Enter Name')}
          errorText={validationErrors.name ? validationErrors.name[0] : ''}
          defaultValue={organization.name}
          onChangeHandler={this.onChange()} />
        <InputText
          ref={this._cisAccountIdRef}
          name='cisAccountId'
          label={l('Agency ID')}
          placeholder={l('Enter Agency ID')}
          errorText={validationErrors.cisAccountId ? validationErrors.cisAccountId[0] : ''}
          defaultValue={organization.cisAccountId}
          onChangeHandler={this.onChange()} />
        {this.contactsBlock}
        {loading}
        {error}
        <div className='holder'>
          <div className='buttons-r-list'>
            <button type='button' to={cancelBtnLink} className='btn btn03'
              disabled={this.props.formLoading} onClick={this.onCancel}>{l('Cancel')}</button>
            <button className='btn btn01'
              type='submit'
              disabled={!this.state.canBeSubmitted}
            >{addBtnText}</button>
          </div>
        </div>
      </form>
    );
  }
}

export default AgencyForm;
