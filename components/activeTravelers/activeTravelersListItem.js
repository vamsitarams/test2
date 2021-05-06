import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { isCompanyAdminOrUser } from '../../helpers/user';
import isEqual from 'lodash/isEqual';

import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../components/common/collapse';
import HelpedBlock from '../../containers/Traveler/HelpedBlock';
import TravelerMessageIcon from '../../containers/Common/TravelerMessageIcon';
import LoadingIcon from '../../components/common/loadingIcon';
import TimelineEvents from './timelineEvents';
// import HotelTimelineEvents from './cartimeEvent';

export class ActiveTravelersListItem extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    activeTraveler: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      helpedBy: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string
      }),
      isVIP: PropTypes.bool,
      currentJourneyStatus: PropTypes.string,
      lastMessage: PropTypes.shape({
        message: PropTypes.string,
        timestampUTC: PropTypes.object
      }),
      organization: PropTypes.shape({
        name: PropTypes.string
      }),
      _id: PropTypes.shape({
        $oid: PropTypes.string
      }),
      costCenter: PropTypes.shape({
        name: PropTypes.string
      }),
      productsData: PropTypes.object,
      carData: PropTypes.object,
      hotelsData: PropTypes.object
    }).isRequired,
    userRole: PropTypes.string.isRequired,
    helpTraveler: PropTypes.func.isRequired,
    releaseTraveler: PropTypes.func.isRequired,
    onItemOpened: PropTypes.func,
    onItemClosed: PropTypes.func,
    loadLatestProducts: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps, nextState) {
    // console.log(nextProps, 'nextprops');
    return (
      !isEqual(this.props.activeTraveler, nextProps.activeTraveler) ||
      !isEqual(this.props.userRole, nextProps.userRole) ||
      !isEqual(this.state, nextState)
    );
  }

  constructor (props) {
    super(props);
    this.state = {
      productsLoading: false
    };
  }

  helpTraveler = () => {
    this.props.helpTraveler(this.props.activeTraveler);
  }

  releaseTraveler = () => {
    this.props.releaseTraveler(this.props.activeTraveler);
  }

  showLastProducts = () => {
    // console.log(this.props);
    const { activeTraveler, activeTraveler: { productsData } } = this.props;
    const id = activeTraveler._id.$oid;
    if (!productsData) {
      this.setState({ productsLoading: true }, () => {
        this.props.loadLatestProducts(id).then(() => {
          this.setState({
            productsLoading: false
          });
        },
        () => {
          this.setState({
            productsLoading: false
          });
        });
      });
    }
  }

  get products () {
    const productsData = this.props.activeTraveler.productsData ? this.props.activeTraveler.productsData : {};
    const carData = this.props.activeTraveler.carData ? this.props.activeTraveler.carData : {};
    const hotelsData = this.props.activeTraveler.hotelsData ? this.props.activeTraveler.hotelsData : {};
    return (productsData && productsData.timelineEvents && carData && hotelsData) ? (
      <div className='events-wrap'>
        <TimelineEvents productsData={{ productsData: productsData, carData: carData, hotelsData: hotelsData }} />
      </div>
    ) : null;
  }

  render () {
    const { activeTraveler, userRole } = this.props;

    let vip, status;

    if (activeTraveler.isVIP) {
      vip = (<strong className='vip'>VIP</strong>);
    }
    if (activeTraveler.currentJourneyStatus) {
      status = (
        <i className={`icon ${activeTraveler.currentJourneyStatus}`}>
          {activeTraveler.currentJourneyStatus}
        </i>
      );
    }

    let orgName = activeTraveler.organization.name;
    if (isCompanyAdminOrUser(userRole) && activeTraveler.costCenter) {
      orgName = activeTraveler.costCenter.name;
    }
    // const activeTravelers = this.props;
    // console.log(activeTravelers);

    return (
      <CollapseHolder
        opener='travelers-list__item'
        onCollapseOpen={this.showLastProducts}
        onCollapseOpened={this.props.onItemOpened}
        onCollapseClosed={this.props.onItemClosed}
        collapseLoading={this.state.productsLoading}>
        <CollapseOpener>
          <div className='travelers-list__item'>
            <LoadingIcon loading={this.state.productsLoading} />
            <div className='traveler-holder'>
              <div className='traveler-info'>
                <div className='name'>
                  {status}
                  <Link to={`/traveler/${activeTraveler._id.$oid}`}>
                    <strong className='travelers-name'>{activeTraveler.firstName} {activeTraveler.lastName}</strong>
                  </Link>
                  {vip}
                  <TravelerMessageIcon travelerId={activeTraveler._id.$oid} />
                </div>
                <span className='organization'>{orgName}</span>
              </div>
              <HelpedBlock helpedBy={activeTraveler.helpedBy} travelerId={activeTraveler._id.$oid} />
            </div>
          </div>
        </CollapseOpener>
        <CollapseBlock>{this.products}</CollapseBlock>
      </CollapseHolder>
    );
  }
}
export default ActiveTravelersListItem;
