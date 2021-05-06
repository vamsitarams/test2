import PropTypes from 'prop-types';
import React from 'react';
import { validateField } from '../../helpers/form';
import { isAdmin, isGlobalAdmin } from '../../helpers/user';
import userSettings from '../../helpers/userSettings';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import Select from '.././common/select/Select';
import LoadingIcon from '../../components/common/loadingIcon';
import InputText from '../../components/forms/inputText';
import RadioButtonsGroup from '../../components/forms/radioButtonsGroup';
import SortLevelIdsBlock from './sortLevelIdsBlock';

export class UserForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    organizations: PropTypes.array,
    currentUser: PropTypes.object,
    organization: PropTypes.object,
    errorMessage: PropTypes.string.isRequired,
    isEdit: PropTypes.bool,
    cancelBtnLink: PropTypes.string.isRequired,
    formLoading: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._firstNameRef = React.createRef();
    this._lastNameRef = React.createRef();
    this._emailRef = React.createRef();
    this._roleRef = React.createRef();
    this._sortLevelIdsRef = React.createRef();
    const isAdministrator = this.props.user.roleName ? isAdmin(this.props.user.roleName) : true;

    this.state = {
      validationErrors: {},
      selectedContinent: null,
      roles: [
        {
          label: 'User',
          value: 'user',
          checked: !isAdministrator
        },
        {
          label: 'Administrator',
          value: 'admin',
          checked: isAdministrator
        }
      ],
      isUser: !isAdministrator,
      organizations: this.props.organizations,
      canBeSubmitted: false
    };

    this._validationErrors = this.state.validationErrors;
  }

  componentDidMount () {
    this.canBeSubmited();
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
          email: newPrimaryEmailError
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
    console.log(isFull);
    // console.log(this.validateMaxLength(), isFull, this.checkFormFullness());
    if (isFull === true && typeof (this.state.selectedContinent) === 'string') {
      console.log(isFull === true && typeof (this.state.selectedContinent) === 'string');
      this.setState({
        canBeSubmitted: isFull
      });
    }
  }

  validateMaxLength () {
    const fields = [{ name: 'firstName', ref: this._firstNameRef.current },
      { name: 'lastName', ref: this._lastNameRef.current }, { name: 'email', ref: this._emailRef.current }];
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
    if (this._firstNameRef && this._firstNameRef.current && this._firstNameRef.current.value &&
      this._lastNameRef && this._lastNameRef.current && this._lastNameRef.current.value &&
      this._emailRef && this._emailRef.current && this._emailRef.current.value) return true;
  }

  // checkContinent () {
  //   if (this.state.selectedContinent !== null) return true;
  // }

  validateEmail () {
    const validationObj = validateField('email', this._emailRef.current, this._validationErrors, 'email');
    this._validationErrors = validationObj.validationErrors;
    this.setState({ validationErrors: this._validationErrors });
    return validationObj.isValid;
  }

  validateForm () {
    return this.validateEmail();
  }

  onChange = () => () => {
    this.canBeSubmited();
  }

  onRoleChange = (val) => {
    this.setState({
      isUser: (val === 'user' && (this.props.organizations && this.props.organizations.length))
    });
  }

  onCancel = () => {
    this.props.cancelForm(this.props.cancelBtnLink);
  }

  onSubmitFn = (e) => {
    e.preventDefault();
    const isValid = this.validateForm();
    if (!isValid) {
      return;
    }

    const currentUser = this.props.currentUser;

    const role = currentUser.roleName && isGlobalAdmin(currentUser.roleName) && isEmpty(this.props.organization)
      ? 'ADMIN' : this._roleRef.current.value.toUpperCase();

    const userData = {
      firstName: this._firstNameRef.current.value,
      lastName: this._lastNameRef.current.value,
      userName: this._emailRef.current.value,
      roleName: role,
      continent: this.state.selectedContinent,
      ...userSettings
    };

    const sortLevelIds = this._sortLevelIdsRef.current;
    const permissionVal = this._sortLevelIdsRef.current.value;

    if (sortLevelIds && sortLevelIds.value) {
      const arrayName = permissionVal.isIncluded ? 'allow' : 'deny';
      userData.permissions = {
        [arrayName]: permissionVal.checkedOrganizations
      };
    }

    // If we are modifying a user and we're not the global admin,
    // then set their permissions to be all of the companies of the current user
    if (permissionVal.checkedOrganizations.length === 0 && !isGlobalAdmin(currentUser.roleName)) {
      const arrayName = permissionVal.isIncluded ? 'allow' : 'deny';
      userData.permissions = {
        [arrayName]: currentUser.organizations.map(function (o) { return o.id; })
      };
    }

    const organizationId = isEmpty(
      this.props.organization) ? this.props.currentUser.organization._id.$oid : this.props.organization._id.$oid;
    if (this.props.isEdit) {
      const etag = this.props.user._etag ? this.props.user._etag.$oid : '';
      const userId = this.props.user._id.$oid;
      this.props.saveUser(userData, organizationId, userId, etag);
    } else {
      this.props.saveUser(userData, organizationId, null, null, this.props.cancelBtnLink);
    }
  }

  get organisationBlock () {
    const { user, currentUser, organizations, organization } = this.props;
    // const organizations = [
    //   { label: 'Test1', value: '601dbcebrrgrrac6a15ae6285e' },
    //   { label: 'Test2', value: '601dbceb391ac6a15ae6285e' },
    //   { label: 'Test3', value: '67567hg6a15ae6285e' },
    //   { label: 'Cobra Kai', value: '601dbcebuhuyo56687' }];
    let isIncluded = false;
    let selected = [];

    // List of included companies
    if (user.permissions && user.permissions.allow && !user.permissions.deny) {
      isIncluded = true;
      selected = user.permissions.allow;
    }
    // List of excluded companies
    if (user.permissions && (user.permissions.deny || (user.permissions.allow && user.permissions.deny))) {
      selected = user.permissions.deny;
    }

    let userOrganizations = organizations;
    if (userOrganizations.length === 0) {
      userOrganizations = currentUser.organizations.map(function (o) { return { value: o.id, label: o.name }; });
    }
    const userOrganization = isEmpty(organization) ? currentUser.organization : organization;

    if (selected.length) {
      selected = selected.map((item) => {
        return find(userOrganizations, (o) => {
          return o.value === item;
        });
      });
    }
    return (userOrganizations.length) ? (
      <SortLevelIdsBlock ref={this._sortLevelIdsRef} organizations={userOrganizations} currentUser={currentUser}
        organization={userOrganization} isIncluded={isIncluded} selected={selected} userRoleName={user.roleName} />
    ) : null;
  }

       selectChange = (selectedContinent) => {
         this.setState({ selectedContinent: selectedContinent.value });
         //  console.log('Option selected:', selectedContinent);
       }

       render () {
         const { l } = this.context.i18n;
         const { user, formLoading, cancelBtnLink, currentUser } = this.props;
         const { validationErrors, roles } = this.state;
         const continentList = [
           { value: 'north-america', label: 'North America' },
           { value: 'south-america', label: 'South America' },
           { value: 'europe', label: 'Europe' },
           { value: 'asia', label: 'Asia' },
           { value: 'africa', label: 'Africa' },
           { value: 'australia', label: 'Australia' }
         ];
         const continentSelect = (
        <Select
          clearable={false}
          className='continent'
          value={this.state.selectedContinent}
          options={continentList}
          searchable
          placeholder='Default Continent'
          // optionRenderer={({ continentList }) => (<label>{continentList}</label>)}
          onChange={this.selectChange} />
         );
         let loading;
         if (formLoading) {
           loading = (<LoadingIcon loading />);
         }
         let error;
         if (this.state.validationErrors.serverErrors) {
           error = (<div className='text-danger'>{this.props.errorMessage}</div>);
         }

         // If not adding or editing a GA show radiobuttons for choosing role
         const roleRadioButtons = !(isEmpty(this.props.organization) && isGlobalAdmin(currentUser.roleName)) ? (
      <div className='cust-holder'>
        <RadioButtonsGroup
          ref={this._roleRef}
          name='role'
          label={l('Role')}
          fields={roles}
          onRadioGroupChange={this.onRoleChange}
        />
      </div>
         ) : '';

         const addBtnText = this.props.isEdit ? l('Save Changes') : l('Add User');

         return (
      <form className='panel-body form-horizontal add-user-form' onSubmit={this.onSubmitFn}>
        <InputText
          ref={this._firstNameRef}
          name='firstName'
          label={l('First Name')}
          placeholder={l('Enter First Name')}
          errorText={validationErrors.firstName ? validationErrors.firstName[0] : ''}
          defaultValue={user.firstName}
          onChangeHandler={this.onChange()} />
        <InputText
          ref={this._lastNameRef}
          name='lastName'
          label={l('Last Name')}
          placeholder={l('Enter Last Name')}
          errorText={validationErrors.lastName ? validationErrors.lastName[0] : ''}
          defaultValue={user.lastName}
          onChangeHandler={this.onChange()} />
        <InputText
          ref={this._emailRef}
          name='email'
          label={l('Email')}
          placeholder={l('Enter Email')}
          errorText={validationErrors.email ? validationErrors.email[0] : ''}
          defaultValue={user.userName}
          onChangeHandler={this.onChange()} />
          <div className='form-group continent-group'>
            <label htmlFor={name} className='control-label col-sm-3'>{l('Default Continent')}</label>
            {continentSelect}
          </div>
        {roleRadioButtons}
        {this.organisationBlock}
        {loading}
        {error}
        <div className='holder'>
          <div className='buttons-r-list'>
            <button type='button' to={cancelBtnLink} className='btn btn03 btn-user-disabled'
              disabled={this.props.formLoading} onClick={this.onCancel}>{l('Cancel')}</button>
            <button className='btn btn01 btn-add-user'
              type='submit'
              disabled={!this.state.canBeSubmitted}
            >{addBtnText}</button>
          </div>
        </div>
      </form>
         );
       }
}

export default UserForm;
