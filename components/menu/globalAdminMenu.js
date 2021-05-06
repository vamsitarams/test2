import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default class GlobalAdminMenu extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  render () {
    const { l } = this.context.i18n;

    return (
      <div className='global-admin-menu'>
        <NavLink to='/accounts' activeClassName='active'>{l('Accounts')}</NavLink>
        <NavLink to='/users' activeClassName='active'>{l('Cornerstone Users')}</NavLink>
      </div>
    );
  }
}
