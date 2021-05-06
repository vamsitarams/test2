import PropTypes from 'prop-types';

import React from 'react';

import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import { bindActionCreators } from 'redux';

import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import config from '../../config';
import {
  airportStatusesByTraveler,
  getAvailableAirportStatuses,
  airportStatusesStatusFilter,
  availableAirportTimeframes,
  airportStatusesTimeframeFilter,
  availableStatusesFilter
} from '../../helpers/airportStatusesFilters';
import {
  flightsStatusesByTraveler,
  flightsStatusesTimeframeFilter
} from '../../helpers/flightsStatusesFilters';
import { sessionStorage } from '../../helpers/localStorage';
import {
  drawAirportStatusesHelper,
  drawLocationsHelper,
  drawFlightStatusesArcsHelper,
  popupTabsInit,
  clearMap,
  createMap
} from '../../helpers/map';
import MapControls from '../../components/common/mapControls';
import {
  actions as airportStatusActions,
  stateAirportStatuses, stateTdAirportFilterStatus, stateTdAirportFilterTimeframe
} from '../../redux/modules/airportStatuses';
import {
  actions as flightStatusActions,
  stateFlightsStatuses,
  stateTdFlightStatusFilterTimeframe
} from '../../redux/modules/flightsStatusMap';
import {
  actions as travelerDetailsActions,
  stateTraveler,
  stateTravelerMapView
} from '../../redux/modules/travelerDetails';
import { stateUserRole } from '../../redux/modules/user';

const timeframes = config.map.timeframes;

const mapStateToProps = createSelector(
  stateTraveler,
  stateTravelerMapView,
  stateAirportStatuses,
  stateTdAirportFilterStatus,
  stateTdAirportFilterTimeframe,
  stateFlightsStatuses,
  stateTdFlightStatusFilterTimeframe,
  stateUserRole,
  (
    traveler, mapView, airportStatuses, filterAirportStatus, filterAirportTimeframe,
    flightsStatuses, filterFlightStatusTimeframe, userRole
  ) => {
    // airport props
    let travelerAirportStatuses = [];
    // filter by airport status
    let availableAirportTimeframesOptions = timeframes;
    let availableAirportStatuses = [];
    if (mapView === 'airportStatus') {
      // filter all status by traveler
      travelerAirportStatuses = airportStatusesByTraveler(airportStatuses, traveler);
      // get available statuses for select field
      availableAirportStatuses = getAvailableAirportStatuses(travelerAirportStatuses);
      if (filterAirportStatus && travelerAirportStatuses.length) {
        // filter airports by status
        travelerAirportStatuses = airportStatusesStatusFilter(travelerAirportStatuses, filterAirportStatus);
        availableAirportTimeframesOptions = availableAirportTimeframes(timeframes, travelerAirportStatuses);
      }
      // filter by traveler presence timeframe
      if (filterAirportTimeframe && travelerAirportStatuses.length) {
        // filter airports by timeframe
        travelerAirportStatuses = airportStatusesTimeframeFilter(travelerAirportStatuses, filterAirportTimeframe);
        availableAirportStatuses = availableStatusesFilter(availableAirportStatuses, travelerAirportStatuses);
      }
    }
    const availableFlightStatusTimeframesOptions = timeframes;
    if (mapView === 'flightsStatus' && flightsStatuses) {
      if (flightsStatuses.length) {
        flightsStatuses = flightsStatusesByTraveler(flightsStatuses, traveler);
      }
      // filter by traveler presence timeframe
      if (filterFlightStatusTimeframe && flightsStatuses.length) {
        flightsStatuses = flightsStatusesTimeframeFilter(flightsStatuses, filterFlightStatusTimeframe);
      }
    }
    return {
      traveler,
      mapView,
      travelerAirportStatuses,
      availableAirportStatuses,
      availableAirportTimeframes: availableAirportTimeframesOptions,
      filterAirportStatus,
      filterAirportTimeframe,
      flightsStatuses,
      filterFlightStatusTimeframe,
      userRole,
      availableFlightsStatusesTimeframes: availableFlightStatusTimeframesOptions
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerDetailsActions, dispatch),
    ...bindActionCreators(airportStatusActions, dispatch),
    ...bindActionCreators(flightStatusActions, dispatch)
  };
};

class MapContainer extends React.Component {
  static propTypes = {
    traveler: PropTypes.object.isRequired,
    travelerAirportStatuses: PropTypes.array.isRequired,
    availableAirportStatuses: PropTypes.array.isRequired,
    availableAirportTimeframes: PropTypes.array.isRequired,
    filterAirportStatus: PropTypes.string.isRequired,
    filterAirportTimeframe: PropTypes.number.isRequired,
    filterFlightStatusTimeframe: PropTypes.number.isRequired,
    flightsStatuses: PropTypes.array.isRequired,
    availableFlightsStatusesTimeframes: PropTypes.array.isRequired,
    mapView: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
    travelerSwitchMapView: PropTypes.func.isRequired,
    changeTdAirportStatusFilter: PropTypes.func.isRequired,
    changeTdAirportTimeframeFilter: PropTypes.func.isRequired,
    changeTdFlightStatusTimeframeFilter: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor (props) {
    super(props);
    this._map = null;
    this._markerClusterGroup = null;
    this._airportMarkers = [];
    this._flightsArcs = null;
    this.state = {
      pinnedFlightPopup: false
    };
  }

  clearMap () {
    const result = clearMap(
      this._map,
      this._markerClusterGroup,
      this._airportMarkers,
      this._flightsArcs
    );
    this._markerClusterGroup = result.markerClusterGroup;
    this._airportMarkers = result.airportMarkers;
    this._flightsArcs = result.flightsArcs;
  }

  drawLocations () {
    // draw locations markers
    if (this.props.mapView === 'locations') {
      this.clearMap();
      this._markerClusterGroup = drawLocationsHelper(
        this.props.traveler,
        this._map,
        this.props.userRole
      );
    }
  }

  drawAirportStatuses () {
    // draw airportStatus markers
    if (this.props.mapView === 'airportStatus') {
      this.clearMap();
      this._airportMarkers = drawAirportStatusesHelper(
        this._airportMarkers,
        this.props.travelerAirportStatuses,
        this._map
      );
    }
  }

  drawFlightsStatuses () {
    // draw airportStatus markers
    if (this.props.mapView === 'flightsStatus') {
      this.clearMap();
      this._flightsArcs = drawFlightStatusesArcsHelper(
        this.props.flightsStatuses,
        [this.props.traveler], // filtered travelers
        this._map,
        this.pineFlightPopup,
        this.shouldShowAnotherPopup,
        this.props.userRole
      );
    }
  }

  componentDidUpdate () {
    this.drawLocations();
    this.drawAirportStatuses();
    this.drawFlightsStatuses();
  }

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.traveler, nextProps.traveler) ||
      !isEqual(this.props.flightsStatuses, nextProps.flightsStatuses) ||
      !isEqual(this.props.travelerAirportStatuses, nextProps.travelerAirportStatuses) ||
      !isEqual(this.props.availableAirportStatuses, nextProps.availableAirportStatuses) ||
      !isEqual(this.props.filterAirportTimeframe, nextProps.filterAirportTimeframe) ||
      !isEqual(this.props.filterAirportStatus, nextProps.filterAirportStatus) ||
      !isEqual(this.props.filterFlightStatusTimeframe, nextProps.filterFlightStatusTimeframe) ||
      !isEqual(this.props.mapView, nextProps.mapView)
    );
  }

  shouldShowAnotherPopup = () => {
    return !this.state.pinnedFlightPopup;
  };

  pineFlightPopup = (line1, line2) => {
    this.setState({
      pinnedFlightPopup: true
    });
  };

  componentDidMount () {
    this._map = createMap('travelerMap',
      sessionStorage.get('TdLng') || config.map.defaultLon,
      sessionStorage.get('TdLat') || config.map.defaultLat,
      sessionStorage.get('TdZoom') || config.map.minZoom);

    this.drawLocations();
    this.drawAirportStatuses();
    this.drawFlightsStatuses();

    // add debounce for updates to prevent memory leak
    const setCoords = debounce(() => {
      const center = this._map.getCenter();
      sessionStorage.set('TdLat', center.lat);
      sessionStorage.set('TdLng', center.lng);
    }, 300);
    this._map.on('move', () => {
      setCoords();
    });
    this._map.on('click', () => {
      this.setState({
        pinnedFlightPopup: false
      });
    });
    this._map.on('zoomend', debounce(() => {
      // TODO: mapbox-gl POPUP
      // this._map.closePopup();
      this.setState({
        pinnedFlightPopup: false
      });
      let nextZoom = this._map.getZoom();
      if (nextZoom > config.map.maxZoom) nextZoom = config.map.maxZoom;
      if (nextZoom < config.map.minZoom) nextZoom = config.map.minZoom;
      sessionStorage.set('TdZoom', nextZoom);
    }, 200));
    popupTabsInit();
  }

  componentWillUnmount () {
    this._map.remove();
    this._map = null;
    this._markerClusterGroup = null;
    this._airportMarkers = [];
    this._flightsArcs = null;
  }

  render () {
    return (
      <div className='travelersMap'>
        <MapControls
          airportStatuses={this.props.availableAirportStatuses}
          airportTimeframes={this.props.availableAirportTimeframes}
          flightStatusTimeframes={this.props.availableFlightsStatusesTimeframes}
          filterAirportTimeframe={this.props.filterAirportTimeframe}
          filterAirportStatus={this.props.filterAirportStatus}
          filterFlightStatusTimeframe={this.props.filterFlightStatusTimeframe}
          mapView={this.props.mapView}
          switchMapView={this.props.travelerSwitchMapView}
          changeAirportStatusFilter={this.props.changeTdAirportStatusFilter}
          changeAirportTimeframeFilter={this.props.changeTdAirportTimeframeFilter}
          changeFlightStatusTimeframeFilter={this.props.changeTdFlightStatusTimeframeFilter}
          />
        <div id='travelerMap' className='map' />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
