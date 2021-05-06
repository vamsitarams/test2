import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default class TravelAgencyAdminMenu extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  render () {
    const { l } = this.context.i18n;

    return (
      <div className='agent-admin-menu'>
        <NavLink to='/companies' activeClassName='active'>{l('Companies')}</NavLink>
        <NavLink to='/users' activeClassName='active'>{l('Agency Users')}</NavLink>
      </div>
    );
  }
}
