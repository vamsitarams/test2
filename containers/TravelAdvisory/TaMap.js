import PropTypes from 'prop-types';

import React from 'react';

import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import { bindActionCreators } from 'redux';

import $ from 'jquery';

import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import config from '../../config';
import countriesJSON from '../../config/countries.geo.json';
import { sessionStorage } from '../../helpers/localStorage';
import { drawTravelAdvisoryHelper, drawCountriesBorders, createMap } from '../../helpers/map';
import MapLevels from '../../components/common/mapLevels';
import {
  actions as travelAdvisoryActions,
  stateCountries,
  stateFilteredCountries,
  stateActiveCountry,
  stateCountryTravelers
} from '../../redux/modules/travelAdvisory';

const countriesByCode = {};
countriesJSON.features.forEach(c => {
  countriesByCode[c.id] = c;
});

const mapStateToProps = createSelector(
  stateCountries,
  stateFilteredCountries,
  stateActiveCountry,
  stateCountryTravelers,
  (countries, filteredCountries, activeCountry, countryTravelers) => {
    if (activeCountry && activeCountry.longCode) {
      activeCountry.map = countriesByCode[activeCountry.longCode];
    }
    return {
      countries,
      filteredCountries,
      activeCountry,
      countryTravelers,
      zoom: sessionStorage.get('TaZoom') || config.map.minZoom,
      lat: sessionStorage.get('TaLat') || config.map.defaultLat,
      lng: sessionStorage.get('TaLng') || config.map.defaultLon
    };
  }
);

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(travelAdvisoryActions, dispatch)
  };
};

export class TaMapContainer extends React.Component {
  static propTypes = {
    countries: PropTypes.array.isRequired,
    countryTravelers: PropTypes.object.isRequired,
    filteredCountries: PropTypes.array.isRequired,
    activeCountry: PropTypes.object,
    zoom: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    onCountrySelect: PropTypes.func
  };

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor (props) {
    super(props);
    this._map = null;
    this._markerClusterGroup = null;
    this._borders = null;
    this._hasDrawnBorders = false;
  }

  clearMap () {
    if (this._markerClusterGroup && this._map.hasLayer(this._markerClusterGroup)) {
      this._map.removeLayer(this._markerClusterGroup);
      this._markerClusterGroup = null;
    }
    if (this._borders && this._map.hasLayer(this._borders)) {
      this._map.removeLayer(this._borders);
      this._borders = null;
    }
  }

  panMapTo = (coords) => {
    this._map.panTo(coords);
    if (this._map.getZoom() > config.map.minZoom) {
      this._map.setZoom(config.map.minZoom);
    }
  }

  fitBoundsTo = geojsonFeature => {
    if (geojsonFeature) {
      // TODO: mapbox-gl GEOJSON
      // const bounds = L.geoJson(geojsonFeature).getBounds();
      // this._map.fitBounds(bounds);
    }
  };

  drawBorders () {
    this._borders = drawCountriesBorders(
      countriesJSON,
      this.props.countries,
      this._map
    );
  }

  onCountryMarkerClick = (country) => {
    this.props.onCountrySelect(country);
  }

  drawAtMarkers () {
    this._markerClusterGroup = drawTravelAdvisoryHelper(
      this.props.countries, // with travelers property
      this._map,
      this.onCountryMarkerClick
    );
  }

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.countries, nextProps.countries) ||
      !isEqual(this.props.activeCountry, nextProps.activeCountry)
    );
  }

  componentDidUpdate () {
    this.clearMap();
    this.drawBorders();
    this.drawAtMarkers();
    if (this.props.activeCountry && this.props.activeCountry.map && this.props.activeCountry.map.geometry) {
      this.fitBoundsTo(this.props.activeCountry.map);
    }
  }

  componentDidMount () {
    this._map = createMap('taMap', this.props.lng, this.props.lat, this.props.zoom);

    this.drawBorders();
    this.drawAtMarkers();

    // add debounce for updates to prevent memory leak
    const setCoords = debounce(() => {
      const center = this._map.getCenter();
      sessionStorage.set('TaLat', center.lat);
      sessionStorage.set('TaLng', center.lng);
    }, 300);

    this._map.on('move', () => {
      setCoords();
    });

    const setZoom = debounce(() => {
      // TODO: mapbox-gl POPUP
      // this._map.closePopup();
      let nextZoom = this._map.getZoom();
      if (nextZoom > config.map.maxZoom) {
        nextZoom = config.map.maxZoom;
      }

      if (nextZoom < config.map.minZoom) {
        nextZoom = config.map.minZoom;
      }

      sessionStorage.set('TaZoom', nextZoom);
    }, 200);

    this._map.on('zoomend', setZoom);

    if (this._map.invalidateSize) {
      $(window).on('layout-changes', () => {
        setTimeout(() => this._map.invalidateSize(false), 50);
      });
    }
  }

  componentWillUnmount () {
    this._map.remove();
    this._map = null;
    this._markerClusterGroup = null;
  }

  render () {
    return (
      <div className='activeTravelersMap'>
        <MapLevels />
        <div id='taMap' className='map' />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaMapContainer);
