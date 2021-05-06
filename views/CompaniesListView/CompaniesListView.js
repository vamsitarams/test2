import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import CompaniesList from '../../components/companies/companiesList';
import {
  actions as companiesListActions,
  stateCompanies,
  stateCompaniesFilter,
  stateCompaniesLoading,
  stateCompaniesPage,
  stateCompaniesTotalPages,
  stateCompaniesSortBy,
  stateCompaniesSortByDirect
} from '../../redux/modules/companiesList';

import { stateUserRole } from '../../redux/modules/user';

const mapStateToProps = createSelector(
  stateCompanies,
  stateCompaniesFilter,
  stateCompaniesLoading,
  stateCompaniesPage,
  stateCompaniesTotalPages,
  stateCompaniesSortBy,
  stateCompaniesSortByDirect,
  stateUserRole,
  (companies, companiesFilter, companiesLoading, companiesPage, companiesTotalPages,
    companiesSortBy, companiesSortByDirect, userRole) => {
    return {
      companies,
      companiesFilter,
      companiesLoading,
      companiesPage,
      companiesTotalPages,
      companiesSortBy,
      companiesSortByDirect,
      userRole
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(companiesListActions, dispatch)
  };
};

export class CompaniesListView extends React.Component {
  static propTypes = {
    companies: PropTypes.array.isRequired,
    companiesFilter: PropTypes.object.isRequired,
    companiesLoading: PropTypes.bool.isRequired,
    companiesPage: PropTypes.number.isRequired,
    companiesTotalPages: PropTypes.number.isRequired,
    companiesSortBy: PropTypes.string.isRequired,
    companiesSortByDirect: PropTypes.bool.isRequired,
    loadCompanies: PropTypes.func.isRequired,
    setCompaniesSorter: PropTypes.func.isRequired,
    clearCompaniesFilter: PropTypes.func.isRequired,
    setCompaniesFilter: PropTypes.func.isRequired,
    switchCompaniesPage: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  UNSAFE_componentWillMount () {
    this.props.loadCompanies();
  }

  render () {
    return (
      <div className='companies-view'>
        <CompaniesList {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesListView);
