import PropTypes from 'prop-types';
import React from 'react';
import { getFightStatus } from '../../../helpers/timeline';

import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../../components/common/collapse';
import FlightDetails from './flightDetails';
import CarDetails from './carDetails';
import HotelDetails from './hotelDetails';
import TrainDetails from './trainDetails';

export class TimelineEvent extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    time: PropTypes.string.isRequired,
    day: PropTypes.string,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    eventInfo: PropTypes.object.isRequired,
    timelineEventType: PropTypes.string,
    reservation: PropTypes.object.isRequired,
    reservationId: PropTypes.string.isRequired,
    showReservationModal: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);

    this.state = {
      detailsOpenedClass: ''
    };
  }

  get details () {
    const { type, eventInfo, reservation, reservationId, showReservationModal } = this.props;

    switch (type.toLowerCase()) {
      case 'flight':
        return (
          <FlightDetails flightInfo={eventInfo} showReservationModal={showReservationModal}
            reservation={reservation} reservationId={reservationId} />
        );
      case 'hotel check-in':
        return (
          <HotelDetails hotelInfo={eventInfo} showReservationModal={showReservationModal}
            reservation={reservation} reservationId={reservationId} type='check-in' />
        );
      case 'hotel check-out':
        return (
          <HotelDetails hotelInfo={eventInfo} showReservationModal={showReservationModal}
            reservation={reservation} reservationId={reservationId} type='check-out' />
        );
      case 'car pick-up':
        return (
          <CarDetails carInfo={eventInfo} showReservationModal={showReservationModal}
            reservation={reservation} reservationId={reservationId} type='pick-up' />
        );
      case 'car drop-off':
        return (
          <CarDetails carInfo={eventInfo} showReservationModal={showReservationModal}
            reservation={reservation} reservationId={reservationId} type='drop-off' />
        );
      case 'rail':
        return (
          <TrainDetails trainInfo={eventInfo} showReservationModal={showReservationModal}
            reservation={reservation} reservationId={reservationId} />
        );
    }
  }

  getFlightStatus () {
    const { type, eventInfo } = this.props;

    if (type.toLowerCase() !== 'flight') {
      return {};
    }
    const flightStatusObj = getFightStatus(eventInfo.latestEvent, eventInfo.startsAt.$date, eventInfo.endsAt.$date);
    let dirrection = null;
    if (flightStatusObj.worstDirection) {
      dirrection = flightStatusObj.worstDirection === 'departure' ? (
        <span className='arrow-top'>D</span>
      ) : (
        <span className='arrow-bottom'>A</span>
      );
    }
    const flightMessage = (
      <span className='flight-message'>
        {dirrection}
        <div className={`${flightStatusObj.travelerStatus}-color`}><span
          className={`icon ${flightStatusObj.travelerStatus}`} />
          {flightStatusObj.statusMessage}</div>
      </span>
    );
    const flightClass = `${flightStatusObj.flightStatus} ${flightStatusObj.travelerStatus}-bgcolor`;

    return {
      flightClass,
      flightMessage
    };
  }

  toggleTimelineDetails = (isOpened) => () => {
    this.setState({
      detailsOpenedClass: isOpened ? 'timeline-expanded' : ''
    });
  }

  render () {
    const { l } = this.context.i18n;
    const { time, day, type, name, timelineEventType, eventInfo: { journeyName } } = this.props;
    const dayEl = day ? (<strong>{day}</strong>) : null;
    const eventType = (type.toLowerCase() === 'rail') ? l('Train') : type;
    const index = eventType.indexOf(' ');
    const eventIconClass = index !== -1 ? eventType.slice(0, index).toLowerCase() : eventType.toLowerCase();

    const flightStatus = this.getFlightStatus();
    const flightStatusClass = flightStatus.flightClass ? flightStatus.flightClass : '';
    const timelineExpandedClass = this.state.detailsOpenedClass;
    const flightStatusMessage = flightStatus.flightMessage ? flightStatus.flightMessage : null;
    const eventName = name ? (<h3>{name}</h3>) : null;

    return (
      <div className='timline-item-holder'>
        <div className='timeline-date'><div className='date-holder'>{dayEl}</div> <span>{time}</span></div>
        <div className={`timline-item ${timelineEventType} ${flightStatusClass} ${timelineExpandedClass}`}>
          <CollapseHolder
            saveState={journeyName + name + type}
            saveBySession
            onCollapseOpen={this.toggleTimelineDetails(true)}
            onCollapseClose={this.toggleTimelineDetails(false)}>
            <CollapseOpener>
              <div className='event-short-info'>
                <span className='dots' />
                <div className='text-holder'>
                  <span className={`${eventIconClass} type-icon`}>{eventType}</span>
                  <span className='type-text'>{eventType}</span>
                  {eventName}
                </div>
                <div className='opener-message'>{flightStatusMessage}</div>
              </div>
            </CollapseOpener>
            <CollapseBlock>
              <div className='tl-content'>
                {this.details}
              </div>
            </CollapseBlock>
          </CollapseHolder>
        </div>
      </div>
    );
  }
}
export default TimelineEvent;
