import PropTypes from 'prop-types';
import React from 'react';
import TrainStationInfo from './trainStationInfo';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';
import uniqBy from 'lodash/uniqBy';

export class TrainDetails extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    trainInfo: PropTypes.object.isRequired,
    reservation: PropTypes.object.isRequired,
    reservationId: PropTypes.string.isRequired,
    showReservationModal: PropTypes.func.isRequired
  };

  get contacts () {
    const { vendor } = this.props.trainInfo;
    if (vendor) {
      let contacts = [vendor];
      if (contacts.length) {
        contacts = uniqBy(contacts, (contact) => {
          return contact.code;
        });
      }
      return (
        <VendorContacts contacts={contacts} />
      );
    }
  }

  showModal = (reservationId, reservation, travelerId) => (e) => {
    e.preventDefault();
    this.props.showReservationModal(reservationId, reservation, travelerId);
  }

  render () {
    const { l } = this.context.i18n;
    const {
      trainInfo, trainInfo: { startStation, endStation, ticketNumber, vendor },
      reservation, reservationId
    } = this.props;

    const trainCompanyCode = vendor && vendor.code ? vendor.code : '';
    const trainCompanyName = vendor && vendor.language && vendor.language[0] && vendor.language[0].name
      ? vendor.language[0].name : '';

    const startDate = trainInfo.startsAt.$date;
    const endDate = trainInfo.endsAt.$date;
    const ticketInfo = ticketNumber ? (
      <dl><dt>{l('Ticket')} #</dt> <dd>{ticketNumber}</dd></dl>) : null;

    let reservationLink;
    if (reservation.products && reservation.products.length) {
      const travelerId = trainInfo.subscriberId.$oid;
      reservationLink = (
        <a href='#' className='reservation-link' onClick={this.showModal(reservationId, reservation, travelerId)}>{l(
          'View Reservation')}</a>
      );
    }

    return (
      <section className='timaline-card'>
        <div className='row'>
          {reservationLink}
          <div className='holder'>
            <VendorImage code={trainCompanyCode} vendorName={trainCompanyName} type='rail' />
            {ticketInfo}
          </div>
        </div>
        <div className='info-holder row'>
          <TrainStationInfo
            type='departure'
            station={startStation}
            date={startDate}
          />
          <TrainStationInfo
            type='arrival'
            station={endStation}
            date={endDate}
          />
        </div>
        {this.contacts}
      </section>
    );
  }
}
export default TrainDetails;
