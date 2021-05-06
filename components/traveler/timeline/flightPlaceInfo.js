import PropTypes from 'prop-types';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import config from '../../../config';
import { addDelay } from '../../../helpers/timeline';

export class FlightPlaceInfo extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    type: PropTypes.string.isRequired,
    station: PropTypes.object.isRequired,
    date: PropTypes.number.isRequired,
    seats: PropTypes.string,
    latestEvent: PropTypes.object
  };

  get stationName () {
    const { l } = this.context.i18n;
    const station = this.props.station;
    if (station &&
      station.language &&
      station.language[0] &&
      station.language[0].name) {
      const localAirportWord = l('Airport');
      const airportRe = new RegExp(localAirportWord, 'i');
      const name = station.language[0].name.replace(airportRe, '').replace(/\s+$/, '');
      return (<span>{name} {localAirportWord}</span>);
    }
  }

  get date () {
    const { getTimezoneTime } = this.context.i18n;
    const { date, type, latestEvent } = this.props;
    const tz = this.props.station.timeZoneName;
    const day = getTimezoneTime(date, 'MMM DD', tz);
    const time = (<span className='flight-time'>{getTimezoneTime(date, 'hh:mm A', tz)}</span>);

    let dateClass = '';
    let delayItem;
    let delayDay, delayDayItem;

    if (!isEmpty(latestEvent) && latestEvent.flifo) {
      let delayDuration = 0;
      const diffETD = latestEvent.flifo.ETDDiff;
      const diffETA = latestEvent.flifo.ETADiff;
      if (type === 'departure' && diffETD) delayDuration = diffETD;
      if (type === 'arrival' && diffETA) delayDuration = diffETA;

      // Delay date info
      if (delayDuration) {
        dateClass = 'delay-date';
        let delayItemClass = 'ok';
        if (delayDuration >= config.flightStatus.warningDelayStartMin) delayItemClass = 'warning';
        if (delayDuration > config.flightStatus.alarmDelayStartMin) delayItemClass = 'delay-time';
        delayDay = getTimezoneTime(addDelay(date, delayDuration), 'MMM DD', tz);
        delayDayItem = day !== delayDay ? (<span className={delayItemClass}>{delayDay}</span>) : null;
        delayItem = (
          <span className={`${delayItemClass} bold`}>
            {getTimezoneTime(addDelay(date, delayDuration), 'hh:mm A', tz)}
          </span>
        );
      }
    }

    return (
      <span className={`flight-date ${dateClass}`}>
        <strong>{delayDayItem} <span className='flight-day'>{day}</span></strong>
        <br />
        <span>{delayItem} {time}</span>
      </span>
    );
  }

  get seats () {
    const { l } = this.context.i18n;
    const seats = this.props.station.seats;
    if (this.props.type === 'departure' && seats) {
      return (<dl><dt>{l('Seat')} </dt> <dd>{seats}</dd></dl>);
    }
  }

  get baggage () {
    const { l } = this.context.i18n;
    const baggage = this.props.station.baggage;
    if (this.props.type === 'arrival' && baggage) {
      return (<dl><dt>{l('Baggage Claim')}</dt> <dd>{baggage}</dd></dl>);
    }
  }

  render () {
    const { l } = this.context.i18n;
    const { station, type } = this.props;
    const direction = (type === 'departure') ? l('Departs') : l('Arrives');
    const terminal = station.terminal ? (<dl><dt>{l('Term')}</dt> <dd>{station.terminal}</dd> </dl>) : null;
    const gate = station.gate ? (<dl><dt>{l('Gate')}</dt> <dd>{station.gate} </dd></dl>) : null;
    return (
      <div className='flight-place-info'>
        <dl className='airport-name'>
          <dt>{station.code}</dt>
          <dd>{this.stationName}</dd>
        </dl>
        <dl className='dl-direction'>
          <dt>{direction}</dt>
          <dd>{this.date}</dd>
        </dl>
        <div className='dl-list'>
          {terminal}
          {gate}
          {this.seats}
          {this.baggage}
        </div>
      </div>
    );
  }
}
export default FlightPlaceInfo;
