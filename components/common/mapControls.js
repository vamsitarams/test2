import PropTypes from 'prop-types';
import React from 'react';
import includes from 'lodash/includes';
import Select from 'react-select';

import MapThumbnails from '../../containers/Common/MapThumbnails';

export default class MapControls extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    mapView: PropTypes.string.isRequired,
    switchMapView: PropTypes.func.isRequired,
    airportStatuses: PropTypes.array,
    airportTimeframes: PropTypes.array,
    filterAirportTimeframe: PropTypes.number,
    filterAirportStatus: PropTypes.string,
    flightStatusStatuses: PropTypes.array,
    flightStatusTimeframes: PropTypes.array,
    filterFlightStatusTimeframe: PropTypes.number,
    onTheMap: PropTypes.bool,
    changeOnTheMapStatus: PropTypes.func,
    changeMarkersOnMap: PropTypes.func,
    changeAirportStatusFilter: PropTypes.func,
    changeAirportTimeframeFilter: PropTypes.func,
    changeFlightStatusTimeframeFilter: PropTypes.func,
    getVisibleMarkers: PropTypes.func,
    panMapTo: PropTypes.func
  };

  constructor (props) {
    super(props);
    this._onTheMapRef = React.createRef();
    this._timeframeLabels = {};
  }

  UNSAFE_componentWillMount () {
    const { l } = this.context.i18n;
    this._timeframeLabels = {
      48: l('48 hours'),
      36: l('36 hours'),
      24: l('24 hours'),
      12: l('12 hours'),
      6: l('6 hours'),
      3: l('3 hours'),
      1.5: l('90 min'),
      1: l('60 min'),
      0.5: l('30 min')
    };
  }

  onTheMapChange = () => () => {
    this.props.changeOnTheMapStatus(this._onTheMapRef.current.checked);
    if (this._onTheMapRef.current.checked) {
      this.props.getVisibleMarkers();
    }
  }

  switchMapView = (mapView) => (e) => {
    e.preventDefault();
    this.props.switchMapView(mapView);
  }

  changeAirportFilterStatus = (valObject) => {
    this.props.changeAirportStatusFilter(valObject.value);
  }

  changeAirportFilterTimeframe = (valObject) => {
    this.props.changeAirportTimeframeFilter(valObject.value);
  }

  changeFlightStatusFilterTimeframe = (valObject) => {
    this.props.changeFlightStatusTimeframeFilter(valObject.value);
  }

  renderStatuseOptions = (option) => (
    <div className={`status-option ${option.value || 'none'}`}>
      <span>{option.label}</span>
    </div>
  )

  get timeframeAirportSelect () {
    const options = this.props.airportTimeframes.map((timeframe) => {
      return { value: timeframe, label: this._timeframeLabels[timeframe] };
    });
    return (
      <Select
        className='time-select'
        clearable={false}
        value={this.props.filterAirportTimeframe}
        options={options}
        onChange={this.changeAirportFilterTimeframe} />
    );
  }

  get timeframeFlightStatusSelect () {
    const options = this.props.flightStatusTimeframes.map((timeframe) => {
      return { value: timeframe, label: this._timeframeLabels[timeframe] };
    });
    return (
      <Select
        className='time-select'
        clearable={false}
        value={this.props.filterFlightStatusTimeframe}
        options={options}
        onChange={this.changeFlightStatusFilterTimeframe} />
    );
  }

  get airportStatusSelect () {
    if (this.props.airportStatuses) {
      const { l } = this.context.i18n;
      const statusLabels = [
        { value: 'none', label: l('All Statuses') },
        { value: 'green', label: l('Delays ≤ 15 min') },
        { value: 'yellow', label: l('Delays 16-45 min') },
        { value: 'orange', label: l('Departure delays') },
        { value: 'red', label: l('Delays > 45 min') },
        { value: 'black', label: l('Airport closed') }
      ];
      const statuses = statusLabels.filter((status) => {
        return includes(this.props.airportStatuses, status.value);
      });
      statuses.unshift({ value: '', label: l('All Statuses') });
      return (
        <Select
          clearable={false}
          value={this.props.filterAirportStatus}
          options={statuses}
          onChange={this.changeAirportFilterStatus}
          className='map-status-select'
          optionRenderer={this.renderStatuseOptions} />
      );
    }
  }

  get onTheMapField () {
    const { onTheMap } = this.props;
    // const { l } = this.context.i18n;
    if (onTheMap !== undefined) {
      return (
        <div className='cust-cb'>
          <input id='map-cbox' type='checkbox' name='onTheMap' checked={onTheMap} ref={this._onTheMapRef}
            onChange={this.onTheMapChange()} />
          {/* <label htmlFor='map-cbox' className='onTheMap'> {l('Filter as I move the map')}</label> */}
        </div>
      );
    }
  }

  get filters () {
    const { mapView } = this.props;
    if (mapView === 'airportStatus') {
      return (
        <div className='mapFilters'>
          {this.airportStatusSelect} {this.timeframeAirportSelect}
          <div className='help-icon'>
            <div className='help-popup'>
              <span>Select a departure flight window. <br />Default is 24 hrs.</span>
            </div>
          </div>
        </div>
      );
    }
    if (mapView === 'flightsStatus') {
      return (
        <div className='mapFilters'>
          {this.timeframeFlightStatusSelect}
          <div className='help-icon'>
            <div className='help-popup'>
              <span>Select a departure flight window. <br />Default is 3 hrs.</span>
            </div>
          </div>
        </div>
      );
    }
  }

  render () {
    const { l } = this.context.i18n;
    const { mapView } = this.props;
    const locationsActive = mapView === 'locations' ? 'active' : '';
    const airportStatusActive = mapView === 'airportStatus' ? 'active' : '';
    const flightsStatusActive = mapView === 'flightsStatus' ? 'active' : '';

    return (
      <div>
        <div className='map-filters'>
          <ul className='tabset'>
            <li id='map-locations' className={locationsActive}>
              <a href='' onClick={this.switchMapView('locations')}>{l('Locations')}</a>
            </li>
            <li id='map-airports' className={airportStatusActive}>
              <a href='' onClick={this.switchMapView('airportStatus')}>{l('Airports')}</a>
            </li>
            <li id='map-flights' className={flightsStatusActive}>
              <a href='' onClick={this.switchMapView('flightsStatus')}>{l('Flights')}</a>
            </li>
          </ul>
          {this.filters}
        </div>
        <div className='map-bottom-area'>
          {this.onTheMapField}
          {mapView === 'locations' ? <MapThumbnails panMapTo={this.props.panMapTo} /> : null}
        </div>
      </div>
    );
  }
}
