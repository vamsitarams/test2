import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Route, NavLink, withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import Details from '../../containers/Traveler/Details';
import Chat from '../../containers/Common/Chat';
import ChatInvitation from '../../components/chat/chatInvitation';
import HelpedBlock from '../../containers/Traveler/HelpedBlock';
import AddCaseActionModal from '../../components/traveler/modals/addCaseActionModal';
import LoadingIcon from '../../components/common/loadingIcon';
import TimelineNotifications from '../../containers/Traveler/TimelineNotifications';
import config from '../../config/index';

import Timeline from '../../containers/Traveler/Timeline';
import Reservations from '../../containers/Traveler/Reservations';
import Maps from '../../containers/Traveler/Maps';
import FlightStatus from '../../containers/Traveler/FlightStatus';
import TravelAdvisory from '../../containers/Traveler/TravelAdvisory';
import CaseHistory from '../../containers/Traveler/CaseHistory';

import {
  actions as travelerActions,
  stateTraveler,
  stateTravelAdvisoryLevel
} from '../../redux/modules/travelerDetails';
import { actions as timelineActions } from '../../redux/modules/timeline';
import { actions as reservationsActions } from '../../redux/modules/reservations';
import { actions as pusherActions } from '../../redux/modules/pusher';
import { stateAppSettingsConstants, stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import { stateUserRole } from '../../redux/modules/user';
const { travelerDetailsTopBarHeight, travelerDetailsNavBarHeight, headerHeight } = config.layout;

const mapStateToProps = createSelector(
  stateTraveler,
  stateAppSettingsConstants,
  stateAppSettingsDimensions,
  stateUserRole,
  stateTravelAdvisoryLevel,
  (traveler, appSettingsConstants, appSettingsDimensions, userRole, advisoryLevel) => {
    appSettingsConstants = appSettingsConstants || {};
    return {
      traveler,
      appSettingsConstants,
      appSettingsDimensions,
      userRole,
      advisoryLevel
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerActions, dispatch),
    ...bindActionCreators(pusherActions, dispatch),
    ...bindActionCreators(reservationsActions, dispatch),
    ...bindActionCreators(timelineActions, dispatch)
  };
};

export class TravelerView extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    activeTravelers: PropTypes.array.isRequired,
    location: PropTypes.object,
    match: PropTypes.object,
    advisoryLevel: PropTypes.number,
    traveler: PropTypes.object.isRequired,
    appSettingsConstants: PropTypes.object.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    requestTraveler: PropTypes.func.isRequired,
    addCaseAction: PropTypes.func.isRequired,
    sendInvitation: PropTypes.func.isRequired,
    editCaseAction: PropTypes.func.isRequired,
    resetTimeline: PropTypes.func.isRequired,
    resetReservations: PropTypes.func.isRequired,
    loadTravelerAdvisory: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  constructor () {
    super(...arguments);
    this._addCaseActionModalRef = React.createRef();
    this.state = {
      hasMessages: false
    };
  }

  getTraveler (nextProps) {
    const props = this.props || nextProps;
    console.log('hello', props);
    if (
      (props.match.params.id && !props.traveler._id) ||
      (props.traveler._id && props.traveler._id.$oid !== props.match.params.id)
    ) {
      this.props.resetReservations();
      this.props.resetTimeline();
      this.props.requestTraveler(props.match.params.id);
      this.props.loadTravelerAdvisory(props.match.params.id);
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      !isEqual(this.props.match, nextProps.match) ||
      !isEqual(this.props.traveler, nextProps.traveler) ||
      !isEqual(this.props.appSettingsConstants, nextProps.appSettingsConstants) ||
      !isEqual(this.props.appSettingsDimensions, nextProps.appSettingsDimensions) ||
      !isEqual(this.state, nextState)
    );
  }

  UNSAFE_componentWillMount () {
    this.getTraveler(this.props);
  }

  componentDidUpdate (nextProps) {
    if (this.props.traveler && this.props.traveler._id) {
      this.getTraveler(nextProps);
    }
  }

  showAddActionModal = (actionId = '', subActionId = '', description, caseActionId, eTag) => {
    if (this._addCaseActionModalRef && this._addCaseActionModalRef.current) {
      this._addCaseActionModalRef.current.showAddCaseActionModal(
        actionId, subActionId, description, caseActionId, eTag);
    }
  }

  addCaseAction = (actionId, subActionId, description, caseActionId, eTag) => {
    // if we have caseId then we need to edit case
    if (caseActionId) {
      this.props.editCaseAction(this.props.traveler, actionId, subActionId, description, caseActionId, eTag);
    } else {
      // else we need to post new case
      this.props.addCaseAction(this.props.traveler, actionId, subActionId, description);
    }
  }

  chatMessages = (messages) => {
    const { id } = this.props.match.params;
    this.setState({
      hasMessages:
        (messages && messages.length && this.state.hasMessages === id) ||
        (this.state.hasMessages === false && id)
          ? id
          : false
    });
  }

  render () {
    console.log(this.props.activeTravelers);
    const { l } = this.context.i18n;
    const { id } = this.props.match.params;
    const {
      location, traveler, appSettingsConstants, appSettingsDimensions: { height },
      userRole, advisoryLevel
    } = this.props;

    const contentHeight = height - travelerDetailsTopBarHeight - headerHeight - travelerDetailsNavBarHeight;
    const hasApp = traveler.app_4site && traveler.app_4site.status;

    let loading = false;
    if (!traveler._id || !appSettingsConstants.caseActions) {
      loading = true;
    };

    const helpedBlock = this.props.traveler.status === 'active' ? (
      <HelpedBlock
        travelerId={id}
        helpedBy={traveler.helpedBy}
        extend='true'
        addTravelerAction={this.showAddActionModal} />
    ) : null;

    const timelimeNotifications = this.props.traveler.status === 'active' ? (
      <TimelineNotifications id={id} />
    ) : null;

    const chat = hasApp ? <Chat travelerId={id} height={contentHeight} newMessages={this.chatMessages} /> : null;
    const inv = !hasApp
      ? <ChatInvitation traveler={traveler} userRole={userRole} sendInvitation={this.props.sendInvitation} />
      : null;
    const actions = appSettingsConstants.caseActions ? appSettingsConstants.caseActions.actions : [];
    const childProps = {
      traveler: traveler,
      addTravelerAction: this.showAddActionModal,
      ...this.props
    };
    const content = (
      <div className='clearfix'>
        <div className='traveler-details-top-bar' style={{ height: travelerDetailsTopBarHeight }}>
          <div className='left-col'>
            <Details location={location} />
          </div>
          <div className='right-col'>
            <div className='holder'>
              {helpedBlock}
            </div>
            {timelimeNotifications}
          </div>
        </div>
        <div className='traveler-details-content'>
          <div className='left-col'>
            <div className='head-bar' style={{ height: travelerDetailsNavBarHeight }}>
              {hasApp ? <h3 className={this.state.hasMessages ? 'has-messages' : ''}>
                {l('Chat')}</h3> : <h3 className='unavailable'>{l('Chat Unavailable')}</h3>}
            </div>
            <div className='chat-holder scroll' style={{ height: contentHeight }}>
              {chat}
              {inv}
            </div>
          </div>
          <div className='right-col'>
            <div className='tabs' style={{ height: travelerDetailsNavBarHeight }}>
              <NavLink exact to={`/traveler/${id}`} activeClassName='active'>{l('Timeline')}</NavLink>
              <NavLink to={`/traveler/${id}/reservations`} activeClassName='active'>{l('Reservations')}</NavLink>
              <NavLink to={`/traveler/${id}/maps`} activeClassName='active'>{l('Maps')}</NavLink>
              <NavLink to={`/traveler/${id}/flight-status`} activeClassName='active'>{l('Flight Status')}</NavLink>
              <NavLink to={`/traveler/${id}/travel-advisories`} className='travel-advisories' activeClassName='active'>
                {l('Travel Advisories')} <span className={'ta-level level-' + advisoryLevel}>{advisoryLevel}</span>
              </NavLink>
              <NavLink to={`/traveler/${id}/case-history`} activeClassName='active'>{l('Case History')}</NavLink>
            </div>
            <div className='tabs-content scroll' style={{ height: contentHeight }}>
              <Route exact path='/traveler/:id' render={(props) => <Timeline {...childProps} />} />
              <Route path='/traveler/:id/reservations' render={(props) => <Reservations {...childProps} /> } />
              <Route path='/traveler/:id/maps' render={(props) => <Maps {...childProps} /> } />
              <Route path='/traveler/:id/flight-status' render={(props) => <FlightStatus {...childProps} /> } />
              <Route path='/traveler/:id/travel-advisories' render={(props) => <TravelAdvisory {...childProps} /> } />
              <Route path='/traveler/:id/case-history' render={(props) => <CaseHistory {...childProps} /> } />
            </div>
          </div>
        </div>
        <AddCaseActionModal
          ref={this._addCaseActionModalRef}
          addCase={this.addCaseAction}
          caseActions={actions} />
      </div>
    );

    return (
      <div className='travelers-details-page'>
        <LoadingIcon loading={loading} />
        {!loading ? content : <br />}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TravelerView));
