import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';

import {
  actions as flightsStatusMapActions,
  stateFlightsStatuses
} from '../../redux/modules/flightsStatusMap';

const mapStateToProps = createSelector(
  stateFlightsStatuses,
  (flightsStatuses) => {
    return {
      flightsStatuses
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(flightsStatusMapActions, dispatch)
  };
};

class FlightsStatusMapContainer extends React.Component {
  static propTypes = {
    flightsStatuses: PropTypes.array.isRequired,
    loadFlightStatuses: PropTypes.func.isRequired
  };

  componentDidMount () {
    if (!this.props.flightsStatuses.length) {
      this.props.loadFlightStatuses();
    }
  }

  render = () => null;
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightsStatusMapContainer);
