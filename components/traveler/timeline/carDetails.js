import PropTypes from 'prop-types';
import React from 'react';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';
import isEmpty from 'lodash/isEmpty';
import { getAddressString, isManual } from '../../../helpers/timeline';

export class CarDetails extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    carInfo: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    reservation: PropTypes.object.isRequired,
    reservationId: PropTypes.string.isRequired,
    showReservationModal: PropTypes.func.isRequired
  };

  get contacts () {
    const { carInfo: { vendor } } = this.props;
    if (vendor) {
      return (
        <VendorContacts contacts={[vendor]} />
      );
    }
  }

  getCompanyName (station) {
    if (station &&
      station.vendor &&
      station.vendor.language &&
      station.vendor.language[0] &&
      station.language[0].name) {
      return station.vendor.language[0].name;
    }
  }

  getAddress (station) {
    if (station &&
      station.language &&
      station.language[0] &&
      station.language[0].locations &&
      station.language[0].locations[0]) {
      const addressObj = station.language[0].locations[0];
      return getAddressString(addressObj);
    }
  }

  getDate (carInfo, dateObj, timeZoneName) {
    const { getTimezoneTime } = this.context.i18n;
    const startDate = (dateObj && dateObj.$date) ? dateObj.$date : null;
    const noTime = !isManual(carInfo);
    const dateFormat = noTime ? 'MMM DD' : 'MMM DD, hh:mm A';
    if (!startDate) {
      return;
    }

    return getTimezoneTime(startDate, dateFormat, timeZoneName);
  }

  get carTypeAndModel () {
    const { l } = this.context.i18n;
    const { carInfo } = this.props;
    if (carInfo &&
      carInfo.equipment &&
      carInfo.equipment.language &&
      carInfo.equipment.language.length &&
      carInfo.equipment.language[0] &&
      carInfo.equipment.language[0].description) {
      return (
        <dl>
          <dt>{l('Car Type')}</dt>
          <dd>{carInfo.equipment.language[0].description}</dd>
        </dl>
      );
    }
  }

  showModal = (reservationId, reservation) => (e) => {
    e.preventDefault();
    this.props.showReservationModal(reservationId, reservation);
  }

  render () {
    const { l } = this.context.i18n;
    const { carInfo, carInfo: { confirmationNumber, vendor }, type, reservation, reservationId } = this.props;
    const carCode = vendor && vendor.code ? vendor.code : '';
    const companyName = this.getCompanyName() || '';
    const confirmation = confirmationNumber ? (
      <dl><dt>{l('Reservation')}#</dt><dd>{confirmationNumber}</dd></dl>) : null;
    let typeLabel, date, address, station;

    if (type === 'pick-up') {
      typeLabel = l('Pick-up');
      station = carInfo.startStation;
      date = this.getDate(carInfo, carInfo.startsAt, station.timeZoneName);
      address = this.getAddress(station) || '';
    } else {
      typeLabel = l('Drop-off');
      station = carInfo.endStation && !isEmpty(carInfo.endStation) ? carInfo.endStation : carInfo.startStation;
      date = this.getDate(carInfo, carInfo.endsAt, station.timeZoneName);
      address = this.getAddress(station) || '';
    }

    let reservationLink;
    if (reservation.products && reservation.products.length) {
      reservationLink = (
        <a href='#' className='reservation-link' onClick={this.showModal(reservationId, reservation)}>
          {l('View Reservation')}
        </a>
      );
    }

    return (
      <section className='timaline-card'>
        <div className='row'>
          {reservationLink}
          <div className='holder'>
            <VendorImage code={carCode} vendorName={companyName} type='car-rental' />
            {confirmation}
          </div>
        </div>
        <div className='info-holder row'>
          <dl>
            <dt>{typeLabel}</dt>
            <dd>{date}</dd>
          </dl>
          <dl>
            <dt>{typeLabel} {l('Address')}</dt>
            <dd>{address}</dd>
          </dl>
          {this.carTypeAndModel}
        </div>
        {this.contacts}
      </section>
    );
  }
}
export default CarDetails;
