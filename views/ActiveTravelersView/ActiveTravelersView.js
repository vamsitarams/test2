import PropTypes from 'prop-types';

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import includes from 'lodash/includes';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import { isCompanyAdminOrUser } from '../../helpers/user';
import activeTravelersFilter from '../../helpers/activeTravelersFilter';
import './ActiveTravelersView.scss';
import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import ActiveTravelers from '../../components/activeTravelers/activeTravelers';

import {
  actions as aTravelersActions,
  stateActiveTravelers, stateFilter, stateLoading
} from '../../redux/modules/activeTravelers';

import { actions as pusherActions } from '../../redux/modules/pusher';
import { stateUser } from '../../redux/modules/user';

import {
  actions as atMapActions,
  stateMarkersOnTheMap, stateOnTheMap
} from '../../redux/modules/atMap';

const mapStateToProps = createSelector(
  stateActiveTravelers,
  stateFilter,
  stateLoading,
  stateMarkersOnTheMap,
  stateOnTheMap,
  stateUser,
  stateAppSettingsDimensions,
  (stateActiveTravelers, stateFilter, stateLoading, stateMarkersOnTheMap, stateOnTheMap,
    user, appSettingsDimensions) => {
    let filteredActiveTravelers = sortBy(stateActiveTravelers, (traveler) => {
      switch (traveler.currentJourneyStatus) {
        case 'ok':
          return 3;
        case 'alarm':
          return 1;
        default:
          return 2;
      }
    });
    if (stateActiveTravelers.length) {
      filteredActiveTravelers = activeTravelersFilter(filteredActiveTravelers, stateFilter);
    }
    if (stateOnTheMap && stateMarkersOnTheMap.length && filteredActiveTravelers.length) {
      filteredActiveTravelers = filteredActiveTravelers.filter((traveler) => {
        return includes(stateMarkersOnTheMap, traveler._id.$oid);
      });
    }

    let companyList = [];
    if (!isCompanyAdminOrUser(stateUser.userRole)) {
      let uniqCompanies = uniqBy(stateActiveTravelers, function (traveler) {
        return (
          traveler.organization._id && traveler.organization._id.$oid
            ? traveler.organization._id.$oid
            : traveler.organization._id
        );
      });
      uniqCompanies = uniqCompanies.filter(
        (companyItem) => (companyItem.organization && companyItem.organization.name)
      );
      companyList = uniqCompanies.map((companyItem) => {
        if (companyItem.organization && companyItem.organization.name && companyItem.organization._id) {
          return {
            value: companyItem.organization._id.$oid,
            label: companyItem.organization.name
          };
        } else {
          return null;
        }
      });
    }

    let costCenterList = [];
    if (isCompanyAdminOrUser(user.roleName)) {
      let uniqCostCenters = uniqBy(stateActiveTravelers, function (traveler) {
        return traveler.costCenter ? traveler.costCenter.name : '';
      });
      uniqCostCenters = uniqCostCenters.filter(
        (traveler) => (traveler.costCenter && traveler.costCenter.name)
      );
      costCenterList = uniqCostCenters.map((traveler) => {
        if (traveler.costCenter && traveler.costCenter.name && traveler.costCenter._id) {
          return {
            value: traveler.costCenter._id.$oid,
            label: traveler.costCenter.name
          };
        } else {
          return null;
        }
      });
    }

    return {
      activeTravelers: stateActiveTravelers,
      filteredActiveTravelers: filteredActiveTravelers,
      activeTravelersFilter: stateFilter,
      activeTravelersLoading: stateLoading,
      companyList,
      costCenterList,
      user,
      appSettingsDimensions
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(aTravelersActions, dispatch),
    ...bindActionCreators(pusherActions, dispatch),
    ...bindActionCreators(atMapActions, dispatch)
  };
};

export class ActiveTravelersView extends React.Component {
  static propTypes = {
    activeTravelers: PropTypes.array.isRequired,
    filteredActiveTravelers: PropTypes.array.isRequired,
    companyList: PropTypes.array.isRequired,
    costCenterList: PropTypes.array.isRequired,
    activeTravelersFilter: PropTypes.object.isRequired,
    activeTravelersLoading: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    loadActiveTravelers: PropTypes.func.isRequired,
    setActiveTravelersFilter: PropTypes.func.isRequired,
    clearActiveTravelersFilter: PropTypes.func.isRequired,
    helpTraveler: PropTypes.func.isRequired,
    releaseTraveler: PropTypes.func.isRequired,
    loadLatestProducts: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    atSwitchMapView: PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.loadActiveTravelers();
    const { mapView } = this.props.match.params;

    if (mapView) {
      this.props.atSwitchMapView(mapView);
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { mapView } = nextProps.match.params;

    if (mapView !== this.props.match.params.mapView &&
      (mapView === 'airportStatus' ||
      mapView === 'locations' ||
      mapView === 'flightsStatus')
    ) {
      this.props.atSwitchMapView(mapView);
    }
  }

  render () {
    return (
      <div className='page-content-without-top-whitespace'>
        <ActiveTravelers {...this.props} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTravelersView);
