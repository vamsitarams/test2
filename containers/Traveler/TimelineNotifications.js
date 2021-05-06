import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { separateEvents, getFightStatus, flightSatuses } from '../../helpers/timeline';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';

import LoadingIcon from '../../components/common/loadingIcon';
import TimelineNotificationsSlider from '../../components/traveler/timelineNotificationsSlider';

import {
  stateTimelineData,
  stateLoading,
  actions as timelineActions
} from '../../redux/modules/timeline';

const mapStateToProps = createSelector(
  stateTimelineData,
  stateLoading,
  (timelineData, loading) => {
    const { timelineEvents } = timelineData;
    const events = separateEvents(timelineEvents);
    const notificationsList = filter(events.upcomingEvents, (item) => {
      if (item.eventType.toLowerCase() === 'flight') {
        const flight = item.productRaw;
        const fightStatus = getFightStatus(flight.latestEvent, flight.startsAt.$date, flight.endsAt.$date);
        return (
          fightStatus.flightStatus === flightSatuses.delay ||
          fightStatus.flightStatus === flightSatuses.canceled ||
          fightStatus.flightStatus === flightSatuses.diverted
        );
      }
      return false;
    });
    return {
      notificationsList,
      loading
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(timelineActions, dispatch)
  };
};

export class TimelineNotifications extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    notificationsList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loadEvents: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.id, nextProps.id) ||
      !isEqual(this.props.notificationsList, nextProps.notificationsList) ||
      !isEqual(this.props.loading, nextProps.loading)
    );
  }

  UNSAFE_componentWillMount () {
    const { id, loading, notificationsList } = this.props;
    if (id && !loading && !notificationsList.length) {
      this.props.loadEvents(id);
    }
  }

  render () {
    const { notificationsList, loading } = this.props;

    let timelineNotificationsSlider;
    if (notificationsList && notificationsList.length) {
      timelineNotificationsSlider = (
        <TimelineNotificationsSlider {...this.props} />
      );
    }

    return (
      <div>
        <LoadingIcon loading={loading} />
        {timelineNotificationsSlider}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNotifications);
