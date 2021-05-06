import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import Users from '../../components/users/users';
import {
  actions as usersActions,
  stateUsers,
  stateUsersFilter,
  stateUsersLoading,
  stateUsersPage,
  stateUsersTotalPages,
  stateUsersSortBy,
  stateUsersSortByDirect
} from '../../redux/modules/users';

import { stateUser } from '../../redux/modules/user';

const mapStateToProps = createSelector(
  stateUser,
  stateUsers,
  stateUsersFilter,
  stateUsersLoading,
  stateUsersPage,
  stateUsersTotalPages,
  stateUsersSortBy,
  stateUsersSortByDirect,
  (adminUser, users, usersFilter, usersLoading, usersPage,
    usersTotalPages, usersSortBy, usersSortByDirect) => {
    return {
      adminUser,
      users,
      usersFilter,
      usersLoading,
      usersPage,
      usersTotalPages,
      usersSortBy,
      usersSortByDirect
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(usersActions, dispatch)
  };
};

export class UserView extends React.Component {
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

  UNSAFE_componentWillMount () {
    const { adminUser } = this.props;
    this.props.loadUsers(adminUser.organization._id.$oid);
  }

  render () {
    return (
      <div className='users-view'>
        <Users {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
