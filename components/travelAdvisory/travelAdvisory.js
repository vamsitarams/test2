import PropTypes from 'prop-types';
import React from 'react';
import TaMap from '../../containers/TravelAdvisory/TaMap';
import CountryFilter from './countryFilter';
import CountryList from './countryList';
// import TravelAdvisoryInfo from './travelAdvisoryInfo';
// import TravelAdvisoryWhererTravelInfo from './travelAdvisoryWhereTravelInfo';
import TravelAdvisoryPopup from './travelAdvisoryPopup';
import LoadingIcon from '../../components/common/loadingIcon';

import config from '../../config/index';
const headerHeight = config.layout.headerHeight;

export class TravelAdvisory extends React.Component {
  static propTypes = {
    appSettingsDimensions: PropTypes.object.isRequired,
    activeCountry: PropTypes.object,
    countryTravelers: PropTypes.object.isRequired,
    countries: PropTypes.array.isRequired,
    filteredCountries: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    filterCountries: PropTypes.func.isRequired,
    setActiveCountry: PropTypes.func.isRequired
  };

  // TODO optimize if filtered array is not changing
  filterHandler = event => {
    let value = event ? event.target.value : '';
    value = value.toLowerCase();

    const filtered = this.props.countries.filter(country => {
      return country.country.toLowerCase().indexOf(value) !== -1;
    });

    this.props.filterCountries(filtered);
  };

  showCountry = value => {
    if (typeof value === 'string') {
      const activeCountry = this.props.filteredCountries.find(filteredCountry => filteredCountry.country === value);
      this.props.setActiveCountry(activeCountry);
    } else {
      this.props.setActiveCountry(value);
    }
  };

  hideCountry = () => {
    this.props.setActiveCountry(null);
  };

  render () {
    // return null in case if we don't have window height
    if (!this.props.appSettingsDimensions.height) return null;

    // set height style for components
    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };

    return (
      <div className='main-holder travel-advisory-holder'>
        <LoadingIcon loading={this.props.loading} />
        <div style={containerStyle} className='travel-advisory-col'>
          <div className='travel-advisory-col-cnt'>
            {/* <TravelAdvisoryInfo /> */}
            {/* <TravelAdvisoryWhererTravelInfo /> */}
            <CountryFilter changeFilter={this.filterHandler} />
            <CountryList
              showCountry={this.showCountry}
              countries={this.props.filteredCountries}
              countriesLoading={this.props.loading}
            />
          </div>
        </div>
        <div style={containerStyle} className='map-col'>
          <TravelAdvisoryPopup country={this.props.activeCountry} onClose={this.hideCountry} />
          <TaMap onCountrySelect={this.showCountry} />
        </div>
      </div>
    );
  }
}
export default TravelAdvisory;
