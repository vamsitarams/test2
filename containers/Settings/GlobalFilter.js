import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import cloneDeep from 'lodash/cloneDeep';

import {
  stateUserSettings,
  stateLoadingSettings,
  actions as userSettingsActions
} from '../../redux/modules/userSettings';

import ActiveTravelersField from '../../components/globalFilter/activeTravelersField';
import FlightsField from '../../components/globalFilter/flightsField';
import AirportsField from '../../components/globalFilter/airportsField';

const mapStateToProps = createSelector(
  stateUserSettings,
  stateLoadingSettings,
  (globalFilter, loadingSettings) => ({
    globalFilter,
    loadingSettings
  })
);

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(userSettingsActions, dispatch)
});

class GlobalFilter extends React.Component {
  static propTypes = {
    globalFilter: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    loadingSettings: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      filter: cloneDeep(props.globalFilter)
    };
  }

  changeFilterProp = (prop, value) => {
    if (!prop || !value || !this.state.filter[prop]) return;

    this.setState({
      filter: {
        ...this.state.filter,
        [prop]: value
      }
    });
  };

  toggleArrFilterValue = (prop, value) => {
    if (!prop || !value || !this.state.filter[prop]) return;

    const propValue = this.state.filter[prop].slice();

    propValue.indexOf(value) > -1
      ? propValue.splice(propValue.indexOf(value), 1)
      : propValue.push(value);

    this.setState({
      filter: {
        ...this.state.filter,
        [prop]: propValue
      }
    });
  };

  toggleFilterValue = prop => {
    if (!prop || this.state.filter[prop] === undefined) return;

    this.setState({
      filter: {
        ...this.state.filter,
        [prop]: !this.state.filter[prop]
      }
    });
  };

  save = () => {
    this.props.saveSettings(cloneDeep(this.state.filter));
  };

  cancel = () => {
    this.setState({
      filter: cloneDeep(this.props.globalFilter)
    });
  };

  wasSomethingChanged (props) {
    const globFilter = props ? props.globalFilter : this.props.globalFilter;
    const { filter } = this.state;
    return (difference(globFilter.airportStatus, filter.airportStatus).length ||
      difference(filter.airportStatus, globFilter.airportStatus).length) ||
      !isEqual(globFilter.airportsWithin, filter.airportsWithin) ||
      (difference(globFilter.disruptionStatus, filter.disruptionStatus).length ||
      difference(filter.disruptionStatus, globFilter.disruptionStatus).length) ||
      (difference(globFilter.flightStatus, filter.flightStatus).length ||
      difference(filter.flightStatus, globFilter.flightStatus).length) ||
      !isEqual(globFilter.flightsWithin, filter.flightsWithin) ||
      !isEqual(globFilter.onlyAssisting, filter.onlyAssisting) ||
      !isEqual(globFilter.onlyVIP, filter.onlyVIP);
  }

  render () {
    const {
      changeFilterProp,
      toggleArrFilterValue,
      toggleFilterValue
    } = this;

    const propsForComponents = {
      ...this.state.filter,
      changeFilterProp,
      toggleArrFilterValue,
      toggleFilterValue
    };

    const { loadingSettings } = this.props;

    return (
      <div>
        <h1 className='settings-body__title'>Filters</h1>

        <div className='filter-container' style={{ maxWidth: '100% ', background: 'transparent' }}>
          <div className='grid-container'>
            <ActiveTravelersField {...propsForComponents} />
            <FlightsField {...propsForComponents} />
            <AirportsField {...propsForComponents} />
          </div>
          <div className='btn-cnt btn-group-align'>
            <button disabled={!this.wasSomethingChanged() || loadingSettings}
              className='btn btn_transparent btn-user-disabled' onClick={this.cancel}>Cancel</button>
            <button disabled={!this.wasSomethingChanged() || loadingSettings}
              className='btn btn_blue btn-add-user' onClick={this.save}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount () {
    this.props.loadUser();
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.wasSomethingChanged(nextProps)) {
      this.setState({
        filter: cloneDeep(nextProps.globalFilter)
      });
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GlobalFilter);
