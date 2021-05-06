import PropTypes from 'prop-types';
import React from 'react';
import CountryListItem from './countryListItem';
import ReactList from 'react-list';

export class CountryList extends React.Component {
  static propTypes = {
    showCountry: PropTypes.func.isRequired,
    countries: PropTypes.array.isRequired,
    countriesLoading: PropTypes.bool.isRequired
  };

  renderItem = (index, key) => {
    let prevCountry = null;
    let showLetter = true;
    const activeCountry = this.props.countries[index];
    const activeLetter = activeCountry.country.charAt(0);

    if (index) {
      prevCountry = this.props.countries[index - 1];
      const prevLetter = prevCountry.country.charAt(0);
      showLetter = activeLetter !== prevLetter;
    }
    return (
      <CountryListItem
        key={key}
        activeCountry={activeCountry}
        showLetter={showLetter}
        showCountry={this.props.showCountry}
      />
    );
  }

  render () {
    const { countries, countriesLoading } = this.props;

    let list = countriesLoading ? (<p>Loading...</p>) : (<p>Result is empty</p>);
    if (countries.length) {
      const sortedCountries = countries.sort((a, b) => {
        if (a.country < b.country) {
          return -1;
        } else if (a.country > b.country) {
          return 1;
        }
        return 0;
      });

      list = (<ReactList
        itemRenderer={this.renderItem}
        length={sortedCountries.length} />);
    }

    return (
      <div className='country-list-cntr'>
        <div className='country-list'>
          {list}
        </div>
      </div>
    );
  }
}
export default CountryList;
