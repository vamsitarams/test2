import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';
import { getActiveTravelerTimeline, getFightStatus, isManual } from '../../helpers/timeline';
// import CarTimelineEvents from './cartimeEvent';

export class HotelTimelineEvents extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    productsData: PropTypes.object.isRequired,
    carData: PropTypes.object.isRequired,
    hotelsData: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      pastEvent: [],
      currentUpcoming: []
    };
  }

  setEvents () {
    const { hotelsData: { timelineEvents } } = this.props.productsData;
    // const time = this.props.productsData.hotelsData.timelineEvents;
    const travelerTimelineEvents = timelineEvents || [];
    console.log(travelerTimelineEvents);
    const { pastEvent, currentUpcoming } = getActiveTravelerTimeline(travelerTimelineEvents);
    this.setState({
      pastEvent,
      currentUpcoming
    });
  }

  // setEvent () {
  //   const { hotelsData: { timelineEvents } } = this.props.productsData;
  //   const travelerTimelineEvents = timelineEvents || [];
  //   console.log(travelerTimelineEvents);
  //   const { pastEvent, currentUpcoming } = getActiveTravelerTimeline(travelerTimelineEvents);
  //   this.setState({
  //     pastEvent,
  //     currentUpcoming
  //   });
  // }

  initUpdates () {
    if (this.timer) clearInterval(this.timer);
    this.setEvents();
    this.timer = setInterval(() => {
      if (!this.state.currentUpcoming.length) {
        clearInterval(this.timer);
      }
      this.setEvents();
    }, 300000);
  }

  // initUpdate () {
  //   if (this.timer) clearInterval(this.timer);
  //   this.setEvent();
  //   this.timer = setInterval(() => {
  //     if (!this.state.currentUpcoming.length) {
  //       clearInterval(this.timer);
  //     }
  //     this.setEvent();
  //   }, 300000);
  // }

  shouldComponentUpdate (nextProps, nextState) {
    console.log(nextProps);
    return (
      !isEqual(this.props.productsData, nextProps.productsData) ||
      !isEqual(this.state, nextState)
    );
  }

  componentDidMount () {
    this.initUpdates();
    // this.initUpdate();
  }

  componentDidUpdate () {
    this.initUpdates();
    // this.initUpdate();
  }

  get timeline () {
    const { getTimezoneTime, l } = this.context.i18n;
    // const carData = this.props.productsData.carData.timelineEvents;
    // const hotelsData = this.props.productsData.hotelsData.timelineEvents;

    if (!this.state.currentUpcoming.length) {
      return (<li>{l('No upcoming events found')}.</li>);
    }

    const eventsArr = [].concat(this.state.pastEvent, this.state.currentUpcoming);
    let iterator = 0;
    const timelineEls = [];

    let alreadyCurrent = false;

    eventsArr.forEach((event, i) => {
      let divider;
      if (alreadyCurrent === false && (event.activePosition === 'current' || event.activePosition === 'prev')) {
        const dividerKey = iterator;
        divider = (<li className='current-position' key={dividerKey} />);
        timelineEls.push(divider);
        iterator++;
        alreadyCurrent = true;
      }

      let type = event.eventType.toLowerCase() === 'rail' ? 'Train' : event.eventType;
      type = type.toLowerCase();
      const date = getTimezoneTime(event.eventDateTime, 'MMM D', event.timeZoneName);
      const time = getTimezoneTime(event.eventDateTime, 'hh:mm A', event.timeZoneName);

      let fligthStatus;
      if (type === 'flight') {
        const flight = event.productRaw;
        const flightStatusObj = getFightStatus(flight.latestEvent, flight.startsAt.$date, flight.endsAt.$date);
        if (flightStatusObj.travelerStatus === 'warning' || flightStatusObj.travelerStatus === 'alarm') {
          let dirrection = null;
          if (flightStatusObj.worstDirection) {
            dirrection = flightStatusObj.worstDirection === 'departure' ? (
              <span className='arrow-top'>D</span>
            ) : (
              <span className='arrow-bottom'>A</span>
            );
          }
          fligthStatus = [
            dirrection,
            <span key={`event-${i}`}
              className={`${flightStatusObj.travelerStatus}-color`}>&nbsp;{flightStatusObj.flightStatus}</span>
          ];
        }
      }

      const prodType = event.productRaw.productType.toLowerCase();
      let timeElement = (
        <span>, <span className='time'>{time}</span></span>
      );

      if (prodType !== 'flight' && prodType !== 'rail') {
        if (!isManual(event.productRaw)) {
          timeElement = null;
        }
      }

      const timelineItem = (
        <li key={iterator}>
          <span className='date-hold'>{date}{timeElement}</span>
          <div className='event-info'>
            <div className='status'>
              {fligthStatus}
            </div>
            <div className='text-holder'>
              <span className='type'>{type}</span>
              <span className='sep' />
              <span>{event.eventLabel}</span>
            </div>
          </div>
        </li>
      );
      timelineEls.push(timelineItem);
      iterator++;
    });

    return timelineEls;
  }

  render () {
    // const carData = this.props.productsData.carData.timelineEvents;
    // const hotelsData = this.props.productsData.hotelsData.timelineEvents;

    // console.log(carData);
    return (
      <>
      {/* {carData.map(car => (
      <p key={car.index}>{car.eventType}{car.eventLabel}</p>
      ))}
    {hotelsData.map(hotel => (
      <p key={hotel.index}>{hotel.eventType}{hotel.eventLabel}</p>
    ))} */}
    <ul className='events'>{this.timeline}</ul>
    </>
    );
  }
}

export default HotelTimelineEvents;
