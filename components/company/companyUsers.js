import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Pager from '../common/pager';
import OrganizationUsersFilter from '../organization/organizationUsersFilter';
import OrganizationUsersTable from '../organization/organizationUsersTable';
import OrganizationDetails from '../organization/organizationDetails';
import { isBlocked } from '../../helpers/organization';

export default class CompanyUsers extends React.Component {
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
    userRole: PropTypes.string.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    const {
      organizationUsersPage, organization, organizationUsersTotalPages, switchOrganizationUsersPage,
      organizationUsersLoading, organizationUsers, organizationUsersSortBy, setOrganizationUsersSorter,
      organizationUsersSortByDirect, organizationUsersFilter, setOrganizationUsersFilter, clearOrganizationUsersFilter
      /* , userRole */
    } = this.props;

    // let editBtn;
    // if (isCompanyAdminOrUser(userRole)) {
    //   editBtn = <Link to={`/companies/${organization._id.$oid}/edit`} className='btn btn-default btn-edit'>
    //     {l('Edit')}
    //   </Link>;
    // }

    let addUserButton;
    if (organization && isBlocked(organization) === false) {
      addUserButton = (
        <div className='buttons-r-list'>
          <Link to={'/companies/' + organization._id.$oid + '/add/user'} className='btn btn01 btn-settings'>
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
            <li><Link to='/'>{l('Companies')}</Link></li>
            <li>{blockIcon}{organization.name}</li>
          </ul>
          {/* editBtn */}
          {addUserButton}
        </div>
        <OrganizationDetails organization={organization} />
        <OrganizationUsersFilter
          filter={organizationUsersFilter}
          clearFilter={clearOrganizationUsersFilter}
          setFilter={setOrganizationUsersFilter} />
        <OrganizationUsersTable
          loading={organizationUsersLoading}
          users={organizationUsers}
          sortBy={organizationUsersSortBy}
          sortByDirect={organizationUsersSortByDirect}
          setSorter={setOrganizationUsersSorter}
          organizationId={`/companies/${organization._id.$oid}`}
        />
        <Pager
          page={organizationUsersPage}
          pages={organizationUsersTotalPages}
          switchPage={switchOrganizationUsersPage} />
      </div>
    );
  }
}
