import PropTypes from 'prop-types';
import React from 'react';
import groupBy from 'lodash/groupBy';
// import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';
import { Link } from 'react-router-dom';
import { sprintf } from '../../../i18n/utils';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../../components/common/collapse';

export class FlightReservation extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    flightReservation: PropTypes.object.isRequired,
    travelerId: PropTypes.string.isRequired,
    collapseExpanded: PropTypes.bool,
    saveState: PropTypes.bool,
    collapseDisabled: PropTypes.bool
  };

  prepareState (flightReservation) {
    const { l, ngettext, humanizeDuration } = this.context.i18n;
    const travelers = uniqBy(flightReservation.travelers, '_id.$oid');
    const reservation = { ...flightReservation };
    const segments = groupBy(reservation.items, (item) => {
      return item.segmentOrder || 0;
    });

    // reservation.totalPrice = reduce(reservation.items, (sum, item) => sum + (item.price || 0), 0);
    reservation.totalPrice = reservation.items[0].price;
    reservation.currency = reservation.items[0].currency;
    reservation.segments = Object.keys(segments).map((segmentId) => {
      const segment = segments[segmentId].map((flight, i) => {
        let layover = 0;
        const inFlight = humanizeDuration(flight.endsAt.$date - flight.startsAt.$date);
        const nextFlight = segments[segmentId][i + 1];
        if (nextFlight) {
          layover = (
            <span className='layover'>
              {humanizeDuration(nextFlight.startsAt.$date - flight.endsAt.$date)} {l('layover')}
            </span>
          );
        }
        return { ...flight, layover, inFlight };
      });
      const duration = segment[segment.length - 1].endsAt.$date - segment[0].startsAt.$date;
      const stopNumber = segment.length - 1;
      const stops = stopNumber ? ', ' + sprintf(ngettext('%d stop', '%d stops', stopNumber), stopNumber) : '';

      return {
        segmentId: segmentId,
        segment: segment,
        duration: duration,
        stops: stops
      };
    });
    reservation.travelers = travelers;
    reservation.source = reservation.source ? reservation.source.toLowerCase() : 'manual';
    const contacts = [];
    reservation.items.forEach((flight) => {
      contacts.push(flight.marketingAirline);
      contacts.push(flight.operatingAirline);
    });
    reservation.contacts = uniqBy(contacts, (contact) => contact ? contact.code : '');
    return reservation;
  }

  getOperated (flight) {
    const { l } = this.context.i18n;
    if (
      flight.marketingAirline &&
      flight.marketingAirline.code !== flight.operatingAirline.code && flight.operatingAirline.language[0]
    ) {
      return (
        <div className='operated-by'>
          {l('Operated by')} {flight.operatingAirline.language[0].name}
        </div>
      );
    }
    return '';
  }

  getPlane (flight) {
    return flight.equipment && flight.equipment.language ? flight.equipment.language[0].name : flight.equipment;
  }

  getSegmentCities (flights) {
    return `
        ${flights[0].startStation.language[0].locations[0].city} - 
        ${flights[flights.length - 1].endStation.language[0].locations[0].city}`;
  }

  getSegmentDates (flights) {
    const { getTimezoneTimeInterval } = this.context.i18n;
    return getTimezoneTimeInterval(
      flights[0].startsAt.$date,
      flights[0].startStation.timeZoneName,
      flights[flights.length - 1].endsAt.$date,
      flights[flights.length - 1].endStation.timeZoneName
    );
  }

  getTotalPrice (reservation) {
    const { l } = this.context.i18n;
    if (reservation.totalPrice && reservation.currency) {
      return (
        <span className='total-price'>
          {l('Total price')}: {l(reservation.currency)}{reservation.totalPrice}
        </span>
      );
    }
    return null;
  }

  getAgencyRecLoc (reservation) {
    const { l } = this.context.i18n;
    if (
      reservation.items[0] &&
      reservation.items[0].recLoc
    ) {
      return (
        <dl>
          <dt>{l('Agency RECLOC #')}</dt>
          <dd>{reservation.items[0].recLoc}</dd>
        </dl>
      );
    }
    return <dl />;
  }

  getAirlineRecLoc (reservation) {
    const { l } = this.context.i18n;
    if (
      reservation.items &&
      reservation.items[0] &&
      reservation.items[0].confirmationNumber &&
      reservation.id.indexOf('PROD_ID_') === -1 &&
      reservation.id.indexOf('CONF_NUM_') >= 0
    ) {
      return (
        <dl>
          <dt>{l('Airline RECLOC #')}</dt>
          <dd>{reservation.items[0].confirmationNumber}</dd>
        </dl>
      );
    }
    return <dl />;
  }

  getStatus (reservation) {
    // todo: add reservation status (changed, canceled) @phase2
    return '';
  }

  render () {
    const { l, humanizeDuration, getTimezoneTime } = this.context.i18n;
    const travelerId = this.props.travelerId;
    const reservation = this.prepareState(this.props.flightReservation);
    if (!reservation.items[0]) return null;
    const totalPrice = this.getTotalPrice(reservation);
    const agencyRecLoc = this.getAgencyRecLoc(reservation);
    const airlineRecLoc = this.getAirlineRecLoc(reservation);
    // get uniq ID for reservation
    const names = reservation.items.map((item) => item.flightNumber).join('');
    return (
      <div className='reservation-item flight-reservation  item-l2'>
        <CollapseHolder
          saveBySession
          saveState={this.props.saveState ? 'flight' + names : false}
          expanded={this.props.collapseExpanded}
          disabled={this.props.collapseDisabled}>
          <CollapseOpener>
            <table>
              <tbody>
                <tr>
                  <td width='22'><span className='flight type-icon'>flight</span></td>
                  <td width='200'>
                    <h4>{l('Flight Reservation')}</h4>
                    {status ? <span className='status'>{status}</span> : null}
                  </td>
                  <td>{airlineRecLoc}</td>
                  <td>{agencyRecLoc}</td>
                  <td width='40'>
                    <span className={'source-icon ' + reservation.source.toLowerCase()}>{reservation.source}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <span className='arrow' />
          </CollapseOpener>
          <CollapseBlock>
            <div className='tl-content item-l3'>
              <div className='row' style={{marginLeft: '0px'}}>
                <span className='travelers'>
                  {reservation.travelers.map((traveler, i) => {
                    if (travelerId === traveler._id.$oid) {
                      return (
                        <span key={traveler._id.$oid}>
                          {i !== 0 ? ', ' : ''} {traveler.firstName} {traveler.lastName}
                        </span>
                      );
                    } else {
                      return (
                        <span key={traveler._id.$oid}>
                          {i !== 0 ? ', ' : ''}
                          <Link to={`/traveler/${traveler._id.$oid}`} key={traveler._id.$oid}>
                            {traveler.firstName} {traveler.lastName}
                          </Link>
                        </span>
                      );
                    }
                  })}
                </span>
                {totalPrice}
              </div>
              <div className='info-holder row' style={{marginLeft: '0px',marginRight:'0px'}}>
                {reservation.segments.map((segmentObj) => {
                  return (
                    <div key={segmentObj.segmentId}>
                      <h4>
                        <span>
                          {this.getSegmentCities(segmentObj.segment)}, {this.getSegmentDates(segmentObj.segment)}
                        </span>
                        <span className='time'>
                          {l('Total flight time')}: {humanizeDuration(segmentObj.duration)}
                          {segmentObj.stops}
                        </span>
                      </h4>
                      <ul className='fr-list'>
                        {segmentObj.segment.map((flight) => {
                          return (
                            <li key={flight._id.$oid}>
                              <table>
                                <tbody>
                                  <tr>
                                    <td>
                                      <VendorImage
                                        code={flight.marketingAirline ? flight.marketingAirline.code : ''}
                                        vendorName={flight.startStation && flight.startStation.language
                                          ? flight.startStation.language[0].name : ''} type='flight' />
                                    </td>
                                    <td>
                                      <div>
                                        {flight.marketingAirline ? flight.marketingAirline.code : ''}{' '}
                                        {flight.flightNumber}
                                      </div>
                                      <div>
                                        {flight.startStation && flight.startStation.language
                                          ? flight.startStation.language[0].name : ''},&nbsp;
                                        {flight.startStation ? flight.startStation.code : ''}{' - '}
                                        {flight.endStation && flight.endStation.language
                                          ? flight.endStation.language[0].name : ''},&nbsp;
                                        {flight.endStation ? flight.endStation.code : ''}
                                      </div>
                                      {this.getOperated(flight)}
                                    </td>
                                    <td>
                                      <dl>
                                        <dt>{l('Departure')}</dt>
                                        <dd>{getTimezoneTime(
                                          flight.startsAt.$date,
                                          'hh:mm A, MMM D',
                                          (flight.startStation && flight.startStation.timeZoneName)
                                            ? flight.startStation.timeZoneName : null
                                        )}</dd>
                                      </dl>
                                      <dl>
                                        <dt>{l('Arrival')}</dt>
                                        <dd>{getTimezoneTime(
                                          flight.endsAt.$date,
                                          'hh:mm A, MMM D',
                                          (flight.endStation && flight.endStation.timeZoneName)
                                            ? flight.endStation.timeZoneName : null
                                        )}</dd>
                                      </dl>
                                    </td>
                                    <td>
                                      <dl>
                                        <dt>{l('In flight')} </dt>
                                        <dd>{flight.inFlight}</dd>
                                      </dl>
                                      <strong>{this.getPlane(flight)}</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              {flight.layover ? flight.layover : ''}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <VendorContacts contacts={reservation.contacts} />
            </div>
          </CollapseBlock>
        </CollapseHolder>
      </div>
    );
    // const status = this.getStatus(reservation);
  }
}
export default FlightReservation;
