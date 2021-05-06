import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash/debounce';

export default class CompaniesFilter extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    companiesFilter: PropTypes.object.isRequired,
    clearCompaniesFilter: PropTypes.func.isRequired,
    setCompaniesFilter: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._searchRef = React.createRef();
    this._searchText = props.companiesFilter.searchName;
    this._search = debounce((searchText) => {
      this._searchText = searchText;
      this.filterRequest();
    }, 300);

    const searchText = this.props.companiesFilter && this.props.companiesFilter.searchName
      ? this.props.companiesFilter.searchName : false;

    this.state = {
      hasSearchText: searchText
    };
  }

  UNSAFE_componentWillUpdate (nextProps) {
    this._searchText = nextProps.companiesFilter.searchName;
  }

  filterRequest () {
    this.props.setCompaniesFilter({
      searchName: this._searchText
    });
  }

  handleSubmit = () => {
    const searchText = this._searchRef.current.value;
    if ((searchText && searchText.length > 2) || !searchText) {
      this._search(searchText.trim());
    }
    this.setState({
      hasSearchText: searchText.trim().length
    });
  }

  clearAll = (e) => {
    e.preventDefault();
    if (this._searchRef.current.value.length > 2) {
      this.props.clearCompaniesFilter();
    }
    this._searchRef.current.value = '';
    this.setState({
      hasSearchText: false
    });
  }

  render () {
    const { l } = this.context.i18n;
    const { companiesFilter } = this.props;
    const { hasSearchText } = this.state;
    return (
      <div className='companies-filter search-block'>
        <input
          type='text'
          name='search'
          ref={this._searchRef}
          placeholder={l('Search')}
          defaultValue={companiesFilter.searchName}
          onChange={this.handleSubmit} />
        {hasSearchText ? <a className='remove' href='/' onClick={this.clearAll}>{l('Clear Filters')}</a> : ''}
      </div>
    );
  }
}
