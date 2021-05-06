import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import cloneDeep from 'lodash/cloneDeep';
import clone from 'lodash/clone';

import NotificationsFields from '../../components/notifications/fields';

import {
  stateUserSettings,
  stateLoadingSettings,
  initialState,
  actions as userSettingsActions
} from '../../redux/modules/userSettings';

const mapStateToProps = createSelector(
  stateUserSettings,
  stateLoadingSettings,
  (notifications, loadingSettings) => ({
    notifications,
    loadingSettings
  })
);

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(userSettingsActions, dispatch)
});

class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.object.isRequired,
    loadingSettings: PropTypes.bool.isRequired,
    loadUser: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      notifications: cloneDeep(props.notifications)
    };
  }

  changeNotificationsProp = (prop, value) => {
    if (!prop || value === undefined || this.state.notifications[prop] === undefined) return;

    const notifications = Object.assign(this.state.notifications, { [prop]: value });

    this.setState({
      notifications
    });
  };

  toggleArrNotificationsValue = (prop, value) => {
    if (!prop || !value || !this.state.notifications[prop]) return;

    const propValue = this.state.notifications[prop];

    propValue.indexOf(value) > -1
      ? propValue.splice(propValue.indexOf(value), 1)
      : propValue.push(value);

    this.setState({
      notifications: {
        ...this.state.notifications,
        [prop]: propValue
      }
    });
  };

  toggleNotificationsValue = prop => {
    if (!prop || this.state.notifications[prop] === undefined) return;

    const state = {
      notifications: {
        ...this.state.notifications,
        [prop]: !this.state.notifications[prop]
      }
    };

    this.setState(state);
  };

  toggleFlightStatusChange = () => {
    const { flightStatusChange } = this.state.notifications;

    this.setState({
      notifications: {
        ...this.state.notifications,
        flightStatusChange: flightStatusChange.length ? [] : clone(initialState.settings.flightStatusChange)
      }
    });
  };

  wasSomethingChanged (props) {
    const notifProps = props ? props.notifications : this.props.notifications;
    const { notifications } = this.state;
    return !isEqual(notifProps.assistedTravelers, notifications.assistedTravelers) ||
      !isEqual(notifProps.newTravelers, notifications.newTravelers) ||
      !isEqual(notifProps.newTravelersAll, notifications.newTravelersAll) ||
      !isEqual(notifProps.newTravelersVIP, notifications.newTravelersVIP) ||
      !isEqual(notifProps.airportStatusChange, notifications.airportStatusChange) ||
      !isEqual(notifProps.airportStatusChangeAll, notifications.airportStatusChangeAll) ||
      !isEqual(notifProps.airportStatusChangeWorse, notifications.airportStatusChangeWorse) ||
      (difference(notifProps.flightStatusChange, notifications.flightStatusChange).length ||
      difference(notifications.flightStatusChange, notifProps.flightStatusChange).length);
  }

  save = () => {
    this.props.saveSettings(cloneDeep(this.state.notifications));
  };

  cancel = () => {
    this.setState({
      notifications: { ...this.props.notifications }
    });
  };

  render () {
    const {
      changeNotificationsProp,
      toggleArrNotificationsValue,
      toggleNotificationsValue,
      toggleFlightStatusChange
    } = this;

    const propsForComponents = {
      ...this.state.notifications,
      changeNotificationsProp,
      toggleArrNotificationsValue,
      toggleNotificationsValue,
      toggleFlightStatusChange
    };

    const { loadingSettings } = this.props;

    return (
      <div>
        <h1 className='settings-body__title'>Notifications</h1>

        <div className='filter-container'>
          <NotificationsFields {...propsForComponents} />
          <div className='btn-cnt btn-group-align'>
            <button disabled={!this.wasSomethingChanged() || loadingSettings}
              className='btn btn-user-disabled' onClick={this.cancel}>Cancel</button>
            <button disabled={!this.wasSomethingChanged() || loadingSettings}
              className='btn btn-add-user' onClick={this.save}>Save Changes</button>
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
        notifications: cloneDeep(nextProps.notifications)
      });
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
