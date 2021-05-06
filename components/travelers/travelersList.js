import PropTypes from 'prop-types';
import React from 'react';
import TravelersFilter from './../common/travelersFilter';
import TravelersTable from './travelersTable';
import Pager from '../common/pager';
import LoadingIcon from '../../components/common/loadingIcon';
// import StickyHolder from '../../components/common/stickyHolder';
import { Link } from 'react-router-dom';
import { isAdmin, isCompanyAdminOrUser, isGlobalAdmin } from '../../helpers/user';
// import TfilterIcon from '../common/svgIcon/FilterIcon';
import config from '../../config/index';
// import SettingsView from '../../views/SettingsView/SettingsView';
// import SettingsTabs from '../common/settingsTabs';
const headerHeight = config.layout.headerHeight;

export class TravelersList extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    travelersList: PropTypes.array.isRequired,
    companies: PropTypes.array.isRequired,
    costCenters: PropTypes.array.isRequired,
    travelersListFilter: PropTypes.object.isRequired,
    travelersListLoading: PropTypes.bool.isRequired,
    travelersListPage: PropTypes.number.isRequired,
    travelersListMetaData: PropTypes.object.isRequired,
    travelersListSortBy: PropTypes.string.isRequired,
    travelersListSortByDirect: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    userRole: PropTypes.string,
    loadTravelersList: PropTypes.func.isRequired,
    switchTravelersListPage: PropTypes.func.isRequired,
    setTravelersListSorter: PropTypes.func.isRequired,
    setTravelersListFilter: PropTypes.func.isRequired,
    clearTravelersListFilter: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n: PropTypes.object
  };

  render () {
    const { l } = this.context.i18n;
    const {
      location, travelersListPage, travelersListMetaData, travelersList, switchTravelersListPage,
      companies, travelersListFilter, setTravelersListFilter, clearTravelersListFilter,
      setTravelersListSorter, travelersListSortBy, travelersListSortByDirect, travelersListLoading,
      userRole, costCenters
    } = this.props;

    let travelersData;
    if (travelersList.length) {
      const displayOrgCol = (costCenters.length && isCompanyAdminOrUser(userRole)) || !isCompanyAdminOrUser(userRole);
      travelersData = (
        <TravelersTable
          location={location}
          travelers={travelersList}
          travelersSorter={setTravelersListSorter}
          showOrganizationCol={displayOrgCol}
          sortBy={travelersListSortBy}
          sortByDirect={travelersListSortByDirect}
          userRole={userRole} />
      );
    } else if (!travelersListLoading) {
      travelersData = l('No travelers found');
    }

    let adminButtons;

    if (isAdmin(this.props.userRole) && !isGlobalAdmin(this.props.userRole)) {
      adminButtons = (
        <div className='buttons-r-list'>
          <Link to='/add/traveler' className='btn btn01 btn-settings'>
            {l('Add Traveler')}
          </Link>
          <Link to='/import/traveler' className='btn btn02'>
            {l('Import Travelers')}
          </Link>
        </div>
      );
    }

    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };
    return (
      <div className='scrollable-horizontally page-content' style={containerStyle}>
        <div className='head-row'>
          <h1>{l('Travelers List')}</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <TravelersFilter
            travelers={travelersListMetaData._total_size}
            filteredTravelers={travelersListMetaData._size}
            companyList={companies}
            costCenterList={costCenters}
            travelersFilter={travelersListFilter}
            setTravelersFilter={setTravelersListFilter}
            clearTravelersFilter={clearTravelersListFilter}
            userRole={userRole} />
            {/* <TfilterIcon style={{ color: 'white', backgroundColor: 'blue' }} className='opener'/> */}
          </div>
         {adminButtons}
        </div>
        <LoadingIcon loading={travelersListLoading} />
        {travelersData}
        <Pager
          page={travelersListPage}
          pages={travelersListMetaData._total_pages}
          switchPage={switchTravelersListPage} />
      </div>
    );
  }
}
export default TravelersList;
