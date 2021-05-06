import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import LoadingIcon from '../../components/common/loadingIcon';
import Pager from '../common/pager';
import OrganizationUsersFilter from '../organization/organizationUsersFilter';
import OrganizationUsersTable from '../organization/organizationUsersTable';
import OrganizationDetails from '../organization/organizationDetails';
import { isGlobalAdmin } from '../../helpers/user';
import { TYPE_AGENCY, isBlocked } from '../../helpers/organization';

export default class AccountsUsers extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    organizationUsers: PropTypes.array.isRequired,
    organization: PropTypes.object.isRequired,
    organizationUsersFilter: PropTypes.object.isRequired,
    organizationUsersLoading: PropTypes.bool.isRequired,
    organizationUsersPage: PropTypes.number.isRequired,
    organizationUsersTotalPages: PropTypes.number.isRequired,
    organizationUsersSortBy: PropTypes.string.isRequired,
    organizationUsersSortByDirect: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    loadOrganizationUsers: PropTypes.func.isRequired,
    setOrganizationUsersSorter: PropTypes.func.isRequired,
    clearOrganizationUsersFilter: PropTypes.func.isRequired,
    setOrganizationUsersFilter: PropTypes.func.isRequired,
    switchOrganizationUsersPage: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  render () {
    const { l } = this.context.i18n;
    const {
      organizationUsersPage, organization, organizationUsersTotalPages, switchOrganizationUsersPage,
      organizationUsersLoading, organizationUsers, organizationUsersSortBy, setOrganizationUsersSorter,
      organizationUsersSortByDirect, organizationUsersFilter, setOrganizationUsersFilter, clearOrganizationUsersFilter,
      userRole
    } = this.props;

    let addButton;
    if (
      organization &&
      organization.type &&
      organization.type === TYPE_AGENCY &&
      isGlobalAdmin(userRole) &&
      isBlocked(organization) === false
    ) {
      addButton = (
        <div className='buttons-r-list'>
          <Link to={`/accounts/${organization._id.$oid}/add/user`} className='btn btn01'>
            {l('Add User')}
          </Link>
        </div>
      );
    }
    let blockIcon;
    if (isBlocked(organization)) {
      blockIcon = <span className='glyphicon glyphicon-lock' />;
    }

    return (
      <div className='min-container'>
        <div className='head-row'>
          <ul className='breadcrumb'>
            <li><Link to='/'>{l('Accounts')}</Link></li>
            <li>{blockIcon}{organization.name}</li>
          </ul>
          {addButton}
        </div>
        <OrganizationDetails organization={organization} agencyAdmin />
        <OrganizationUsersFilter
          filter={organizationUsersFilter}
          clearFilter={clearOrganizationUsersFilter}
          setFilter={setOrganizationUsersFilter} />
        <LoadingIcon loading={organizationUsersLoading} />
        <OrganizationUsersTable
          loading={organizationUsersLoading}
          users={organizationUsers}
          sortBy={organizationUsersSortBy}
          sortByDirect={organizationUsersSortByDirect}
          organizationId={`/accounts/${organization._id.$oid}`}
          setSorter={setOrganizationUsersSorter} />
        <Pager
          page={organizationUsersPage}
          pages={organizationUsersTotalPages}
          switchPage={switchOrganizationUsersPage} />
      </div>
    );
  }
}
