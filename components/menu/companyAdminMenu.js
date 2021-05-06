import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default class CompanyAdminMenu extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  render () {
    const { l } = this.context.i18n;

    return (
      <div className='company-admin-menu'>
        <NavLink to='/users' activeClassName='active'>{l('Company Users')}</NavLink><br />
      </div>
    );
  }
}
