import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import TravelAdvisory from '../../components/travelAdvisory/travelAdvisory';
import './TravelAdvisoryView.scss';
import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import {
  actions as travelAdvisoryActions,
  stateCountries,
  stateFilteredCountries,
  stateLoading,
  stateActiveCountry,
  stateCountryTravelers
} from '../../redux/modules/travelAdvisory';

const mapStateToProps = createSelector(
  stateAppSettingsDimensions,
  stateCountries,
  stateFilteredCountries,
  stateLoading,
  stateActiveCountry,
  stateCountryTravelers,
  (appSettingsDimensions, countries, filteredCountries, countriesLoading, activeCountry, countryTravelers) => {
    return {
      appSettingsDimensions,
      countries,
      countryTravelers,
      filteredCountries: filteredCountries.length ? filteredCountries : countries,
      countriesLoading,
      activeCountry
    };
  }
);

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(travelAdvisoryActions, dispatch)
  };
};

class TravelAdvisoryView extends React.Component {
  static propTypes = {
    appSettingsDimensions: PropTypes.object.isRequired,
    countries: PropTypes.array.isRequired,
    filteredCountries: PropTypes.array.isRequired,
    activeCountry: PropTypes.object,
    loadCountries: PropTypes.func.isRequired,
    filterCountries: PropTypes.func.isRequired,
    setActiveCountry: PropTypes.func.isRequired
  };

  state = {
    loading: true
  }

  componentDidMount () {
    this.props.loadCountries().then(() => {
      this.setState({ loading: false });
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  render () {
    return (
         <div className='page-content-without-top-whitespace'>
        <TravelAdvisory {...this.state} {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TravelAdvisoryView);
