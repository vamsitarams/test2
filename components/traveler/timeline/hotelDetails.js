import PropTypes from 'prop-types';
import React from 'react';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';
import { getAddressString, isManual } from '../../../helpers/timeline';

export class HotelDetails extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    hotelInfo: PropTypes.object.isRequired,
    reservation: PropTypes.object.isRequired,
    reservationId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    showReservationModal: PropTypes.func.isRequired
  };

  get date () {
    const { l } = this.context.i18n;
    const { getTimezoneTime } = this.context.i18n;
    const { hotelInfo, type } = this.props;
    const tz = hotelInfo.startStation.timeZoneName;
    const noTime = !isManual(hotelInfo);
    const dateFormat = noTime ? 'MMM DD' : 'MMM DD, hh:mm A';
    let date, label;
    if (type === 'check-in') {
      const startDate = (hotelInfo.startsAt && hotelInfo.startsAt.$date) ? hotelInfo.startsAt.$date : null;
      date = getTimezoneTime(startDate, dateFormat, tz);
      label = l('Check-in');
    }

    if (type === 'check-out') {
      const endDate = (hotelInfo.endsAt && hotelInfo.endsAt.$date) ? hotelInfo.endsAt.$date : null;
      date = getTimezoneTime(endDate, dateFormat, tz);
      label = l('Check-out');
    }

    if (date) {
      return (
        <dl>
          <dt>{label}</dt>
          <dd>{date}</dd>
        </dl>
      );
    }
  }

  get room () {
    const { l } = this.context.i18n;
    const hotelInfo = this.props.hotelInfo;
    if (hotelInfo &&
      hotelInfo.equipment &&
      hotelInfo.equipment.language &&
      hotelInfo.equipment.language[0] &&
      hotelInfo.equipment.language[0].description) {
      return (
        <dl>
          <dt>{l('Room:')}</dt>
          <dd>{hotelInfo.equipment.language[0].description}</dd>
        </dl>
      );
    }
  }

  get address () {
    const hotelInfo = this.props.hotelInfo;
    if (hotelInfo &&
      hotelInfo.startStation &&
      hotelInfo.startStation.language &&
      hotelInfo.startStation.language[0] &&
      hotelInfo.startStation.language[0].locations &&
      hotelInfo.startStation.language[0].locations[0]) {
      const addressObj = hotelInfo.startStation.language[0].locations[0];
      const address = getAddressString(addressObj);
      return (<span>{address}</span>);
    }
  }

  get contacts () {
    const { startStation } = this.props.hotelInfo;
    const contacts = [startStation];
    if (contacts.length) {
      return (
        <VendorContacts contacts={contacts} />
      );
    }
  }

  getCompanyName (companyData) {
    if (companyData &&
      companyData.startStation &&
      companyData.startStation.language &&
      companyData.startStation.language[0] &&
      companyData.startStation.language[0].name) {
      return companyData.startStation.language[0].name;
    }
  }

  showModal = (reservationId, reservation, travelerId) => (e) => {
    e.preventDefault();
    this.props.showReservationModal(reservationId, reservation, travelerId);
  }

  render () {
    const { l } = this.context.i18n;
    const { hotelInfo, hotelInfo: { confirmationNumber, vendor }, reservation, reservationId } = this.props;
    const hotelCode = vendor && vendor.code ? vendor.code : '';

    const companyName = this.getCompanyName();
    const confirmation = confirmationNumber ? (
      <dl><dt>{l('Confirmation')} #</dt> <dd>{confirmationNumber}</dd></dl>) : null;

    let reservationLink;
    if (reservation.products && reservation.products.length) {
      const travelerId = hotelInfo.subscriberId.$oid;
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
            <VendorImage code={hotelCode} vendorName={companyName} type='lodging' />
            {confirmation}
          </div>
        </div>
        <div className='info-holder row'>
          {this.date}
          {this.room}
          <dl>
            <dt>{l('Address')}</dt>
            <dd>{this.address}</dd>
          </dl>
        </div>
        {this.contacts}
      </section>
    );
  }
}
export default HotelDetails;
