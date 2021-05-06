import PropTypes from 'prop-types';
import React from 'react';

import LoadingIcon from '../../components/common/loadingIcon';
import Pager from '../common/pager';
import CompaniesTable from './companiesTable';
import CompaniesFilter from './companiesFilter';
import { isTravelAgencyAdmin } from '../../helpers/user';
import { TYPE_COMPANY } from '../../helpers/organization';
import { Link } from 'react-router-dom';

export default class CompaniesList extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    companies: PropTypes.array.isRequired,
    companiesFilter: PropTypes.object.isRequired,
    companiesLoading: PropTypes.bool.isRequired,
    companiesPage: PropTypes.number.isRequired,
    companiesTotalPages: PropTypes.number.isRequired,
    companiesSortBy: PropTypes.string.isRequired,
    companiesSortByDirect: PropTypes.bool.isRequired,
    setCompaniesSorter: PropTypes.func.isRequired,
    clearCompaniesFilter: PropTypes.func.isRequired,
    setCompaniesFilter: PropTypes.func.isRequired,
    switchCompaniesPage: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  render () {
    const { l } = this.context.i18n;
    const {
      companiesPage, companiesTotalPages, switchCompaniesPage,
      companiesLoading, companies, companiesSortBy, setCompaniesSorter, companiesSortByDirect,
      companiesFilter, setCompaniesFilter, clearCompaniesFilter, userRole
    } = this.props;

    let actionButtons;
    let canEditType;
    if (isTravelAgencyAdmin(userRole)) {
      canEditType = TYPE_COMPANY;
      actionButtons = (
        <div className='buttons-r-list'>
          <Link to='/companies/add' className='btn btn01 btn-settings'>
            {l('Add Company')}
          </Link>
        </div>
      );
    }

    return (
      <div className='min-container'>
        <div className='head-row'>
          <h1>{l('Companies')}</h1>
        </div>
        <div className="user-filter">
          <CompaniesFilter
          companiesFilter={companiesFilter}
          clearCompaniesFilter={clearCompaniesFilter}
          setCompaniesFilter={setCompaniesFilter} />
          {actionButtons}
        </div>
        <LoadingIcon loading={companiesLoading} />
        <CompaniesTable
          canEditType={canEditType}
          companies={companies}
          sortBy={companiesSortBy}
          sortByDirect={companiesSortByDirect}
          setSorter={setCompaniesSorter} />
        <Pager
          page={companiesPage}
          pages={companiesTotalPages}
          switchPage={switchCompaniesPage} />
      </div>
    );
  }
}
