import PropTypes from 'prop-types';
import React from 'react';

import LoadingIcon from '../../components/common/loadingIcon';
import Pager from '../common/pager';
import AccountsTable from './accountsTable';
import AccountsFilter from './accountsFilter';
import { Link } from 'react-router-dom';
import { isGlobalAdmin, isTravelAgencyAdmin } from '../../helpers/user';
import { TYPE_COMPANY, TYPE_AGENCY } from '../../helpers/organization';

export default class AccountsList extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    accounts: PropTypes.array.isRequired,
    accountsFilter: PropTypes.object.isRequired,
    accountsLoading: PropTypes.bool.isRequired,
    accountsPage: PropTypes.number.isRequired,
    accountsTotalPages: PropTypes.number.isRequired,
    accountsEmbedded: PropTypes.object.isRequired,
    accountsSortBy: PropTypes.string.isRequired,
    accountsSortByDirect: PropTypes.bool.isRequired,
    setAccountsSorter: PropTypes.func.isRequired,
    clearAccountsFilter: PropTypes.func.isRequired,
    setAccountsFilter: PropTypes.func.isRequired,
    switchAccountsPage: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  render () {
    const { l } = this.context.i18n;
    const {
      accountsPage, accountsTotalPages, switchAccountsPage,
      accountsLoading, accounts, accountsSortBy, setAccountsSorter, accountsSortByDirect,
      accountsEmbedded, accountsFilter, setAccountsFilter, clearAccountsFilter, userRole
    } = this.props;

    let actionButtons;
    let canEditType;
    if (isGlobalAdmin(userRole)) {
      canEditType = TYPE_AGENCY;
      actionButtons = (
        <div className='buttons-r-list'>
          <Link to='/accounts/add' className='btn btn01'>
            {l('Add Agency')}
          </Link>
        </div>
      );
    } else if (isTravelAgencyAdmin(userRole)) {
      canEditType = TYPE_COMPANY;
      actionButtons = (
        <div className='buttons-r-list'>
          <Link to='/companies/add' className='btn btn01'>
            {l('Add Company')}
          </Link>
        </div>
      );
    }

    return (
      <div className='min-container'>
        <div className='head-row'>
          <h1>{l('Accounts')}</h1>
          {actionButtons}
        </div>
        <AccountsFilter
          accountsFilter={accountsFilter}
          accountsEmbedded={accountsEmbedded}
          clearAccountsFilter={clearAccountsFilter}
          setAccountsFilter={setAccountsFilter} />
        <LoadingIcon loading={accountsLoading} />
        {
          accounts.length ? <AccountsTable
            accounts={accounts}
            canEditType={canEditType}
            sortBy={accountsSortBy}
            sortByDirect={accountsSortByDirect}
            setSorter={setAccountsSorter}
            embedded={accountsEmbedded} /> : <span>No results found</span>
        }
        <Pager
          page={accountsPage}
          pages={accountsTotalPages}
          switchPage={switchAccountsPage} />
      </div>
    );
  }
}
