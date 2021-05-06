import PropTypes from 'prop-types';
import React from 'react';
import TravelAdvisoryListItem from './TravelAdvisoryListItem';
import sortBy from 'lodash/sortBy';

function TravelAdvisoryList (props) {
  const sortedCountries = props.countries && sortBy(props.countries, 'startsAt.$date').reverse();
  return (
    <ul className='travel-advisory-list'>
      {sortedCountries && sortedCountries.map(country => (
        <TravelAdvisoryListItem key={country.country} country={country} products={props.products} />
      ))}
    </ul>
  );
}

TravelAdvisoryList.propTypes = {
  countries: PropTypes.array,
  products: PropTypes.array
};

export default TravelAdvisoryList;
