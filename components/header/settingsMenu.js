import PropTypes from 'prop-types';
import React from 'react';
import DropdownMenu from 'react-dd-menu';
import { NavLink } from 'react-router-dom';

import AdminMenu from '../../containers/Header/AdminMenu';
import 'react-dd-menu/dist/react-dd-menu.css';

export default class SettingsMenu extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    menuOptions: PropTypes.object.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    const { menuOptions } = this.props;

    return (
      <DropdownMenu {...menuOptions} className='header-dropdown'>
        <AdminMenu menuClassName='settings-dropdown' />
        <li><NavLink to='/settings/global-filter' activeClassName='active'>{l('Filtering')}</NavLink></li>
        <li><NavLink to='/settings/notifications' activeClassName='active'>{l('Notifications')}</NavLink></li>
      </DropdownMenu>
    );
  }
}
