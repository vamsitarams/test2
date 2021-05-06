import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import LoadingIcon from '../../components/common/loadingIcon';
import TravelAdvisoryList from '../../components/traveler/travelAdvisory/TravelAdvisoryList';

import {
  actions as travelerDetailsActions,
  stateTravelAdvisoryCountries,
  stateTravelAdvisoryProducts,
  stateTravelAdvisoryLoading
} from '../../redux/modules/travelerDetails';

const mapStateToProps = createSelector(
  stateTravelAdvisoryCountries,
  stateTravelAdvisoryProducts,
  stateTravelAdvisoryLoading,
  (countries, products, loading) => ({ countries, products, loading })
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerDetailsActions, dispatch)
  };
};

export class TravelAdvisoryContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    loading: PropTypes.bool,
    products: PropTypes.array,
    countries: PropTypes.array
  };

  render () {
    const { l } = this.context.i18n;
    const { countries, loading, products } = this.props;

    let countriesList;
    if (countries && countries.length) {
      countriesList = <TravelAdvisoryList countries={countries} products={products} />;
    } else if (countries && !countries.length && !loading) {
      countriesList = (<div className='load-events'><span>{l('No countries found')}</span></div>);
    }

    return (
      <div>
        <LoadingIcon loading={loading} />
        {countriesList}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TravelAdvisoryContainer);
