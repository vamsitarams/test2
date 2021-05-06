import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import FlightsStatusList from '../../components/flightsStatus/flightsStatusList';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import {
  actions as flightStatusListActions,
  stateTravelersFlights,
  stateTravelersFlightsFilter,
  stateTravelersFlightsLoading,
  stateTravelersFlightsPage,
  stateTravelersFlightsMeta,
  stateTravelersFlightsFilterEmbedded,
  stateTravelersFlightsSortBy,
  stateTravelersFlightsSortByDirect
} from '../../redux/modules/flightsStatus';

import { stateSidebar } from '../../redux/modules/sidebar';

import { stateUserRole } from '../../redux/modules/user';

const mapStateToProps = createSelector(
  stateSidebar,
  stateTravelersFlights,
  stateTravelersFlightsFilter,
  stateTravelersFlightsLoading,
  stateTravelersFlightsPage,
  stateTravelersFlightsMeta,
  stateTravelersFlightsFilterEmbedded,
  stateTravelersFlightsSortBy,
  stateTravelersFlightsSortByDirect,
  stateUserRole,
  stateAppSettingsDimensions,
  (sidebar, travelersFlights, travelersFlightsFilter, travelersFlightsLoading, travelersFlightsPage, travelersFlightsMeta,
    travelersFlightsFilterEmbedded, travelersFlightsSortBy, travelersFlightsSortByDirect,
    userRole, appSettingsDimensions) => {
    let filteredTravelersFlights = travelersFlights;
    let flightsAreFiltered = false;
    if (travelersFlightsFilter.nonHelped) {
      filteredTravelersFlights = travelersFlights.filter((travelerFlight) => {
        if (travelerFlight.helpedBy && travelerFlight.helpedBy.status === 'opened') {
          flightsAreFiltered = true;
          return false;
        }
        return true;
      });
    }
    return {
      travelersFlights: filteredTravelersFlights,
      flightsAreFiltered,
      travelersFlightsFilter,
      travelersFlightsLoading,
      travelersFlightsPage,
      travelersFlightsMeta,
      travelersFlightsFilterEmbedded,
      travelersFlightsSortBy,
      travelersFlightsSortByDirect,
      appSettingsDimensions,
      userRole,
      sidebar
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(flightStatusListActions, dispatch)
  };
};

export class FlightStatusView extends React.Component {
  static propTypes = {
    travelersFlights: PropTypes.array.isRequired,
    travelersFlightsFilter: PropTypes.object.isRequired,
    travelersFlightsLoading: PropTypes.bool.isRequired,
    flightsAreFiltered: PropTypes.bool.isRequired,
    travelersFlightsPage: PropTypes.number.isRequired,
    travelersFlightsMeta: PropTypes.object.isRequired,
    travelersFlightsFilterEmbedded: PropTypes.object.isRequired,
    travelersFlightsSortBy: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
    travelersFlightsSortByDirect: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    setTravelersFlightsSorter: PropTypes.func.isRequired,
    loadTravelersFlights: PropTypes.func.isRequired,
    setTravelersFlightsFilter: PropTypes.func.isRequired,
    switchTravelersFlightsPage: PropTypes.func.isRequired,
    clearTravelersFlightsFilter: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this._load = false;
  }

  UNSAFE_componentWillMount() {
    this.props.loadTravelersFlights();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.flightsAreFiltered && !this._load) {
      this.props.loadTravelersFlights().then(() => {
        this._load = false;
      });
      this._load = true;
    }
  }

  render() {
    return (
      <FlightsStatusList {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightStatusView);
