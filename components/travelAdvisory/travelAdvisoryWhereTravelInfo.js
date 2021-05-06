import React from 'react';
import { NavLink } from 'react-router-dom';

class TravelAdvisoryWhererTravelInfo extends React.Component {
  render () {
    return (
      <div>
        <h3>Where Can I Travel?</h3>
        <div className='advisory-info'>
          <p>
            For a list of countries including entry restrictions, rules, and quarantine information for Travelers,{' '}
            <NavLink to='/covid19-travel-advisories' activeClassName='active'>click here</NavLink>.
        </p>
        </div>
      </div>
    );
  }
}

export default TravelAdvisoryWhererTravelInfo;
