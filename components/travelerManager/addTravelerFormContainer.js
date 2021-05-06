import PropTypes from 'prop-types';
import React from 'react';

import { Link } from 'react-router-dom';
import TravelerForm from './travelerForm';

export class AddTravelerFormContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    traveler: PropTypes.object.isRequired,
    companiesList: PropTypes.array.isRequired,
    sortLevelIds: PropTypes.array.isRequired,
    errorMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    saveTraveler: PropTypes.func.isRequired,
    loadCompanies: PropTypes.func.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    return (
      <div className='min-container'>
        <div className='head-row'>
          <ul className='breadcrumb users-breadcrumb'>
            <li><Link to='/travelers-list'>{l('Traveler Details')}</Link></li>
            <li>{l('Add Traveler')}</li>
          </ul>
        </div>
        <div className='holder'>
          <div className='side-block'>
            <TravelerForm {...this.props} cancelBtnLink='/travelers-list' />
          </div>
        </div>
      </div>
    );
  }
}
export default AddTravelerFormContainer;
