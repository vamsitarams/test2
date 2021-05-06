import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';

import {
  actions as airportStatusesActions,
  stateAirportStatuses
} from '../../redux/modules/airportStatuses';

const mapStateToProps = createSelector(
  stateAirportStatuses,
  (airportStatuses) => {
    return {
      airportStatuses
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(airportStatusesActions, dispatch)
  };
};

class AirportStatusesContainer extends React.Component {
  static propTypes = {
    airportStatuses: PropTypes.array.isRequired,
    loadAirportStatuses: PropTypes.func.isRequired
  };

  componentDidMount () {
    if (!this.props.airportStatuses.length) {
      this.props.loadAirportStatuses();
    }
  }

  render = () => null;
}

export default connect(mapStateToProps, mapDispatchToProps)(AirportStatusesContainer);
