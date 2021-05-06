import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import isEqual from 'lodash/isEqual';
import { getPastEvents, separateEvents } from '../../helpers/timeline';
// import { getPastEvents, separateEvents, _dumpEvent } from '../../helpers/timeline';

import LoadingIcon from '../../components/common/loadingIcon';
import TimelineEventsList from '../../components/traveler/timeline/timelineEventsList';
import { withRouter } from 'react-router-dom';

import {
  stateTimelineData,
  stateLoading,
  actions as timelineActions
} from '../../redux/modules/timeline';
import {
  actions as travelerActions, stateTravelAdvisoryLevel,
  stateTraveler
} from '../../redux/modules/travelerDetails';
import { stateAppSettingsConstants, stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import { actions as reservationsActions } from '../../redux/modules/reservations';
import { actions as pusherActions } from '../../redux/modules/pusher';
import { stateUserRole } from '../../redux/modules/user';
import Data from '../../helpers/dummydata'

export class TimelineContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.match);
    this.state = {
      loading:true,
      travelerId:this.props.match.params.id,
      match:this.props.match,
      reservations:{}
    };
  }


  static contextTypes = {
    i18n: PropTypes.object
  };


  setCurrentPosition (cb = () => {}) {
    console.log("Coming here*************************************");
    //Make get server data here
    const timelineEvents = Data['timeline']['data']["timelineEvents"];
    const reservations = Data['timeline']['data']["reservations"];

    const events = separateEvents(timelineEvents);
    // console.log('---------------------');
    // [].concat(events.pastEvents, events.upcomingEvents).map(function (event) { _dumpEvent(event); });
    const { lastDayEvents, pastEvents } = getPastEvents(events.pastEvents);
    const upcomingEvents = [].concat(lastDayEvents, events.upcomingEvents);

    this.setState({
      upcomingEvents,
      pastEvents,
      reservations:reservations,

    }, cb);
    console.log(this.state);
  }

  componentDidMount () {
    this.setCurrentPosition();
    this.timer = setInterval(() => {
      this.setCurrentPosition(() => {
        this.forceUpdate();
      });
    }, 60000);
  }



  componentWillUnmount () {
    if (this.timer) clearInterval(this.timer);
  }

  render () {
    const { l } = this.context.i18n;
    const { loading, travelerId, match: { params: { id } } } = this.state;
    const upcomingEvents = this.state && this.state.upcomingEvents;
    const pastEvents = this.state && this.state.pastEvents;
    console.log(this.state);
    let timelineContainer;
    if (upcomingEvents && upcomingEvents.length || pastEvents && pastEvents.length) {
      timelineContainer = (
        <TimelineEventsList {...this.props} {...this.state} />
      );
    } else if (upcomingEvents && !upcomingEvents.length && !loading) {
      timelineContainer = (<div className='load-events'><span>{l('No timeline events found')}</span></div>);
    }

    return (
      <div>

        {travelerId === id && timelineContainer}
      </div>
    );
  }
}

export default withRouter(TimelineContainer);
