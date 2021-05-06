import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import FlightsTable from '../../components/flightsStatus/flightsTable';
import LoadingIcon from '../../components/common/loadingIcon';

import {
  actions as travelerDetailsActions,
  stateFlightsStatus
} from '../../redux/modules/travelerDetails';

const mapStateToProps = createSelector(
  stateFlightsStatus,
  (flightsStatus) => {
    return {
      flightsStatus
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerDetailsActions, dispatch)
  };
};

export class FlightStatusContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.object,
    flightsStatus: PropTypes.shape({
      travelerFlights: PropTypes.array.isRequired,
      sortBy: PropTypes.string.isRequired,
      alphabetical: PropTypes.bool.isRequired,
      loading: PropTypes.bool.isRequired
    }),
    userRole: PropTypes.string,
    loadTravelerFlights: PropTypes.func.isRequired,
    setTravelerFlightsSorter: PropTypes.func.isRequired
  };

  UNSAFE_componentWillMount() {
    const { match: { params: { id } }, flightsStatus: { travelerFlights } } = this.props;
    if (!travelerFlights || !travelerFlights.length) {
      this.props.loadTravelerFlights(id);
    }
  }

  render() {
    const { l } = this.context.i18n;
    const { travelerFlights, sortBy, alphabetical, loading } = this.props.flightsStatus;
    let flightsTable;
    if (travelerFlights && travelerFlights.length) {
      flightsTable = (
        <FlightsTable
          travelersFlights={travelerFlights}
          sortBy={sortBy}
          sortByDirect={alphabetical}
          compact
          flightsSorter={this.props.setTravelerFlightsSorter}
        />
      );
    } else if (travelerFlights && !travelerFlights.length && !loading) {
      flightsTable = (<div className='load-events'><span>{l('No flights found')}</span></div>);
    }

    return (
      <div>
        <LoadingIcon loading={loading} />
        {flightsTable}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightStatusContainer);
