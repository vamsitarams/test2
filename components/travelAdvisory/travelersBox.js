import PropTypes from 'prop-types';
import React from 'react';
import { timeInCountry } from '../../helpers/traveler';
import { Link } from 'react-router-dom';

function TravelsBox (props) {
  const { country: { travelers } } = props;
  if (!travelers) return null;
  const travelersIds = Object.keys(travelers);
  return (
    <div className='user-list'>
      {
        travelersIds.map(id => (
          <div className='row' key={id}>
            <div className='info'>
              <h4>
                <Link to={`/traveler/${id}/travel-advisories`}>
                  {travelers[id].firstName} {travelers[id].lastName}
                </Link>{' '}
                {travelers[id].isVIP && <em>VIP</em>}
              </h4>
              <p>{travelers[id].organization && travelers[id].organization.name}</p>
            </div>
            <div className='dates'>
              <p>In country {timeInCountry(props.country.shortCode, travelers[id].products)}</p>
            </div>
          </div>
        ))
      }
    </div>
  );
}

TravelsBox.propTypes = {
  country: PropTypes.object
};

export default TravelsBox;
