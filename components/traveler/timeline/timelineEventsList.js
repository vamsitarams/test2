import PropTypes from 'prop-types';
import React from 'react';
import TimelineEvent from './timelineEvent';
import { isExternalEventWithoutTime, isManual } from '../../../helpers/timeline';
import reverse from 'lodash/reverse';
import ResrvationModal from '../modals/reservationModal';

export class TimelineEventsList extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    upcomingEvents: PropTypes.array.isRequired,
    pastEvents: PropTypes.array.isRequired,
    reservations: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this._reservationModalRef = React.createRef();
    this.state = {
      _pastEvents: [],
      _pastEventsCount: 0
    };
  }

  get timeLineEvents () {
    const { l, getTimezoneTime } = this.context.i18n;
    let currenDay = '';

    const allEvents = [].concat(this.state._pastEvents, this.props.upcomingEvents);
    const timeLineEvents = allEvents.map((event) => {
      const { eventDateTime, timeZoneName, productRaw, productId } = event;
      const eventType = event.eventType;
      let eventTime = getTimezoneTime(eventDateTime, 'hh:mm A', timeZoneName);
      const newDay = getTimezoneTime(eventDateTime, 'MMM DD', timeZoneName);
      let day;

      const eventLabel = event.eventLabel ? event.eventLabel : '';

      if (currenDay !== newDay) {
        day = currenDay = newDay;
      }

      // do not display time if product were added by external resource
      if (isExternalEventWithoutTime(event)) {
        eventTime = '';
      }

      let timelineEventType = 'timeline-upcomming-event';
      if (event.pastEvent) {
        timelineEventType = 'timeline-past-event';
      }

      if (event.activePosition === 'current') {
        timelineEventType = 'timeline-active-event';
      }

      const activeDivider = event.activePosition === 'prev' ? (
        <div className='timeline-active-divider' />) : null;

      const lastActiveDivider = event.activePosition === 'next' ? (
        <div className='timeline-active-divider last' />) : null;

      const reservationId = event.uniqueReservationKey;
      let eventReservation = {};
      if (reservationId) {
        eventReservation = this.props.reservations[reservationId];
      }

      const newDayClass = day ? 'new-day-item' : '';
      const baseType = eventType.toLowerCase();
      const noArrowClass = !isManual(productRaw) && baseType !== 'flight' && baseType !== 'rail' ? 'no-arrow' : '';
      const wpClass = 'wpa-' + (productRaw.waypointAOrder || '-') + 'wpb-' + (productRaw.waypointBOrder || '-');

      return (
        <div className={`tl-item is-${timelineEventType} ${newDayClass} ${noArrowClass} ${wpClass}`}
          key={eventDateTime + productId}>
          {activeDivider}
          <TimelineEvent
            key={productRaw._id.$oid + eventTime}
            timelineEventType={timelineEventType}
            time={eventTime}
            day={day}
            type={eventType}
            name={eventLabel}
            eventInfo={productRaw}
            showReservationModal={this.showReservationModal}
            reservation={eventReservation}
            reservationId={reservationId}
          />
          {lastActiveDivider}
        </div>
      );
    });

    if (!timeLineEvents.length) {
      return (<span className='no-events'>{l('No upcoming events found')}.</span>);
    }

    return timeLineEvents;
  }

  getPastEvents = (eventsNumber) => (e) => {
    e.preventDefault();
    if (this.state._pastEvents.length === this.props.pastEvents.length) {
      this.setState({
        _pastEvents: [],
        _pastEventsCount: 0
      });
    } else {
      const partialPastEvents = this.state._pastEvents;
      const allPastEvents = reverse([...this.props.pastEvents]);
      const startIndex = partialPastEvents;
      const endIndex = (this.state._pastEventsCount + eventsNumber < allPastEvents.length)
        ? this.state._pastEventsCount + eventsNumber : allPastEvents.length;
      const pastEventsPart = reverse([...allPastEvents.slice(startIndex, endIndex)]);

      this.setState({
        _pastEvents: pastEventsPart,
        _pastEventsCount: endIndex
      });
    }
  }

  get loadMore () {
    const { l } = this.context.i18n;
    // Show message that traveler doesn't have prev events
    if (!(this.props.pastEvents && this.props.pastEvents.length)) {
      return (<div className='load-events'><span>{l('No Past Events found')}</span></div>);
    }
    // Show hide button if all past events has been already shown
    if (this.state._pastEvents.length === this.props.pastEvents.length) {
      return (
        <div className='load-events'>
          <a href='#' onClick={this.getPastEvents()}>{l('Hide All Past Events')}</a>
        </div>
      );
    }

    return (
      <div className='load-events'>
        <a href='#' onClick={this.getPastEvents(10)}>{l('Load Past Events ')}</a>
      </div>
    );
  }

  showReservationModal = (reservationId, reservation, travelerId) => {
    if (this._reservationModalRef && this._reservationModalRef.current) {
      this._reservationModalRef.current.showReservationModal(reservationId, reservation, travelerId);
    }
  }

  render () {
    return (
      <div>
        {this.loadMore}
        <div className='timeline-section'>
          {this.timeLineEvents}
        </div>
        <ResrvationModal
          ref={this._reservationModalRef} />
      </div>
    );
  }
}
export default TimelineEventsList;
