/* eslint-disable react/no-string-refs */
import PropTypes from 'prop-types';
import React from 'react';
import { isCompanyAdmin, isGlobalAdmin } from '../../helpers/user';
import $ from 'jquery';
import filter from 'lodash/filter';
import lodashFind from 'lodash/find';
import config from '../../config';
import '../../sdk/jquery.mask.min';

import LoadingIcon from '../../components/common/loadingIcon';
import InputText from '../../components/forms/inputText';
import SelectField from '../../components/forms/selectField';
import CheckboxField from '../../components/forms/checkboxField';

import {
  initPhoneNumbersCollection,
  getCompanySortLevelIdList,
  repeatFields,
  validateField
} from '../../helpers/form';

export class TravelerForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    traveler: PropTypes.object.isRequired,
    companiesList: PropTypes.array.isRequired,
    sortLevelIds: PropTypes.array.isRequired,
    errorMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
    cancelBtnLink: PropTypes.string.isRequired,
    user: PropTypes.shape({
      roleName: PropTypes.string,
      organization: PropTypes.shape({
        _id: PropTypes.object
      })
    }).isRequired,
    saveTraveler: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._firstNameRef = React.createRef();
    this._lastNameRef = React.createRef();
    this._isVipRef = React.createRef();
    this._emailPrimaryRef = React.createRef();
    this._sendInvitationRef = React.createRef();
    this._sortLevelIdRef = React.createRef();
    this._companyRef = React.createRef();
    const userRole = this.props.user.roleName;
    const userOrganizationId = this.props.user.organization._id.$oid;

    // Create initial array of phone numbers for using in repeated fields
    const travelerPhonesRefs = initPhoneNumbersCollection(this.props.traveler.phoneNumbers);

    // Init Selected company
    const organization = this.props.traveler.organization;
    let selectedCompany = organization && organization._id ? {
      value: organization._id.$oid,
      label: organization.name
    } : '';

    if (isCompanyAdmin(userRole)) {
      selectedCompany = {
        value: userOrganizationId
      };
    }

    // Init selected Sort Level Id
    const selectedSortLevelId = this.props.traveler.costCenter ? {
      value: this.props.traveler.costCenter._id.$oid,
      label: this.props.traveler.costCenter.name
    } : '';

    // Init Sort Level Id List for selected company
    let companySortLevelIdList = [];
    if (organization && organization._id.$oid || isCompanyAdmin(userRole)) {
      const companyId = isCompanyAdmin(userRole) ? userOrganizationId : organization._id.$oid;
      companySortLevelIdList = getCompanySortLevelIdList(this.props.sortLevelIds, companyId);
    }

    this.state = {
      companySortLevelIdList: companySortLevelIdList,
      validationErrors: {},
      phones: travelerPhonesRefs,
      company: selectedCompany,
      sortLevelId: selectedSortLevelId,
      sendInvitation: true,
      canBeSubmitted: false
    };

    this.requiredFields = ['firstName', 'lastName', 'company', 'sortLevelId', 'emailPrimary'];
    if (isCompanyAdmin(this.props.user.roleName)) {
      this.requiredFields = ['firstName', 'lastName', 'sortLevelId', 'emailPrimary'];
    }

    this._validationErrors = this.state.validationErrors;
  }

  // Check if edit form can be submitted after loading
  componentDidMount () {
    this.canBeSubmited();
    $('input[type="tel"]').mask(config.mask.phone);
  }

  componentDidUpdate () {
    $('input[type="tel"]').mask(config.mask.phone);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const primaryEmailErrorPreffix = 'userName: ';
    const primaryEmailErrorIndex = nextProps.errorMessage.indexOf(primaryEmailErrorPreffix);
    if (primaryEmailErrorIndex !== -1) {
      const message = nextProps.errorMessage.substr(primaryEmailErrorIndex + primaryEmailErrorPreffix.length);
      const newPrimaryEmailError = [message];
      this.setState({
        validationErrors: {
          ...this._validationErrors,
          emailPrimary: newPrimaryEmailError
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

  get emails () {
    const { l } = this.context.i18n;
    const { isEdit, traveler: { emails } } = this.props;
    const validationErrors = this.state.validationErrors;
    let primaryEmail = emails ? lodashFind(emails, { type: 'primary' }) : null;
    primaryEmail = primaryEmail && primaryEmail.email || '';

    // Prepare inputs for readonly additional email for old users
    let additionalEmails = emails ? filter(emails, (email) => email.type !== 'primary') : [];
    if (emails && emails.length) {
      additionalEmails = additionalEmails.map((emailObj, index) => {
        return (
          <div className='form-group' key={emailObj.email}>
            <input
              disabled
              readOnly
              type='text'
              defaultValue={emailObj.email}
              className='form-control' />
          </div>
        );
      });
    }

    return (
      <div>
        <InputText
          disabled={isEdit}
          readOnly={isEdit}
          label={l('Email')}
          ref={this._emailPrimaryRef}
          name='emailPrimary'
          placeholder={l('Enter Email')}
          errorText={validationErrors.emailPrimary ? validationErrors.emailPrimary[0] : ''}
          defaultValue={primaryEmail}
          onChangeHandler={this.onChange()} />
        {additionalEmails}
      </div>
    );
  }

  // Add repeated field
  addField = (field) => (e) => {
    e.preventDefault();
    const collectionName = `${field}s`;
    const collection = this.state[collectionName];
    const lastElemRef = collection[collection.length - 1].ref;
    const lastElemIndex = +lastElemRef.slice(field.length);
    const fieldRef = `${field}${lastElemIndex + 1}`;
    this.setState({ [collectionName]: [...this.state[collectionName], { ref: fieldRef }] }, () => {
      this.canBeSubmited();
    });
  }

  // Remove repeated field
  removeField = (collectionName) => {
    return (field) => {
      return (e) => {
        e.preventDefault();
        const updatedEmails = filter(this.state[collectionName], (item) => {
          return item.ref !== field;
        });
        this.setState({ [collectionName]: updatedEmails });
      };
    };
  }

  setCompanySortLevelIdList (id) {
    const newSortLevelIdList = getCompanySortLevelIdList(this.props.sortLevelIds, id);
    this.setState({
      companySortLevelIdList: newSortLevelIdList
    });
  }

  // Check if all required fields are filled
  checkFormFullness () {
    const areRequiredFilled = this.requiredFields.every((field) => {
      switch (field) {
        case 'firstName': return this._firstNameRef.current.value !== '';
        case 'lastName': return this._lastNameRef.current.value !== '';
        case 'company': return this._companyRef.current.value !== '';
        case 'emailPrimary': return this._emailPrimaryRef.current.value !== '';
        case 'sortLevelId': return this.state.companySortLevelIdList.length
          ? this._sortLevelIdRef.current.value !== '' : true;
      }
      return false;
    });

    // Uncomment the following code if the phones field should be required
    // const isPrimaryPhoneFilled = !!this.refs[this.state.phones[0].ref].value;
    // return areRequiredFilled && isPrimaryPhoneFilled;

    return areRequiredFilled;
  }

  // Validate email and phone fields
  validateForm () {
    let isValid = true;
    // Validate email
    const validationObj = validateField('emailPrimary', this._emailPrimaryRef.current, this._validationErrors, 'email');
    this._validationErrors = validationObj.validationErrors;
    if (!validationObj.isValid) {
      isValid = false;
    }
    // Validate phone numbers
    this.state.phones.forEach((item) => {
      // If secondary phone is empty - skip validation
      if (!this.refs[item.ref].value) {
        return;
      }
      const validationObj = validateField(item.ref, this.refs[item.ref], this._validationErrors, 'phone');
      this._validationErrors = validationObj.validationErrors;
      if (!validationObj.isValid) {
        isValid = false;
      }
    });

    this.setState({ validationErrors: this._validationErrors });

    return isValid;
  }

  // Format array of traveler emails or phones in order to suite a save request
  generateTravelerContacts (type, contactsArr) {
    return contactsArr.reduce((newArr, contact, index) => {
      if (!this.refs[contact.ref].value) {
        return newArr;
      }
      let contactObj;
      if (index === 0) {
        contactObj = { [type]: this.refs[contact.ref].value.trim(), type: 'primary' };
      } else {
        contactObj = { [type]: this.refs[contact.ref].value.trim() };
      }
      if (type === 'number') {
        contactObj[type] = contactObj[type].replace(/[\+\(\)-\s]/g, '');
      }
      newArr.push(contactObj);
      return newArr;
    }, []);
  }

  validateMaxLength () {
    const fields = [{ name: 'firstName', ref: this._firstNameRef.current },
      { name: 'lastName', ref: this._lastNameRef.current },
      { name: 'emailPrimary', ref: this._emailPrimaryRef.current }];

    let isValid = true;
    fields.forEach((field) => {
      const validationObj = validateField(field.name, field.ref, this._validationErrors, 'maxLength');
      this._validationErrors = validationObj.validationErrors;
      if (!validationObj.isValid) {
        isValid = false;
      }
    });

    this.state.phones.forEach((item) => {
      const validationObj = validateField(item.ref, this.refs[item.ref], this._validationErrors, 'maxLength');
      this._validationErrors = validationObj.validationErrors;
      if (!validationObj.isValid) {
        isValid = false;
      }
    });

    this.setState({ validationErrors: this._validationErrors });
    return isValid;
  }

  // onChange handler for required fields
  onChange = () => () => {
    this.canBeSubmited();
  }

  canBeSubmited () {
    const isFull = this.validateMaxLength() && this.checkFormFullness();
    if (this.state.canBeSubmitted !== isFull) {
      this.setState({
        canBeSubmitted: isFull
      });
    }
  }

  // handler for company select
  onCompanyChange = (selected) => {
    this.setState({
      company: selected,
      sortLevelId: ''
    });
    this.setCompanySortLevelIdList(selected.value);
    this.canBeSubmited();
  }

  // onChange handler for sort level id select
  onSortLevelIdChange = (selected) => {
    this.setState({
      sortLevelId: selected
    });
    this.canBeSubmited();
  }

  onCancel = () => {
    this.props.cancelForm(this.props.cancelBtnLink);
  }

  // onSubmit handler for the form
  onSubmitFn = (e) => {
    e.preventDefault();

    this.setState({ validationErrors: {} }, () => {
      const isValid = this.validateForm();
      if (!isValid) {
        return;
      }
      const travelerPhones = this.generateTravelerContacts('number', this.state.phones);
      const userRole = this.props.user.roleName;

      const company = isCompanyAdmin(userRole) ? this.state.company.value : this._companyRef.current.value;
      const travelerData = {
        firstName: this._firstNameRef.current.value,
        lastName: this._lastNameRef.current.value,
        isVIP: this._isVipRef.current.value,
        organizationId: company,
        costCenterId: this._sortLevelIdRef && this._sortLevelIdRef.current && this._sortLevelIdRef.current.value
          ? this._sortLevelIdRef.current.value : '',
        phoneNumbers: travelerPhones
      };

      if (!this.props.isEdit) {
        travelerData.emails = [{
          email: this._emailPrimaryRef.current.value,
          type: 'primary'
        }];
        travelerData.sendInvitation = this._sendInvitationRef && this._sendInvitationRef.current &&
          this._sendInvitationRef.current.value ? this._sendInvitationRef.current.value : '';
        this.props.saveTraveler(travelerData);
      } else {
        const etag = this.props.traveler._etag ? this.props.traveler._etag.$oid : '';
        this.props.saveTraveler(travelerData, this.props.traveler._id.$oid, etag);
      }
    });
  }

  render () {
    const { l } = this.context.i18n;

    const { traveler, companiesList, cancelBtnLink, user } = this.props;
    const { validationErrors } = this.state;

    let error;
    if (this.state.validationErrors.serverErrors) {
      error = (
        <div>
          <div className='text-danger'>{this.props.errorMessage}</div>
        </div>);
    }

    let formLoading;
    if (this.props.loading) {
      formLoading = (<LoadingIcon loading />);
    }

    let companySelect;
    if (!isCompanyAdmin(user.roleName)) {
      companySelect = (
        <SelectField
          ref={this._companyRef}
          name='company'
          options={companiesList}
          label={l('Company')}
          placeholder={l('Select Company')}
          defaultValue={this.state.company}
          onChangeHandler={this.onCompanyChange} />);
    }

    let sortLevelIdSelect;
    if (this.state.companySortLevelIdList.length || this.state.sortLevelId) {
      sortLevelIdSelect = (
        <SelectField
          ref={this._sortLevelIdRef}
          name='sortLevelId'
          options={this.state.companySortLevelIdList}
          label={l('Sort Level ID')}
          placeholder={l('Select Sort Level ID')}
          defaultValue={this.state.sortLevelId}
          onChangeHandler={this.onSortLevelIdChange} />
      );
    }

    const defaultSendInvitation = true;
    const sendInvitationForm = !this.props.isEdit && isGlobalAdmin(user.roleName) ? (
      <CheckboxField
        ref={this._sendInvitationRef}
        name='sendInvitation'
        label={l('Send invitation to download mobile app')}
        errorText={validationErrors.sendInvitation ? validationErrors.sendInvitation[0] : ''}
        defaultValue={defaultSendInvitation}
      />
    ) : null;

    const repeatedPhones = repeatFields({
      collection: this.state.phones,
      field: 'phone',
      validationErrors: this.state.validationErrors,
      text: {
        label: l('Phone number'),
        placeholder: l('Enter Phone Number'),
        addBtnText: l('Add phone number')
      },
      maxFieldsNumber: 4,
      onChange: this.onChange(),
      addFieldHandler: this.addField('phone'),
      removeFieldHandler: this.removeField('phones')
    });

    const addBtnText = this.props.isEdit ? l('Save Changes') : l('Add Traveler');
    return (
      <form className='panel-body form-horizontal' onSubmit={this.onSubmitFn}>
        <div className='travelers-form-group'>
          <InputText
          ref={this._firstNameRef}
          name='firstName'
          label={l('First Name')}
          placeholder={l('Enter First Name')}
          errorText={validationErrors.firstName ? validationErrors.firstName[0] : ''}
          defaultValue={traveler.firstName}
          onChangeHandler={this.onChange()} />
        </div>
        <div className='travelers-form-group'>
          <InputText
          ref={this._lastNameRef}
          name='lastName'
          label={l('Last Name')}
          placeholder={l('Enter Last Name')}
          errorText={validationErrors.lastName ? validationErrors.lastName[0] : ''}
          defaultValue={traveler.lastName}
          onChangeHandler={this.onChange()} />
        </div>
        <div className='travelers-form-group'>
          <div className='cust-cb'>
          <CheckboxField
            ref={this._isVipRef}
            name='isVip'
            label={l('VIP')}
            errorText={validationErrors.isVIP ? validationErrors.isVIP[0] : ''}
            defaultValue={traveler.isVIP}
          />
        </div>
        </div>
        <div className='travelers-form-group'>{companySelect} </div>
        <div className='travelers-form-group'>{sortLevelIdSelect}</div>
        <div className='travelers-form-group'>{this.emails}</div>
         <div className='travelers-form-group'>
           <div className='form-group' style={{ minHeight: '15rem' }}>
          <div className='add-phone-class'>{repeatedPhones}</div></div>
         </div>
        <div className='cust-cb'>{sendInvitationForm}</div>
        {formLoading}
        {error}
        <div className='holder'>
          <div className='buttons-r-list'>
            <button type='button' to={cancelBtnLink} className='btn btn03 btn-user-disabled'
              disabled={this.props.loading} onClick={this.onCancel}>{l('Cancel')}</button>
            <button className='btn btn01 btn-add-user'
              type='submit'
              disabled={!this.state.canBeSubmitted || this.props.loading}
            >{addBtnText}</button>
          </div>
        </div>
      </form>
    );
  }
}
export default TravelerForm;
