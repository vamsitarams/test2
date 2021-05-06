import PropTypes from 'prop-types';

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import filter from 'lodash/filter';

import TravelersList from '../../components/travelers/travelersList';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import {
  actions as travelersListActions,
  stateTravelersList, stateTravelersListFilter, stateTravelersListLoading,
  stateTravelersListPage, stateTravelersListMetaData,
  stateTravelersListSortBy, stateTravelersListSortByDirect,
  stateTravelersListCompanies, stateTravelersListCostCenters
} from '../../redux/modules/travelersList';

import { stateUserRole } from '../../redux/modules/user';
import ImportStatusModal from '../../components/importTravelers/modals/importStatusModal';
// import SettingsView from '../SettingsView/SettingsView';

const mapStateToProps = createSelector(
  stateTravelersList,
  stateTravelersListFilter,
  stateTravelersListLoading,
  stateTravelersListPage,
  stateTravelersListMetaData,
  stateTravelersListSortBy,
  stateTravelersListSortByDirect,
  stateTravelersListCompanies,
  stateTravelersListCostCenters,
  stateAppSettingsDimensions,
  stateUserRole,
  (travelersList, travelersListFilter, travelersListLoading, travelersListPage, travelersListMetaData,
    travelersListSortBy, travelersListSortByDirect, travelersListCompanies, travelersListCostCenters,
    appSettingsDimensions, userRole) => {
    let companies = [];
    let costCenters = [];
    if (travelersListCompanies.length) {
      companies = filter(travelersListCompanies.map((company) => {
        return {
          value: company._id ? company._id.$oid : '',
          label: company.name
        };
      }), 'value');
    }
    if (travelersListCostCenters.length) {
      costCenters = filter(travelersListCostCenters.map((costCenter) => {
        return {
          value: costCenter._id ? costCenter._id.$oid : '',
          label: costCenter.name
        };
      }), 'value');
    }
    let travelersListIsFiltered = false;
    if (travelersListFilter.nonHelped) {
      travelersList.forEach((traveler) => {
        if (traveler.helpedBy && traveler.helpedBy.status === 'opened') {
          travelersListIsFiltered = true;
        }
      });
    }

    return {
      travelersList,
      travelersListIsFiltered,
      travelersListFilter,
      travelersListLoading,
      travelersListPage,
      travelersListMetaData,
      travelersListSortBy,
      travelersListSortByDirect,
      companies,
      costCenters,
      appSettingsDimensions,
      userRole
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelersListActions, dispatch)
  };
};

export class TravelersListView extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    travelersList: PropTypes.array.isRequired,
    companies: PropTypes.array.isRequired,
    costCenters: PropTypes.array.isRequired,
    travelersListFilter: PropTypes.object.isRequired,
    travelersListLoading: PropTypes.bool.isRequired,
    travelersListIsFiltered: PropTypes.bool.isRequired,
    travelersListPage: PropTypes.number.isRequired,
    travelersListMetaData: PropTypes.object.isRequired,
    travelersListSortBy: PropTypes.string.isRequired,
    travelersListSortByDirect: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    userRole: PropTypes.string,
    loadTravelersList: PropTypes.func.isRequired,
    setTravelersListFilter: PropTypes.func.isRequired,
    switchTravelersListPage: PropTypes.func.isRequired,
    setTravelersListSorter: PropTypes.func.isRequired,
    clearTravelersListFilter: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._load = false;
  }

  UNSAFE_componentWillMount () {
    this.props.loadTravelersList();
  }

  UNSAFE_componentWillUpdate (nextProps) {
    if (nextProps.travelersListIsFiltered && !this._load) {
      this.props.loadTravelersList().then(() => {
        this._load = false;
      });
      this._load = true;
    }
  }

  render () {
    return (
      <div>
        {/* <SettingsView/> */}
        <TravelersList {...this.props} />
        <ImportStatusModal />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TravelersListView);
