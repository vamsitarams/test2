import React from 'react';
import config from '../../config';

class TravelAdvisoryInfo extends React.Component {
  render () {
    return (
      <div>
        <h3>Travel Advisories</h3>
        <div className='advisory-info'>
          <p>
            Information provided directly by the{' '}
            <a href='https://travel.state.gov' rel='noopener noreferrer' target='_blank'>
              United States State Department
            </a>.
          </p>
        </div>
        <h3>State Regulatory Responses to COVID-19</h3>
        <div className='advisory-info'>
        <p>
          Nearly every state is enacting daily changes to their responses to COVID-19. To access the latest{' '}
          emergency regulations by state,{' '}
            <a href={config.links.covid19stateRestrictionsPdf} rel='noopener noreferrer' target='_blank'>
              Click Here!
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default TravelAdvisoryInfo;
