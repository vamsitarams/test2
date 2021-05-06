import PropTypes from 'prop-types';
import React from 'react';

import AtMap from '../../containers/ActiveTravelers/AtMap';
// import { Link } from 'react-router-dom';
// import { isCompanyAdminOrUser } from '../../helpers/user';
// import { isAdmin, isCompanyAdminOrUser, isGlobalAdmin } from '../../helpers/user';

import ActiveTravelersList from './activeTravelersList';
import ActiveTravelersSummary from './activeTravelersSummary';
import LoadingIcon from '../../components/common/loadingIcon';
import StickyHolder from '../../components/common/stickyHolder';
import TravelersFilter from '../../containers/ActiveTravelers/ActiveTravelersFilter';
// import EditBlock from '../../containers/TravelerManager/editBlock';
import config from '../../config/index';
import SearchBar from '../../containers/Header/SearchBar';
import SimpleTabs from './activeTabs';
// import Travelers from './travelers';
// import activeTravelers from '../../redux/modules/activeTravelers';
// import { TravelersListView } from '../../views/TravelersListView/TravelersListView';
// import ActiveTravelersListItem from './activeTravelersListItem';
import UserLayoutComponent from './activeTravallersUserDetailsLayout'
import { withRouter } from 'react-router-dom';

const headerHeight = config.layout.headerHeight;

export class ActiveTravelers extends React.Component {
  static propTypes = {
    activeTravelers: PropTypes.array.isRequired,
    travelersList: PropTypes.array.isRequired,
    // travelers: PropTypes.array.isRequired,
    showOrganizationCol: PropTypes.bool.isRequired,
    companyList: PropTypes.array.isRequired,
    costCenterList: PropTypes.array.isRequired,
    filteredActiveTravelers: PropTypes.array.isRequired,
    activeTravelersFilter: PropTypes.object.isRequired,
    activeTravelersLoading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    setActiveTravelersFilter: PropTypes.func.isRequired,
    clearActiveTravelersFilter: PropTypes.func.isRequired,
    helpTraveler: PropTypes.func.isRequired,
    releaseTraveler: PropTypes.func.isRequired,
    loadLatestProducts: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor (props) {
    super(props);
    this._stickyHeaderRef = React.createRef();
  }

  updateStickyHolder = () => {
    this._stickyHeaderRef.current.refreshPosition();
  };

  render () {
    // return null in case if we don't have window height
    if (!this.props.appSettingsDimensions.height) return null;
    const containerStyle = {
      height: '100vh',
      backgroundColor:"white"
    };
    const activeTravelers = this.props;
    console.log(this.props.match);
    let userLayout = true;
    if (this.props.match.path === "/active-travelers"){
      userLayout = false
    }
    // const travelersList = this.props;
    // console.log(travelersList);
    // console.log(this.props);
    // const { l } = this.context.i18n;

    return (



      <>
        <div className='active'>
          {/* <SettingsView/> */}
          <div style={containerStyle} className='active-travelers-col'>
            <div>
              <SimpleTabs/>
              <br/>
              {/*<div className='active-travelers-col-head'>*/}
                {/*<TravelersFilter*/}
                  {/*travelers={this.props.activeTravelers}*/}
                  {/*filteredTravelers={this.props.filteredActiveTravelers}*/}
                  {/*companyList={this.props.companyList}*/}
                  {/*costCenterList={this.props.costCenterList}*/}
                  {/*travelersFilter={this.props.activeTravelersFilter}*/}
                  {/*setTravelersFilter={this.props.setActiveTravelersFilter}*/}
                  {/*clearTravelersFilter={this.props.clearActiveTravelersFilter}*/}
                  {/*userRole={this.props.user.roleName}/>*/}
              {/*</div>*/}
              <div className='active-travelers-col-head'>
                <SearchBar/>
              </div>
              <div className='active-travelers-col-head'>
                <ActiveTravelersSummary activeTravelers={this.props.activeTravelers}/>
              </div>
              {/* <p>
                {activeTravelers.activeTravelers.map(traveler => (
                  <>
                  <p key={traveler.index}>{traveler.firstName} {traveler.lastName}</p>
                  <p>{traveler.organization.name}</p>
                  </>
                ))}
              </p> */}
              <div className='active-travelers-col-cnt'>
                <LoadingIcon loading={this.props.activeTravelersLoading}/>
                <ActiveTravelersList {...this.props}
                                     onItemsOpened={this.updateStickyHolder}
                                     onItemsClosed={this.updateStickyHolder}/>
              </div>
            </div>
          </div>
          <div style={containerStyle} className='map-col'>
            {userLayout
              ? <UserLayoutComponent uid={this.props.match.params.id} />
              :  <AtMap/>
            }


          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ActiveTravelers);
