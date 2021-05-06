import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import config from '../../config';
import PusherService from '../../helpers/pusher';
import { STATUS_BLOCKED } from '../../helpers/user';
import serverApi from '../../helpers/serverApi';

import { actions as pusherActions } from '../../redux/modules/pusher';
import { actions as travelerManagerActions } from '../../redux/modules/travelerManager';
import { actions as messagesActions } from '../../redux/modules/messages';
import { actions as flightsStatusMapActions } from '../../redux/modules/flightsStatusMap';
import { actions as flightsStatusActions } from '../../redux/modules/flightsStatus';
import { actions as userManagerActions } from '../../redux/modules/userManager';
import { actions as travelerDetailsActions } from '../../redux/modules/travelerDetails';
import { actions as organizationManagerActions } from '../../redux/modules/organizationManager';
import { actions as userActions, stateUser } from '../../redux/modules/user';
import { actions as appActions } from '../../redux/modules/appSettings';
import {
  stateUserSettings,
  actions as userSettingsActions
} from '../../redux/modules/userSettings';

import {
  bindNotifications,
  unbindNotifications
} from '../../helpers/notifications';

import includes from 'lodash/includes';

const mapStateToProps = createSelector(
  stateUser,
  stateUserSettings,
  (user, userSettings) => {
    return {
      user,
      userSettings
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(pusherActions, dispatch),
    ...bindActionCreators(messagesActions, dispatch),
    ...bindActionCreators(travelerManagerActions, dispatch),
    ...bindActionCreators(flightsStatusMapActions, dispatch),
    ...bindActionCreators(flightsStatusActions, dispatch),
    ...bindActionCreators(travelerDetailsActions, dispatch),
    ...bindActionCreators(userManagerActions, dispatch),
    ...bindActionCreators(organizationManagerActions, dispatch),
    ...bindActionCreators(userActions, dispatch),
    ...bindActionCreators(appActions, dispatch),
    ...bindActionCreators(userSettingsActions, dispatch)
  };
};

export class PusherUpdatesContainer extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    updateTravelerHelpedBy: PropTypes.func.isRequired,
    updateTravelerCase: PropTypes.func.isRequired,
    addNewLastMessage: PropTypes.func.isRequired,
    removeLastMessage: PropTypes.func.isRequired,
    updateTravelerData: PropTypes.func.isRequired,
    updateStationOnMap: PropTypes.func.isRequired,
    updateFlightStatuses: PropTypes.func.isRequired,
    reloadTravelersFlights: PropTypes.func.isRequired,
    updateJourneyData: PropTypes.func.isRequired,
    reloadTravelerFlights: PropTypes.func.isRequired,
    updateUserData: PropTypes.func.isRequired,
    updateOrganizationData: PropTypes.func.isRequired,
    logOutUser: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    userSettings: PropTypes.object.isRequired
  };

  constructor () {
    super(...arguments);
    this._travelerDebounces = {};
    this._updateFlightsStatusMapDebounce = debounce(this.props.updateFlightStatuses, 3000);
    this._updateJourneyDebounce = (id) => {
      if (!this._travelerDebounces[id]) {
        this._travelerDebounces[id] = debounce((journeyUpdate) => {
          // reload timelines and reservations
          this.props.updateJourneyData(journeyUpdate.data);
          // reload flight status table on traveler page
          this.props.reloadTravelerFlights(id);
        }, 3000);
      }
      return this._travelerDebounces[id];
    };
  }

  updateCase (caseUpdate) {
    if (caseUpdate.data) {
      const { traveler } = caseUpdate.data;
      const caseItem = caseUpdate.data.case;
      if (traveler) {
        this.props.updateTravelerHelpedBy(traveler);
      }
      if (caseItem) {
        this.props.updateTravelerCase(caseItem);
      }
    }
  }

  updateTraveler (travelerUpdate) {
    const self = this;
    // if the user can successfully be queried then we have the necessary permissions to process the event
    serverApi.getTraveler({ subscriberId: travelerUpdate.data.traveler._id.$oid }).then(function (result) {
      if (result.data && result.data.data) {
        if (travelerUpdate.data && travelerUpdate.data.traveler) {
          const traveler = {
            ...travelerUpdate.data.traveler,
            isVIP: travelerUpdate.data.traveler.rank && includes(travelerUpdate.data.traveler.rank, 'VIP')
          };
          self.props.updateTravelerData(traveler);
        }
      }
    });
  }

  updateLastMessage (messageUpdate) {
    if (messageUpdate.data && messageUpdate.data.traveler) {
      if (messageUpdate.type === 'new') {
        this.props.addNewLastMessage(messageUpdate.data.traveler);
      } else {
        this.props.removeLastMessage(messageUpdate.data.traveler);
      }
    }
  }

  updateUser (userUpdate) {
    if (
      this.props.user && this.props.user._id &&
      userUpdate.data.user && Object.prototype.hasOwnProperty.call(userUpdate.data.user, 'status') &&
      userUpdate.data.user._id.$oid === this.props.user._id &&
      userUpdate.data.user.status === STATUS_BLOCKED
    ) {
      // do logout
      this.props.logOutUser();
    } else {
      this.props.updateUserData(userUpdate.data.user);
    }
  }

  updateOrganization (organization) {
    if (organization.data && organization.data.organization) {
      this.props.updateOrganizationData(organization.data.organization);
    }
  }

  updateStation (stationUpdate) {
    this.props.updateStationOnMap(stationUpdate.data.station);
  }

  updateJourney (journeyUpdate) {
    const self = this;
    // if the user can successfully be queried then we have the necessary permissions to process the event
    serverApi.getTraveler({ subscriberId: journeyUpdate.data.subscriberId }).then(function (result) {
      if (result.data && result.data.data) {
        self._updateJourneyDebounce(journeyUpdate.data.subscriberId)(journeyUpdate);
        // reload flighht status map
        if (journeyUpdate.data.hasActiveFlights) {
          self._updateFlightsStatusMapDebounce();
        }
        // reload flight status page
        self.props.reloadTravelersFlights(journeyUpdate);
      }
    });
  }

  componentDidMount () {
    PusherService.subscribe(
      config.pusher.serviceChannelPrefix + this.props.user._id,
      (context, update) => {
        if (context.indexOf('pusher:') === -1) {
          switch (update.class) {
            case 'case':
              this.updateCase(update);
              break;
            case 'journey':
              this.updateJourney(update);
              break;
            case 'traveler':
              this.updateTraveler(update);
              break;
            case 'message':
              this.updateLastMessage(update);
              break;
            case 'user':
              this.updateUser(update);
              break;
            case 'organization':
              this.updateOrganization(update);
              break;
          }
        }
      }
    );

    PusherService.subscribe(
      config.pusher.serviceCommonChannelPrefix,
      (context, update) => {
        if (context.indexOf('pusher:') === -1) {
          switch (update.class) {
            case 'station':
              this.updateStation(update);
              break;
          }
        }
      }
    );

    bindNotifications(
      this.props.user,
      this.props.userSettings,
      this.props.navigateTo
    );

    this.props.loadUser();
  }

  componentWillUnmount () {
    PusherService.unsubscribe(config.pusher.serviceChannelPrefix + this.props.user._id);
    PusherService.unsubscribe(config.pusher.serviceCommonChannelPrefix);
    unbindNotifications();
  }

  render = () => null;
}

export default connect(mapStateToProps, mapDispatchToProps)(PusherUpdatesContainer);
