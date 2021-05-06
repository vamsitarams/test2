import PropTypes from 'prop-types';
import React from 'react';
import { validateField } from '../../helpers/form';
import Validator from '../../helpers/validator';
import { TYPE_COMPANY } from '../../helpers/organization';
import InputText from '../../components/forms/inputText';
import CompanyCostCenterBlock from './companyCostCenterBlock';

export class CompanyForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    currentUser: PropTypes.object,
    organization: PropTypes.object,
    costCenters: PropTypes.array,
    errorMessage: PropTypes.string.isRequired,
    isEdit: PropTypes.bool,
    cancelBtnLink: PropTypes.string.isRequired,
    formLoading: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    saveOrganization: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    loadCostCenters: PropTypes.func.isRequired,
    blockLoading: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);
    this._nameRef = React.createRef();
    this._accountIdRef = React.createRef();
    this.state = {
      validationErrors: {},
      canBeSubmitted: false,
      saveLoader: false,
      costCenters: [],
      costCentersValidationErrors: []
    };

    this._validationErrors = this.state.validationErrors;
    this.state.costCenters = this._processCostCenters();
  }

  _processCostCenters (e) {
    const { organization } = this.props;
    let csList = [];
    if (organization && organization._id && organization._id.$oid && organization.type === TYPE_COMPANY) {
      const { costCenters } = this.props;
      if (costCenters && costCenters instanceof Array && costCenters.length > 0) {
        csList = costCenters.map((element, idx) => {
          return {
            ref: idx,
            existed: true,
            _id: element._id.$oid,
            _etag: (Object.prototype.hasOwnProperty.call(element, '_etag') && element._etag.$oid
              ? element._etag.$oid
              : null),
            name: (element.name || ''),
            sort1Id: (element.sort1Id || '')
          };
        });
      }
    }
    csList.push(this.getEmptyCostCenter(csList));
    return csList;
  }

  getEmptyCostCenter (costCenters) {
    let newRef = 0;

    if (costCenters && costCenters instanceof Array && costCenters.length > 0) {
      costCenters.forEach((elem) => {
        newRef = (elem.ref > newRef ? elem.ref : newRef);
      });
      return {
        ref: (newRef + 1),
        name: '',
        sort1Id: ''
      };
    } else {
      return {
        ref: 0,
        name: '',
        sort1Id: ''
      };
    }
  }

  getEmptyCostCenter1 (costCenters) {
    let newRef = 0;
    if (costCenters && costCenters instanceof Array && costCenters.length > 0) {
      if (!costCenters.find(elem => elem.ref === costCenters.length)) {
        newRef = costCenters.length;
      } else {
        costCenters.forEach((elem) => {
          newRef = (elem.ref > newRef ? elem.ref : newRef);
        });
      }
    }

    return {
      ref: (newRef + 1),
      name: '',
      sort1Id: ''
    };
  }

  componentDidMount () {
    this.canBeSubmited();
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const primaryEmailErrorPreffix = 'accountId: ';
    const primaryEmailErrorIndex = nextProps.errorMessage.indexOf(primaryEmailErrorPreffix);
    if (primaryEmailErrorIndex !== -1) {
      const message = nextProps.errorMessage.substr(primaryEmailErrorIndex + primaryEmailErrorPreffix.length);
      const newAccountIdError = [message];
      this.setState({
        costCentersValidationErrors: [],
        validationErrors: {
          ...this._validationErrors,
          accountId: newAccountIdError
        }
      });
    } else {
      this.setState({
        costCentersValidationErrors: [],
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
    const fields = [{ name: 'name', ref: this._nameRef.current },
      { name: 'accountId', ref: this._accountIdRef.current }];
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
      this._accountIdRef && this._accountIdRef.current && this._accountIdRef.current.value;
  }

  validateCostCenters () {
    let isValid = true;
    const { l } = this.context.i18n;
    const _costCentersValidationErrors = [];
    this.state.costCenters.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(item, 'ref') && Object.prototype.hasOwnProperty.call(item, 'existed')) {
        if (Validator.isNotEmpty(item.name) === false) {
          _costCentersValidationErrors.push({
            ref: item.ref,
            field: 'name',
            message: l('Field is required')
          });
          isValid = false;
        }
        if (Validator.isNotEmpty(item.sort1Id) === false) {
          _costCentersValidationErrors.push({
            ref: item.ref,
            field: 'sort1Id',
            message: l('Field is required')
          });
          isValid = false;
        }

        if (this.state.costCenters
          .filter((elem) => elem.sort1Id.toLowerCase() === item.sort1Id.toLowerCase())
          .length > 1
        ) {
          _costCentersValidationErrors.push({
            ref: item.ref,
            field: 'sort1Id',
            message: l('Field is duplicated')
          });
          isValid = false;
        }
      }
    });

    this.setState({ ...this.state, costCentersValidationErrors: _costCentersValidationErrors });
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
      const isValid = this.validateCostCenters();
      if (isValid) {
        this.setState({ ...this.state, saveLoader: true });
        const formData = {
          name: this._nameRef.current.value,
          accountId: this._accountIdRef.current.value,
          type: TYPE_COMPANY,
          costCenters: this.state.costCenters.filter((elem) => {
            return (
              typeof elem.name === 'string' && elem.name.length > 0 &&
              typeof elem.sort1Id === 'string' && elem.sort1Id.length > 0
            );
          })
        };
        if (this.props.isEdit) {
          const etag = this.props.organization._etag ? this.props.organization._etag.$oid : '';
          const organizationId = this.props.organization._id.$oid;
          this.props.saveOrganization(formData, organizationId, etag).then(() => {
            if (
              this.props.organization &&
              this.props.organization.type === TYPE_COMPANY &&
              !this.props.errorMessage
            ) {
              this.props.loadCostCenters(this.props.organization._id.$oid).then(() => {
                this.setState({
                  ...this.state,
                  costCenters: this._processCostCenters(),
                  saveLoader: false
                });
              });
            } else {
              this.setState({ ...this.state, saveLoader: false });
            }
          });
        } else {
          this.props.saveOrganization(formData, null, null, this.props.cancelBtnLink).then(() => {
            this.setState({ ...this.state, saveLoader: false });
          });
        }
      }
    });
  }

  removeContact = (index) => {
    this.setState({ ...this.state, costCenters: this.state.costCenters.filter(elem => elem.ref !== index) });
  }

  updateContact = (index, contact) => {
    let costCenters = this.state.costCenters;
    let idx = -1;
    costCenters.forEach((elem, ind) => { if (elem.ref === index) { idx = ind; }; });
    if (costCenters instanceof Array && idx !== -1) {
      if (Object.prototype.hasOwnProperty.call(costCenters[idx], 'existed')) {
        costCenters = this.state.costCenters.map(elem => (elem.ref === index ? contact : elem));
      } else {
        if (
          (typeof contact.name === 'string' && contact.name.length > 0) ||
          (typeof contact.sort1Id === 'string' && contact.sort1Id.length > 0)
        ) {
          contact.existed = true;
          costCenters = this.state.costCenters.map(elem => (elem.ref === index ? contact : elem));
          costCenters.push(this.getEmptyCostCenter(this.state.costCenters));
        }
      }
      this.setState({ ...this.state, costCenters: costCenters });
    }
  }

  get costCentersBlock () {
    const { l } = this.context.i18n;
    const { costCenters, costCentersValidationErrors } = this.state;

    let costCentersExisted;
    if (costCenters && costCenters instanceof Array && costCenters.length > 0) {
      costCentersExisted = costCenters.map((contact) => {
        return <CompanyCostCenterBlock
          contact={contact}
          costCentersValidationErrors={costCentersValidationErrors}
          key={contact.ref}
          index={contact.ref}
          onRemoveContact={this.removeContact}
          onUpdateContact={this.updateContact}
        />;
      });
    }

    return (
      <div rel='costCenters'>
        <div>
          <h4 className='control-label company-head'>{l('Sort Level IDs')}</h4>
          <div>
            {costCentersExisted}
          </div>
        </div>
      </div>
    );
  }

  render () {
    const { l } = this.context.i18n;
    const { organization, formLoading, cancelBtnLink } = this.props;
    const { validationErrors } = this.state;

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

    const addBtnText = this.props.isEdit ? l('Save Changes') : l('Add Company');

    return (
      <div>
        {error}
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
            ref={this._accountIdRef}
            name='accountId'
            label={l('Company ID')}
            placeholder={l('Enter Company ID')}
            errorText={validationErrors.accountId ? validationErrors.accountId[0] : ''}
            defaultValue={organization.accountId}
            onChangeHandler={this.onChange()} />
            {this.costCentersBlock}
          <div className='holder'>
            <div className='buttons-r-list'>
              <button type='button' to={cancelBtnLink} className='btn btn03 btn-user-disabled'
                disabled={formLoading || this.state.saveLoader}
                  onClick={this.onCancel}>{l('Cancel')}</button>
              <button className='btn btn01 btn-add-user'
                type='submit'
                disabled={!this.state.canBeSubmitted || this.state.saveLoader}
              >{addBtnText}</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CompanyForm;
