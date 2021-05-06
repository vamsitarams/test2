import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';
import TravelersFilter from '../common/travelersFilter';
import FlightsTable from './flightsTable';
import Pager from '../common/pager';
import LoadingIcon from '../../components/common/loadingIcon';
import StickyHolder from '../../components/common/stickyHolder';
import { getFlightStatusList } from '../../helpers/flightStatusFilter';
import config from '../../config/index';
// import AppMenuItem from '../common/AppMenu';
// import Main from '../activeTravelers/datePicker';

// const headerHeight = config.layout.headerHeight;

export class FlightsStatusList extends React.Component {
  static propTypes = {
    travelersFlights: PropTypes.array.isRequired,
    travelersFlightsFilter: PropTypes.object.isRequired,
    travelersFlightsLoading: PropTypes.bool.isRequired,
    travelersFlightsFilterEmbedded: PropTypes.object.isRequired,
    travelersFlightsMeta: PropTypes.object.isRequired,
    travelersFlightsSortBy: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
    travelersFlightsSortByDirect: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    setTravelersFlightsSorter: PropTypes.func.isRequired,
    loadTravelersFlights: PropTypes.func.isRequired,
    setTravelersFlightsFilter: PropTypes.func.isRequired,
    clearTravelersFlightsFilter: PropTypes.func.isRequired,
    travelersFlightsPage: PropTypes.number.isRequired,
    switchTravelersFlightsPage: PropTypes.func.isRequired,
    getEntireTravelersFlights: PropTypes.func.isRequired,
    isPinned: PropTypes.bool.isRequired
  };

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor(props) {
    super(props);
    this._flightsTableRef = React.createRef();
  }

  // shouldComponentUpdate(nextProps) {
  //   return (
  //     !isEqual(this.props.travelersFlights, nextProps.travelersFlights) ||
  //     !isEqual(this.props.travelersFlightsFilter, nextProps.travelersFlightsFilter) ||
  //     !isEqual(this.props.travelersFlightsLoading, nextProps.travelersFlightsLoading) ||
  //     !isEqual(this.props.travelersFlightsFilterEmbedded, nextProps.travelersFlightsFilterEmbedded) ||
  //     !isEqual(this.props.travelersFlightsSortBy, nextProps.travelersFlightsSortBy) ||
  //     !isEqual(this.props.travelersFlightsSortByDirect, nextProps.travelersFlightsSortByDirect) ||
  //     !isEqual(this.props.userRole, nextProps.userRole) ||
  //     !isEqual(this.props.appSettingsDimensions, nextProps.appSettingsDimensions) ||
  //     !isEqual(this.props.travelersFlightsMeta, nextProps.travelersFlightsMeta)
  //   );
  // }

  exportToFile = (fileType) => {
    if (this._flightsTableRef && this._flightsTableRef.current) {
      this._flightsTableRef.current.exportToFile(fileType);
    }
  }

  render() {
    const { l } = this.context.i18n;

    const {
      travelersFlights,
      travelersFlightsFilterEmbedded,
      setTravelersFlightsSorter,
      travelersFlightsSortBy,
      travelersFlightsSortByDirect,
      travelersFlightsFilter,
      setTravelersFlightsFilter,
      clearTravelersFlightsFilter,
      travelersFlightsPage,
      travelersFlightsMeta,
      switchTravelersFlightsPage,
      travelersFlightsLoading,
      getEntireTravelersFlights,
      userRole
    } = this.props;

    let travelersFlightsData;
    if (travelersFlights && travelersFlights.length) {
      travelersFlightsData = (
        <FlightsTable
          ref={this._flightsTableRef}
          getEntireTravelersFlights={getEntireTravelersFlights}
          travelersFlights={travelersFlights}
          sortBy={travelersFlightsSortBy}
          sortByDirect={travelersFlightsSortByDirect}
          flightsSorter={setTravelersFlightsSorter}
          userRole={userRole} {...this.props} />
      );
    } else if (travelersFlights && !travelersFlights.length && !travelersFlightsLoading) {
      travelersFlightsData = l('No flights found');
    }

    const containerStyle = {
      height: this.props.appSettingsDimensions.height
    };
    console.log(this.props);

    return (
      <div className='clearfix scrollable-horizontally page-content' style={containerStyle}>
        <LoadingIcon loading={travelersFlightsLoading} />
        <div className='head-row'>
          <div className='head'>
            {/* <h1>{l('Flight Status')}</h1> */}
            <StickyHolder>
              <TravelersFilter
                travelers={travelersFlightsMeta.totalFlights}
                filteredTravelers={travelersFlightsMeta.filteredFlights}
                companyList={travelersFlightsFilterEmbedded.companies}
                airportList={travelersFlightsFilterEmbedded.airports}
                carrierList={travelersFlightsFilterEmbedded.carriers}
                costCenterList={travelersFlightsFilterEmbedded.costCenters}
                title='flight'
                flightStatusList={getFlightStatusList()}
                travelersFilter={travelersFlightsFilter}
                setTravelersFilter={setTravelersFlightsFilter}
                hideStatusFilter
                clearTravelersFilter={clearTravelersFlightsFilter}
                userRole={userRole}
                exportToFile={this.exportToFile} />
            </StickyHolder>
          </div>
          {travelersFlightsData}
          <div>
            <Pager
              page={travelersFlightsPage}
              pages={travelersFlightsMeta.totalPages}
              switchPage={switchTravelersFlightsPage} />
          </div>
        </div>
      </div>
    );
  }
}

export default FlightsStatusList;
