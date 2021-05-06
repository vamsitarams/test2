import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import AccountsList from '../../components/accounts/accountsList';
import {
  actions as accountsListActions,
  stateAccounts,
  stateAccountsFilter,
  stateAccountsLoading,
  stateAccountsPage,
  stateAccountsTotalPages,
  stateAccountsEmbedded,
  stateAccountsSortBy,
  stateAccountsSortByDirect
} from '../../redux/modules/accountsList';

import { stateUserRole } from '../../redux/modules/user';

const mapStateToProps = createSelector(
  stateAccounts,
  stateAccountsFilter,
  stateAccountsLoading,
  stateAccountsPage,
  stateAccountsTotalPages,
  stateAccountsEmbedded,
  stateAccountsSortBy,
  stateAccountsSortByDirect,
  stateUserRole,
  (accounts, accountsFilter, accountsLoading, accountsPage, accountsTotalPages,
    accountsEmbedded, accountsSortBy, accountsSortByDirect, userRole) => {
    return {
      accounts,
      accountsFilter,
      accountsLoading,
      accountsPage,
      accountsTotalPages,
      accountsEmbedded,
      accountsSortBy,
      accountsSortByDirect,
      userRole
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(accountsListActions, dispatch)
  };
};

export class AccountsListView extends React.Component {
  static propTypes = {
    location: PropTypes.any,
    accounts: PropTypes.array.isRequired,
    accountsFilter: PropTypes.object.isRequired,
    accountsLoading: PropTypes.bool.isRequired,
    accountsPage: PropTypes.number.isRequired,
    accountsTotalPages: PropTypes.number.isRequired,
    accountsEmbedded: PropTypes.object.isRequired,
    accountsSortBy: PropTypes.string.isRequired,
    accountsSortByDirect: PropTypes.bool.isRequired,
    loadAccounts: PropTypes.func.isRequired,
    setAccountsSorter: PropTypes.func.isRequired,
    clearAccountsFilter: PropTypes.func.isRequired,
    setAccountsFilter: PropTypes.func.isRequired,
    switchAccountsPage: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  UNSAFE_componentWillMount () {
    if (this.props.location.query && this.props.location.query.agency) {
      this.props.setAccountsFilter({
        associatedAgency: this.props.location.query.agency,
        searchName: null
      });
    }
    this.props.loadAccounts();
  }

  render () {
    return (
      <div className='accounts-view page-content'>
        <AccountsList {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsListView);
