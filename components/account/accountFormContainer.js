import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
// import isEmpty from 'lodash/isEmpty';
// import { getBackLink } from '../../helpers/userManager';
import { isGlobalAdmin, isTravelAgencyAdmin } from '../../helpers/user';

import AgencyForm from './agencyForm';
import CompanyForm from './companyForm';
import BlockAccount from '../../containers/AccountManager/BlockAccount';
// import LoadingIcon from '../../components/common/loadingIcon';

export class AccountFormContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    organizationLoading: PropTypes.bool,
    organization: PropTypes.object,
    currentUser: PropTypes.object,
    formLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    resetForm: PropTypes.func.isRequired,
    saveOrganization: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    isEdit: PropTypes.bool
  };

  get sideColumn () {
    if (this.props.isEdit) {
      return (
        <div className='additional-section'>
          <ul className='options-list'>
            <li>
              <BlockAccount organization={this.props.organization} />
            </li>
          </ul>
        </div>
      );
    }
  }

  render () {
    const { l } = this.context.i18n;
    const { organization, currentUser: { roleName }, isEdit } = this.props;

    let blockIcon;
    if (organization && organization.status === 'blocked') {
      blockIcon = (<span className='glyphicon glyphicon-lock' />);
    }

    let breadcrumbs;
    let accountForm;
    if (isGlobalAdmin(roleName)) {
      accountForm = <AgencyForm {...this.props} cancelBtnLink='/' isEdit={this.props.isEdit} />;
      breadcrumbs = (
        <ul className='breadcrumb'>
          <li><Link to='/'>{l('Accounts')}</Link></li>
          {isEdit
            ? (
            <li>{blockIcon}{organization.name}</li>)
            : (
              <li>{l('Add Agency')}</li>
              )}
        </ul>
      );
    } else if (isTravelAgencyAdmin(roleName)) {
      accountForm = <CompanyForm {...this.props} cancelBtnLink='/' isEdit={this.props.isEdit} />;
      breadcrumbs = (
        <ul className='breadcrumb users-breadcrumb'>
          <li><Link to={'/'}>{l('Companies')}</Link></li>
          {isEdit
            ? (
            <li>{blockIcon}{organization.name}</li>)
            : (
            <li>{l('Add Company')}</li>
              )}
        </ul>
      );
    }

    return (
      <div className='min-container'>
        <div className='head-row'>
          {breadcrumbs}
        </div>
        <div className='holder accounts-form-holder'>
          <div className='side-block'>
            {accountForm}
          </div>
          {this.sideColumn}
        </div>
      </div>
    );
  }
}
export default AccountFormContainer;
