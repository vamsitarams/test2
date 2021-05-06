import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { getBackLink } from '../../helpers/userManager';
import { isCompanyAdmin, isGlobalAdmin, isTravelAgencyAdmin } from '../../helpers/user';

import UserForm from './userForm';
import BlockUser from '../../containers/UserManager/BlockUser';
import LoadingIcon from '../../components/common/loadingIcon';

export class UserFormContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    userLoading: PropTypes.bool,
    organizations: PropTypes.array,
    organization: PropTypes.object,
    location: PropTypes.object,
    currentUser: PropTypes.object,
    formLoading: PropTypes.bool.isRequired,
    resetPasswordLoading: PropTypes.bool,
    errorMessage: PropTypes.string.isRequired,
    resetForm: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    resetPassword: PropTypes.func,
    isEdit: PropTypes.bool
  };

  get sideColumn () {
    const { l } = this.context.i18n;
    const { user, resetPasswordLoading } = this.props;

    if (this.props.isEdit) {
      const resetLoading = resetPasswordLoading ? (<LoadingIcon loading />) : null;
      return (
        <div className='additional-section  editTravelerSection'>
          <ul className='options-list'>
            <li>
              <BlockUser
                userId={user._id.$oid}
                userStatus={user.status} />
            </li>
            <li>
              <a className='reset-pass-link' href='#' onClick={this.onResetPassword} >{l('Reset Password')}</a>
              {resetLoading}
            </li>
          </ul>
        </div>
      );
    }
  }

  onResetPassword = (e) => {
    e.preventDefault();
    this.props.resetPassword(this.props.user._id.$oid);
  }

  render () {
    const { l } = this.context.i18n;
    const { user, location, organization, currentUser: { roleName }, isEdit } = this.props;

    let blockIcon;
    if (user && user.status === 'blocked') {
      blockIcon = (<span className='glyphicon glyphicon-lock' />);
    }

    const userPath = isEdit ? 'users/edit' : '/add/user';
    const userLink = isEdit ? (<li>{blockIcon}{user.firstName} {user.lastName}</li>) : (
      <li>{l('Add User')}</li>
    );

    const adminsCompany = this.props.currentUser.organization.name;
    const adminsCompanyBackLink = isCompanyAdmin(roleName) ? '/' : '/users';
    let backLink = adminsCompanyBackLink;

    let middleLink;
    if (!isEmpty(organization)) {
      backLink = getBackLink(location.pathname, userPath);
      middleLink = (<li><Link to={backLink}>{organization.name}</Link></li>);
    }

    let breadcrumbs;

    if (!middleLink) {
      breadcrumbs = (
        <ul className='breadcrumb users-breadcrumb'>
          <li><Link to={backLink}>{adminsCompany} {l('Users')}</Link></li>
          {userLink}
        </ul>
      );
    } else {
      if (isGlobalAdmin(roleName)) {
        breadcrumbs = (
          <ul className='breadcrumb'>
            <li><Link to='/'>{l('Accounts')}</Link></li>
            {middleLink}
            {userLink}
          </ul>
        );
      }

      if (isTravelAgencyAdmin(roleName)) {
        breadcrumbs = (
          <ul className='breadcrumb'>
            <li><Link to={'/'}>{l('Companies')}</Link></li>
            {middleLink}
            {userLink}
          </ul>
        );
      }
    }

    return (
      <div className='min-container'>
        <div className='head-row'>
          {breadcrumbs}
        </div>
        <div className='holder'>
          <div className='side-block'>
            <UserForm {...this.props} cancelBtnLink={backLink} isEdit={this.props.isEdit} />
          </div>
          {this.sideColumn}
        </div>
      </div>
    );
  }
}
export default UserFormContainer;
