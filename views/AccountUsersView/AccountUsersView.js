import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import config from '../../config/index';

import LoadingIcon from '../../components/common/loadingIcon';
import AccountUsers from '../../components/account/accountUsers';
import { stateUserRole } from '../../redux/modules/user';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import {
  actions as organizationUsersActions,
  stateOrganizationUsers,
  stateOrganization,
  stateOrganizationUsersFilter,
  stateOrganizationUsersLoading,
  stateOrganizationUsersPage,
  stateOrganizationUsersTotalPages,
  stateOrganizationUsersSortBy,
  stateOrganizationUsersSortByDirect
} from '../../redux/modules/organizationUsers';
const headerHeight = config.layout.headerHeight;

const mapStateToProps = createSelector(
  stateOrganizationUsers,
  stateOrganization,
  stateOrganizationUsersFilter,
  stateOrganizationUsersLoading,
  stateOrganizationUsersPage,
  stateOrganizationUsersTotalPages,
  stateOrganizationUsersSortBy,
  stateOrganizationUsersSortByDirect,
  stateAppSettingsDimensions,
  stateUserRole,
  (organizationUsers, organization, organizationUsersFilter, organizationUsersLoading, organizationUsersPage,
    organizationUsersTotalPages, organizationUsersSortBy, organizationUsersSortByDirect, appSettingsDimensions,
    userRole) => {
    return {
      organizationUsers,
      organization,
      organizationUsersFilter,
      organizationUsersLoading,
      organizationUsersPage,
      organizationUsersTotalPages,
      organizationUsersSortBy,
      organizationUsersSortByDirect,
      appSettingsDimensions,
      userRole
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(organizationUsersActions, dispatch)
  };
};

export class AccountUserView extends React.Component {
  static propTypes = {
    match: PropTypes.any,
    organizationUsers: PropTypes.array.isRequired,
    organization: PropTypes.oneOfType([
      PropTypes.bool, PropTypes.object
    ]).isRequired,
    organizationUsersFilter: PropTypes.object.isRequired,
    organizationUsersLoading: PropTypes.bool.isRequired,
    organizationUsersPage: PropTypes.number.isRequired,
    organizationUsersTotalPages: PropTypes.number.isRequired,
    organizationUsersSortBy: PropTypes.string.isRequired,
    organizationUsersSortByDirect: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    loadOrganizationUsers: PropTypes.func.isRequired,
    loadOrganization: PropTypes.func.isRequired,
    setOrganizationUsersSorter: PropTypes.func.isRequired,
    clearOrganizationUsersFilter: PropTypes.func.isRequired,
    setOrganizationUsersFilter: PropTypes.func.isRequired,
    switchOrganizationUsersPage: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  getData () {
    const { organization, match: { params } } = this.props;
    if (params.id) {
      this.props.loadOrganizationUsers(params.id);
    }
    if (!organization || (organization._id && organization._id.$oid !== params.id)) {
      this.props.loadOrganization(params.id);
    }
  }

  UNSAFE_componentWillMount () {
    this.getData();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getData();
    }
  }

  render () {
    // set height style for components
    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };
    const { organization, match: { params } } = this.props;
    if (!organization || (organization && organization._id.$oid !== params.id)) {
      return (
        <div className='account-users-view page-content'>
          <LoadingIcon loading />
        </div>
      );
    }

    return (
      <div className='account-users-view page-content' style={containerStyle}>
        <AccountUsers {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountUserView);
