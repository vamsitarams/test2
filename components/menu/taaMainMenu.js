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
        <li className='active-travelers-lnk'>
          <NavLink to='/active-travelers' activeClassName='active'><span>{l('Active Travelers')}</span></NavLink>
        </li>
        <li className='traveler-list-lnk'>
          <NavLink to='/travelers-list' activeClassName='active'><span>{l('Travelers List')}</span></NavLink>
        </li>
        <li className='flight-status-lnk'>
          <NavLink to='/flights-status' activeClassName='active'><span>{l('Flights')}</span></NavLink>
        </li>
        <li className='covid19-lnk'>
          <NavLink to='/covid19' activeClassName='active'><span>{l('COVID-19 Map')}</span></NavLink>
        </li>
        <li className='travel-advisors-lnk'>
          <NavLink to='/travel-advisories' activeClassName='active'><span>{l('Travel Advisories')}</span></NavLink>
        </li>
      </ul>
    );
  }
}
