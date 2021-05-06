import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash/debounce';
import Select from 'react-select';

export default class AccountsFilter extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    accountsFilter: PropTypes.object.isRequired,
    accountsEmbedded: PropTypes.object.isRequired,
    clearAccountsFilter: PropTypes.func.isRequired,
    setAccountsFilter: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._searchRef = React.createRef();
    this._searchText = props.accountsFilter.searchName;
    this._type = props.accountsFilter.type;
    this._associatedAgency = props.accountsFilter.associatedAgency;
    this._search = debounce((searchText) => {
      this._searchText = searchText;
      this.filterRequest();
    }, 300);
  }

  UNSAFE_componentWillUpdate (nextProps) {
    this._searchText = nextProps.accountsFilter.searchName;
    this._type = nextProps.accountsFilter.type;
    this._associatedAgency = nextProps.accountsFilter.associatedAgency;
    if (this._searchRef && this._searchRef.current && this._searchRef.current.value !== this._searchText) {
      this._searchRef.current.value = this._searchText;
    }
  }

  filterType = (selected) => {
    this._type = selected.value;
    this.filterRequest();
  }

  filterAssociatedAgency = (selected) => {
    this._associatedAgency = selected.value;
    this.filterRequest();
  }

  filterRequest () {
    this.props.setAccountsFilter({
      type: this._type,
      associatedAgency: this._associatedAgency,
      searchName: this._searchText
    });
  }

  handleSubmit = () => {
    const searchText = this._searchRef.current.value;
    if ((searchText && searchText.length > 2) || !searchText) {
      this._search(searchText);
    }
  }

  clearAll = (e) => {
    e.preventDefault();
    this.props.clearAccountsFilter();
    this._searchRef.current.value = '';
  }

  get typesSelect () {
    const { l } = this.context.i18n;
    const typesLabels = {
      agency: l('Agency'),
      organization: l('Company')
    };
    const options = this.props.accountsEmbedded.types.map((type) => {
      return { value: type, label: typesLabels[type] };
    });
    options.unshift({ value: '', label: l('All Types') });
    return (
      <Select
        clearable={false}
        value={this.props.accountsFilter.type}
        options={options}
        onChange={this.filterType} />
    );
  }

  get associatedAgencySelect () {
    const { l } = this.context.i18n;
    const options = this.props.accountsEmbedded.associatedAgencies.map((agency) => {
      return { value: agency._id.$oid, label: agency.name };
    });
    options.unshift({ value: '', label: l('All Associated Agencies') });
    return (
      <Select
        clearable={false}
        value={this.props.accountsFilter.associatedAgency}
        options={options}
        onChange={this.filterAssociatedAgency} />
    );
  }

  render () {
    const { l } = this.context.i18n;
    const { accountsFilter } = this.props;
    return (
      <div className='accounts-filter search-block'>
        <input
          type='text'
          name='search'
          ref={this._searchRef}
          placeholder={l('Search by account name or ID')}
          defaultValue={accountsFilter.searchName}
          onChange={this.handleSubmit} />
        {this.typesSelect}
        <div className='agency-select'>
          {this.associatedAgencySelect}
        </div>
        <a className='clear-all' href='/' onClick={this.clearAll}>{l('Clear All')}</a>
      </div>
    );
  }
}
