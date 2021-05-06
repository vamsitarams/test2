import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  isCompanyAdmin,
  isGlobalAdmin,
  isTravelAgencyAdmin,
  isAdmin
} from '../../helpers/user';
import { stateUserRole } from '../../redux/modules/user';
import GAMainMenu from '../../components/menu/gaMainMenu';
import TAAMainMenu from '../../components/menu/taaMainMenu';
import CAMainMenu from '../../components/menu/caMainMenu';
import UsersMainMenu from '../../components/menu/usersMainMenu';

const mapStateToProps = createSelector(
  stateUserRole,
  (userRole) => {
    return {
      userRole
    };
  }
);

export class MainMenuContainer extends React.Component {
  static propTypes = {
    userRole: PropTypes.string
  };

  render () {
    const { userRole } = this.props;
    let menu = null;
    if (isCompanyAdmin(userRole)) {
      menu = <CAMainMenu />;
    }
    if (isTravelAgencyAdmin(userRole)) {
      menu = <TAAMainMenu />;
    }
    if (isGlobalAdmin(userRole)) {
      menu = <GAMainMenu />;
    }
    if (!isAdmin(userRole)) {
      menu = <UsersMainMenu />;
    }
    return menu;
  }
}

export default connect(mapStateToProps, null)(MainMenuContainer);
