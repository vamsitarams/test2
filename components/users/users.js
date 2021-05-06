import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import LoadingIcon from '../../components/common/loadingIcon';
import Pager from '../common/pager';
import OrganizationUsersFilter from '../organization/organizationUsersFilter';
import OrganizationUsersTable from '../organization/organizationUsersTable';
import { isBlocked } from '../../helpers/organization';

export default class Users extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    adminUser: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    usersFilter: PropTypes.object.isRequired,
    usersLoading: PropTypes.bool.isRequired,
    usersPage: PropTypes.number.isRequired,
    usersTotalPages: PropTypes.number.isRequired,
    usersSortBy: PropTypes.string.isRequired,
    usersSortByDirect: PropTypes.bool.isRequired,
    loadUsers: PropTypes.func.isRequired,
    setUsersSorter: PropTypes.func.isRequired,
    clearUsersFilter: PropTypes.func.isRequired,
    setUsersFilter: PropTypes.func.isRequired,
    switchUsersPage: PropTypes.func.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    const {
      adminUser, usersPage, usersTotalPages, switchUsersPage,
      usersLoading, users, usersSortBy, setUsersSorter,
      usersSortByDirect, usersFilter, setUsersFilter, clearUsersFilter
    } = this.props;

    const title = adminUser.organization.name + ' ' + l('Users');
    let blockIcon;
    if (isBlocked(adminUser.organization)) {
      blockIcon = <span className='glyphicon glyphicon-lock' />;
    }

    let addUserButton;
    if (adminUser.organization && isBlocked(adminUser.organization) === false) {
      addUserButton = (
        <div className='buttons-r-list'>
          <Link to='/users/add' className='btn btn01 btn-settings'>
            {l('Add User')}
          </Link>
        </div>
      );
    }

    return (
      <div className='min-container'>
        <div className='head-row'>
          <h1>{blockIcon}{title}</h1>
        </div>
        <div className="user-filter">
          <OrganizationUsersFilter
          filter={usersFilter}
          clearFilter={clearUsersFilter}
          setFilter={setUsersFilter} />
          {addUserButton}
          </div>
        <LoadingIcon loading={usersLoading} />
        <OrganizationUsersTable
          loading={usersLoading}
          users={users}
          sortBy={usersSortBy}
          sortByDirect={usersSortByDirect}
          setSorter={setUsersSorter}
        />
        <Pager
          page={usersPage}
          pages={usersTotalPages}
          switchPage={switchUsersPage} />
      </div>
    );
  }
}
