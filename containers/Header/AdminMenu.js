import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { isCompanyAdmin, isGlobalAdmin, isTravelAgencyAdmin } from '../../helpers/user';
import { stateUserRole } from '../../redux/modules/user';
import CompanyAdminMenu from '../../components/menu/companyAdminMenu';
import TravelAgencyAdminMenu from '../../components/menu/travelAgencyAdminMenu';
import GlobalAdminMenu from '../../components/menu/globalAdminMenu';

const mapStateToProps = createSelector(
  stateUserRole,
  (userRole) => {
    return {
      userRole
    };
  }
);

export class AdminMenuContainer extends React.Component {
  static propTypes = {
    userRole: PropTypes.string
  };

  render () {
    const { userRole } = this.props;
    let menu = null;

    if (isCompanyAdmin(userRole)) {
      menu = <CompanyAdminMenu />;
    }
    if (isTravelAgencyAdmin(userRole)) {
      menu = <TravelAgencyAdminMenu />;
    }
    if (isGlobalAdmin(userRole)) {
      menu = <GlobalAdminMenu />;
    }
    return menu;
  }
}

export default connect(mapStateToProps, null)(AdminMenuContainer);
