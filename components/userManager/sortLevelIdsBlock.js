import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import RadioButtonsGroup from '../forms/radioButtonsGroup';
import find from 'lodash/find';
import filter from 'lodash/filter';
import differenceWith from 'lodash/differenceWith';
import { isAdmin } from '../../helpers/user';
// import { TYPE_AGENCY } from '../../helpers/organization';
import Close from '../common/svgIcon/Close.svg';
export class SortLevelIdsBlock extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    organizations: PropTypes.array.isRequired,
    selected: PropTypes.array,
    isIncluded: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    userRoleName: PropTypes.string
  };

  constructor () {
    super(...arguments);
    const { l } = this.context.i18n;

    const allOrganizationLabel = this.isCompanyBlock() ? l('All Companies') : l('All Sort Level IDs');
    this.allOrganizationValue = { label: allOrganizationLabel, value: 'all' };

    const someSelected = this.props.selected.length && this.props.selected.length !== this.props.organizations.length;
    this._options = [...this.props.organizations];
    this.state = {
      isIncluded: (!this.props.userRoleName || isAdmin(this.props.userRoleName) || this.props.isIncluded),
      checkedOrganizations: someSelected ? this.props.selected : [],
      options: this._options,
      value: someSelected ? '' : this.allOrganizationValue
    };
  }

  get value () {
    const orgArr = this.state.checkedOrganizations ? this.state.checkedOrganizations : [];
    const organisationArray = orgArr
      .filter((item) => {
        return (item && Object.prototype.hasOwnProperty.call(item, 'value'));
      })
      .map((item) => {
        return item.value;
      });
    return {
      isIncluded: this.state.isIncluded,
      checkedOrganizations: organisationArray,
      value: ''
    };
  }

  isCompanyBlock () {
    // const { organization, currentUser } = this.props;

    return true;
  // return (organization && organization.type === TYPE_AGENCY) || (organization && !organization.type && currentUser &&
    // currentUser.roleName && isTravelAgencyAdmin(currentUser.roleName));
  }

  onIncludeStateChange = (val) => {
    this.setState({
      isIncluded: val === 'include'
    });
  }

  onOrganizationChange = (value) => {
    // console.log(value);
    if (!value) {
      return;
    }
    if (value.value === 'all') {
      this._options = [...this.props.organizations];
      this.setState({
        options: this._options,
        checkedOrganizations: [],
        value: this.allOrganizationValue
      });
    } else {
      const values = [].concat(this.state.checkedOrganizations, [value]);
      this._options = filter(this._options, (option) => {
        return option.value !== value.value;
      });
      console.log(this._options);
      if (values.length === this.props.organizations.length + 1) {
        console.log(values.length, this.props.organizations.length);
        // If all options seleted change select's value to all organisations selected
        this._options = [...this.props.organizations];
        this.setState({
          options: this._options,
          checkedOrganizations: [],
          value: this.allOrganizationValue
        });
      } else {
        this.setState({
          options: this._options,
          checkedOrganizations: values,
          value: ''
        });
      }
    }
  }

  removeOption = (option) => {
    console.log(option);
    // e.preventDefault();
    if (this._options.indexOf(option) === -1) {
      this._options.push(option);
    }
    const values = filter(this.state.checkedOrganizations, (item) => {
      if (item !== undefined) return item.value !== option.value;
    });
    const selectVal = !values.length ? this.allOrganizationValue : '';
    this.setState({
      options: [...this._options],
      checkedOrganizations: values,
      value: selectVal
    });
  }

  get selectedOptions () {
    const { l } = this.context.i18n;

    if (this.state.checkedOrganizations && this.state.checkedOrganizations.length) {
      return this.state.checkedOrganizations
        .filter((elem) => (elem && Object.prototype.hasOwnProperty.call(elem, 'label')))
        .map((option, index) => {
          return (
            <div className='teg-item' key={index}>
              {option.label} <a href='#' title={l('close')} onClick={() => { this.removeOption(option); }}>
                <img src={Close} alt='close'/></a>
            </div>
          );
        });
    }
  }

  render () {
    const { l } = this.context.i18n;
    const { isIncluded } = this.state;
    const premissionsFields = [
      {
        label: l('Exclude'),
        value: 'exclude',
        checked: !isIncluded
      },
      {
        label: l('Include'),
        value: 'include',
        checked: isIncluded
      }
    ];

    // Set options for select, removing already selected options
    const selectsOprions = differenceWith(this._options, this.state.checkedOrganizations);
    // Prepend 'all' option to the selects options
    const isAllOption = find(this._options, (item) => item.value === 'all');
    if (!isAllOption) {
      this._options.unshift(this.allOrganizationValue);
    }

    // Set text for companies or sort level ids
    const isCompany = this.isCompanyBlock();
    let heading = l('Sort Level IDs Access Permissions');
    let placeholderText = l('Select Sort Level ID');

    if (isCompany) {
      heading = l('Access Permissions');
      placeholderText = l('Select Company');
    }

    // Add note when all organizations included or excluded
    let selectNote;
    if ((!this.state.checkedOrganizations || !this.state.checkedOrganizations.length)) {
      const label = isCompany ? 'companies' : 'Sort Level IDs';

      if (isIncluded) {
        selectNote = <span className='note'>{l(`All ${label} are included`)}</span>;
      } else {
        selectNote = <span className='note'>{l(`By default all ${label} are excluded`)}</span>;
      }
    }

    return (
      <div className='form-area'>
        <h3>{heading}</h3>
        <RadioButtonsGroup
          name='permissions'
          fields={premissionsFields}
          onRadioGroupChange={this.onIncludeStateChange}
        />
        <div className='permissions-select'>
          <Select
          clearable={false}
          options={selectsOprions}
          value={this.state.value}
          placeholder={placeholderText}
          onChange={this.onOrganizationChange} />
        </div>
        {selectNote}
        <div style={{ display: 'flex' }}>{this.selectedOptions}</div>
      </div>
    );
  }
}
export default SortLevelIdsBlock;
