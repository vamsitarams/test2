import PropTypes from 'prop-types';
import React from 'react';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../../components/common/collapse';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';
import { getAddressString } from '../../../helpers/timeline';

export class RailReservation extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    railReservation: PropTypes.object.isRequired,
    collapseExpanded: PropTypes.bool,
    saveState: PropTypes.bool,
    collapseDisabled: PropTypes.bool
  };

  prepareState (railReservation) {
    const reservation = { ...railReservation };
    reservation.totalPrice = reduce(reservation.items, (sum, item) => sum + (item.price || 0), 0);
    const contacts = [];
    reservation.items.forEach((rail) => {
      if (rail.vendor) {
        contacts.push(rail.vendor);
      }
    });
    if (contacts.length) {
      reservation.contacts = uniqBy(contacts, (contact) => contact.code);
    }

    return reservation;
  }

  getAddress (station) {
    if (
      station &&
      station.language &&
      station.language[0].locations &&
      station.language[0].locations[0]
    ) {
      return getAddressString(station.language[0].locations[0]);
    }
    return '';
  }

  getVendorName (vendor) {
    if (vendor && vendor.language && vendor.language[0].name) {
      return vendor.language[0].name;
    }
    return '';
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

  getTicketInfo (railInfo) {
    const { l } = this.context.i18n;
    if (railInfo.ticketNumber) {
      return (
        <dl>
          <dt>{l('Ticket #')}</dt>
          <dd>{railInfo.ticketNumber}</dd>
        </dl>
      );
    }
    return null;
  }

  render () {
    const { l, getTimezoneTime } = this.context.i18n;
    const reservation = this.prepareState(this.props.railReservation);
    if (!reservation.items[0]) return null;

    const railInfo = reservation.items[0];
    const totalPrice = this.getTotalPrice(reservation);
    const vendorName = this.getVendorName(railInfo.vendor);
    const vendorCode = railInfo.vendor && railInfo.vendor.code ? railInfo.vendor.code : '';
    const departureTime = getTimezoneTime(
      railInfo.startsAt.$date,
      'MMM D, hh:mm A',
      railInfo.startStation.timeZoneName
    );
    const arrivalTime = getTimezoneTime(
      railInfo.endsAt.$date,
      'MMM D, hh:mm A',
      railInfo.endStation.timeZoneName
    );
    const departureAddress = this.getAddress(railInfo.startStation);
    const arrivalAddress = this.getAddress(railInfo.endStation);
    const ticketInfo = this.getTicketInfo(railInfo);
    // get uniq ID for reservation
    const names = reservation.items.map((item) => {
      return item.startStation.code + item.endStation.code + item.journeyName;
    }).join('');
    return (
      <div className='reservation-item rail-reservation  item-l2'>
        <CollapseHolder
          saveBySession
          saveState={this.props.saveState ? 'rail' + names : false}
          expanded={this.props.collapseExpanded}
          disabled={this.props.collapseDisabled}>
          <CollapseOpener>
            <table>
              <tbody>
                <tr>
                  <td width='22'><span className='rail type-icon'>rail</span></td>
                  <td width='200'><h4>{l('Train Reservation')}</h4></td>
                  <td>{ticketInfo}</td>
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
              <div className='row' style={{marginLeft:0}}>
                <VendorImage code={vendorCode} vendorName={vendorName} type='rail' />
                <h3>{railInfo.trainNumber} {vendorName}</h3>
                {totalPrice}
              </div>
              <div className='info-holder row' style={{marginLeft: '0px'}}>
                <div className='flight-place-info'>
                  <dl>
                    <dt>{l('Departure')}</dt>
                    <dd>{departureTime}</dd>
                  </dl>
                  <dl>
                    <dt>{l('Departure address')}</dt>
                    <dd>{departureAddress}</dd>
                  </dl>
                </div>
                <div className='flight-place-info'>
                  <dl>
                    <dt>{l('Arrival')}</dt>
                    <dd>{arrivalTime}</dd>
                  </dl>
                  <dl>
                    <dt>{l('Arrival address')}</dt>
                    <dd>{arrivalAddress}</dd>
                  </dl>
                </div>
              </div>
              <VendorContacts contacts={reservation.contacts} />
            </div>
          </CollapseBlock>
        </CollapseHolder>
      </div>
    );
  }
}
export default RailReservation;
