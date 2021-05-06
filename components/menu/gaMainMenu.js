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
      <ul className='nav'>
        <li className='traveler-list-lnk'>
          <NavLink to='/travelers-list' activeClassName='active'><span>{l('Travelers List')}</span></NavLink>
        </li>
      </ul>
    );
  }
}
