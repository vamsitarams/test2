import PropTypes from 'prop-types';

import React from 'react';

import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import { bindActionCreators } from 'redux';

import $ from 'jquery';

import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import lodashFilter from 'lodash/filter';

import config from '../../config';
import activeTravelersFilter from '../../helpers/activeTravelersFilter';
import {
  airportStatusesStatusFilter,
  airportStatusesTimeframeFilter,
  airportStatusesByTravelers,
  availableStatusesFilter,
  availableAirportTimeframes,
  getAvailableAirportStatuses
} from '../../helpers/airportStatusesFilters';
import {
  flightsStatusesByTravelers,
  flightsStatusesTimeframeFilter
} from '../../helpers/flightsStatusesFilters';
import { sessionStorage } from '../../helpers/localStorage';
import {
  drawAirportStatusesHelper,
  drawLocationsHelper,
  getVisibleMarkersHelper,
  drawFlightStatusesArcsHelper,
  popupTabsInit,
  clearMap,
  createMap
} from '../../helpers/map';
import MapControls from '../../components/common/mapControls';
import { stateActiveTravelers, stateFilter } from '../../redux/modules/activeTravelers';
import {
  actions as airportStatusesActions,
  stateAirportStatuses, stateFilterAirportStatus, stateFilterAirportTimeframe
} from '../../redux/modules/airportStatuses';
import {
  actions as mapActions,
  stateAtMapView,
  stateOnTheMap,
  stateAreaShown
} from '../../redux/modules/atMap';
import {
  actions as flightStatusActions,
  stateFlightsStatuses,
  stateFilterFlightStatusTimeframe
} from '../../redux/modules/flightsStatusMap';
import { stateUserRole } from '../../redux/modules/user';

const timeframes = config.map.timeframes;

const mapStateToProps = createSelector(
  stateActiveTravelers,
  stateFilter,
  stateAtMapView,
  stateOnTheMap,
  stateAirportStatuses,
  stateFilterAirportStatus,
  stateFilterAirportTimeframe,
  stateFlightsStatuses,
  stateFilterFlightStatusTimeframe,
  stateUserRole,
  stateAreaShown,
  (activeTravelers, filter, atMapView, onTheMap,
    airports, filterAirportStatus, filterAirportTimeframe,
    flights, filterFlightStatusTimeframe, userRole, areaShown) => {
    let filteredActiveTravelers = activeTravelers;
    if (activeTravelers.length) {
      filteredActiveTravelers = activeTravelersFilter(activeTravelers, { ...filter, areaShown });
      filteredActiveTravelers = lodashFilter(filteredActiveTravelers, { status: 'active' });
    }
    // airports
    // get available airport statuses for select field
    let availableAirportStatuses = getAvailableAirportStatuses(airports);
    // filter by airport status
    let availableAirportTimeframesOptions = timeframes;
    if (atMapView === 'airportStatus') {
      // filter by airport presence timeframe
      if (filterAirportTimeframe && airports.length) {
        airports = airportStatusesTimeframeFilter(airports, filterAirportTimeframe);
        availableAirportStatuses = availableStatusesFilter(availableAirportStatuses, airports);
      }

      if (filterAirportStatus && airports.length) {
        airports = airportStatusesStatusFilter(airports, filterAirportStatus);
        availableAirportTimeframesOptions = availableAirportTimeframes(timeframes, airports);
      }

      // display airports only with filtered active travelers
      if (
        activeTravelers && activeTravelers.length !== filteredActiveTravelers.length &&
        airports.length
      ) {
        airports = airportStatusesByTravelers(airports, filteredActiveTravelers);
      }
    }
    // flights
    // display flight statuses only with filtered active travelers
    const availableFlightStatusTimeframesOptions = timeframes;
    // filter by flight presence timeframe
    if (atMapView === 'flightsStatus') {
      if (filterFlightStatusTimeframe && flights.length) {
        flights = flightsStatusesTimeframeFilter(flights, filterFlightStatusTimeframe);
      }
      if (
        activeTravelers && activeTravelers.length !== filteredActiveTravelers.length &&
        flights.length
      ) {
        flights = flightsStatusesByTravelers(flights, filteredActiveTravelers);
      }
    }

    return {
      filteredActiveTravelers: filteredActiveTravelers,
      airports: airports,
      flights: flights,
      zoom: sessionStorage.get('AtZoom') || config.map.minZoom,
      lat: sessionStorage.get('AtLat') || config.map.defaultLat,
      lng: sessionStorage.get('AtLng') || config.map.defaultLon,
      mapView: atMapView,
      onTheMap: onTheMap,
      availableAirportStatuses: availableAirportStatuses,
      availableAirportTimeframes: availableAirportTimeframesOptions,
      availableFlightStatusTimeframes: availableFlightStatusTimeframesOptions,
      filterAirportStatus: filterAirportStatus,
      filterAirportTimeframe: filterAirportTimeframe,
      filterFlightStatusTimeframe: filterFlightStatusTimeframe,
      userRole
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(mapActions, dispatch),
    ...bindActionCreators(airportStatusesActions, dispatch),
    ...bindActionCreators(flightStatusActions, dispatch)
  };
};

export class AtMapContainer extends React.Component {
  static propTypes = {
    filteredActiveTravelers: PropTypes.array.isRequired,
    airports: PropTypes.array.isRequired,
    flights: PropTypes.array.isRequired,
    availableAirportStatuses: PropTypes.array.isRequired,
    availableAirportTimeframes: PropTypes.array.isRequired,
    availableFlightStatusTimeframes: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    filterFlightStatusTimeframe: PropTypes.number.isRequired,
    filterAirportTimeframe: PropTypes.number.isRequired,
    filterAirportStatus: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
    mapView: PropTypes.string.isRequired,
    onTheMap: PropTypes.bool.isRequired,
    atSwitchMapView: PropTypes.func.isRequired,
    atChangeOnTheMapStatus: PropTypes.func.isRequired,
    atChangeMarkersOnMap: PropTypes.func.isRequired,
    changeAirportStatusFilter: PropTypes.func.isRequired,
    changeFlightStatusTimeframeFilter: PropTypes.func.isRequired,
    changeAirportTimeframeFilter: PropTypes.func.isRequired,
    areaShown: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
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
    this._inBounds = [];
    this.state = {
      pinnedFlightPopup: false
    };
  }

  // send visible markers to filter
  getVisibleMarkers = () => {
    if (!this.props.onTheMap) {
      return;
    }

    // Get the map bounds - the top-left and bottom-right locations.
    const inBounds = getVisibleMarkersHelper(
      this._map,
      this._markerClusterGroup,
      this._airportMarkers,
      this._flightsArcs
    );

    if (!isEqual(this._inBounds, inBounds)) {
      this.props.atChangeMarkersOnMap(inBounds);
      this._inBounds = inBounds;
    }
  }

  clearActiveTravelerMap = () => {
    const result = clearMap(
      this._map,
      this._markerClusterGroup,
      this._airportMarkers,
      this._flightsArcs,
      !!this.state.pinnedFlightPopup
    );
    this._markerClusterGroup = result.markerClusterGroup;
    this._airportMarkers = result.airportMarkers;
    this._flightsArcs = result.flightsArcs;
  }

  drawLocations = () => {
    this.clearActiveTravelerMap();
    this._markerClusterGroup = drawLocationsHelper(
      this.props.filteredActiveTravelers,
      this._map,
      this.props.userRole
    );
  }

  drawAirportStatuses = () => {
    this.clearActiveTravelerMap();
    this._airportMarkers = drawAirportStatusesHelper(
      this._airportMarkers,
      this.props.airports,
      this._map,
      this.props.filterAirportTimeframe,
      'active-travelers'
    );
  }

  drawFlightsStatuses = () => {
    this.clearActiveTravelerMap();
    this._flightsArcs = drawFlightStatusesArcsHelper(
      this.props.flights,
      this.props.filteredActiveTravelers,
      this._map,
      this.pineFlightPopup,
      this.shouldShowAnotherPopup,
      this.props.userRole
    );
  }

  populateMap = () => {
    if (this.props.mapView === 'locations') {
      this.drawLocations();
    } else if (this.props.mapView === 'airportStatus') {
      this.drawAirportStatuses();
    } else if (this.props.mapView === 'flightsStatus') {
      this.drawFlightsStatuses();
    }

    this.getVisibleMarkers();
  }

  componentDidUpdate () {
    this.populateMap();
  }

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.filteredActiveTravelers, nextProps.filteredActiveTravelers) ||
      !isEqual(this.props.airports, nextProps.airports) ||
      !isEqual(this.props.flights, nextProps.flights) ||
      !isEqual(this.props.availableAirportStatuses, nextProps.availableAirportStatuses) ||
      !isEqual(this.props.availableAirportTimeframes, nextProps.availableAirportTimeframes) ||
      !isEqual(this.props.availableFlightStatusTimeframes, nextProps.availableFlightStatusTimeframes) ||
      !isEqual(this.props.filterAirportTimeframe, nextProps.filterAirportTimeframe) ||
      !isEqual(this.props.filterFlightStatusTimeframe, nextProps.filterFlightStatusTimeframe) ||
      !isEqual(this.props.filterAirportStatus, nextProps.filterAirportStatus) ||
      !isEqual(this.props.mapView, nextProps.mapView) ||
      !isEqual(this.props.onTheMap, nextProps.onTheMap) ||
      !isEqual(this.props.areaShown, nextProps.areaShown)
    );
  }

  componentDidMount () {
    this._map = createMap('atMap', this.props.lng, this.props.lat, this.props.zoom);

    this.populateMap();

    // add debounce for updates to prevent memory leak
    const setCoords = debounce(() => {
      const center = this._map.getCenter();
      sessionStorage.set('AtLat', center.lat);
      sessionStorage.set('AtLng', center.lng);
    }, 300);

    const getVisibleMarkers = debounce(() => {
      this.getVisibleMarkers();
    }, 200);

    this._map.on('move', () => {
      setCoords();
      getVisibleMarkers();
    });

    this._map.on('click', () => {
      this.setState({
        pinnedFlightPopup: false
      });
    });

    const setZoom = debounce(() => {
      // TODO: mapbox-gl POPUP
      // this._map.closePopup();
      this.setState({
        pinnedFlightPopup: false
      });

      let nextZoom = this._map.getZoom();
      if (nextZoom > config.map.maxZoom) {
        nextZoom = config.map.maxZoom;
      }

      if (nextZoom < config.map.minZoom) {
        nextZoom = config.map.minZoom;
      }

      sessionStorage.set('AtZoom', nextZoom);
    }, 200);

    this._map.on('zoomend', setZoom);

    popupTabsInit();

    if (this._map.invalidateSize) {
      $(window).on('layout-changes', () => {
        this._map.invalidateSize(false);
        setTimeout(this._map.invalidateSize, 50);
      });
    }
  }

  panMapTo = coords => {
    this._map.panTo(coords);
    if (this._map.getZoom() > config.map.minZoom) {
      this._map.setZoom(config.map.minZoom);
    }
  };

  componentWillUnmount () {
    this._map.remove();
    this._map = null;
    this._markerClusterGroup = null;
    this._airportMarkers = [];
    this._flightsArcs = null;
  }

  pineFlightPopup = (line1, line2) => {
    this.setState({
      pinnedFlightPopup: true
    });
  };

  shouldShowAnotherPopup = () => {
    return !this.state.pinnedFlightPopup;
  };

  render () {
    return (
      <div className='activeTravelersMap'>
        <MapControls
          airportStatuses={this.props.availableAirportStatuses}
          airportTimeframes={this.props.availableAirportTimeframes}
          flightStatusTimeframes={this.props.availableFlightStatusTimeframes}
          filterAirportTimeframe={this.props.filterAirportTimeframe}
          filterFlightStatusTimeframe={this.props.filterFlightStatusTimeframe}
          filterAirportStatus={this.props.filterAirportStatus}
          mapView={this.props.mapView}
          onTheMap={this.props.onTheMap}
          switchMapView={this.props.atSwitchMapView}
          changeOnTheMapStatus={this.props.atChangeOnTheMapStatus}
          changeMarkersOnMap={this.props.atChangeMarkersOnMap}
          changeAirportStatusFilter={this.props.changeAirportStatusFilter}
          changeAirportTimeframeFilter={this.props.changeAirportTimeframeFilter}
          changeFlightStatusTimeframeFilter={this.props.changeFlightStatusTimeframeFilter}
          getVisibleMarkers={this.getVisibleMarkers}
          panMapTo={this.panMapTo} />
        <div id='atMap' className='map' />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AtMapContainer);
