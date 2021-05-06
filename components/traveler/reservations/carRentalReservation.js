import PropTypes from 'prop-types';
import React from 'react';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../../components/common/collapse';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';
import { getAddressString, isManual } from '../../../helpers/timeline';

export class CarRentalReservation extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    carReservation: PropTypes.object.isRequired,
    collapseExpanded: PropTypes.bool,
    saveState: PropTypes.bool,
    collapseDisabled: PropTypes.bool
  };

  prepareState (carReservation) {
    const reservation = { ...carReservation };
    reservation.totalPrice = reduce(reservation.items, (sum, item) => sum + (item.price || 0), 0);
    const contacts = [];
    reservation.items.forEach((car) => {
      if (car.vendor) {
        contacts.push(car.vendor);
      }
    });
    if (contacts.length) {
      reservation.contacts = uniqBy(contacts, (contact) => {
        return contact.code;
      });
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

  getCarType (equipment) {
    const { l } = this.context.i18n;
    if (equipment && equipment.language && equipment.language[0].description) {
      return (
        <dl>
          <dt>{l('Car Type')}</dt>
          <dd>{equipment.language[0].description}</dd>
        </dl>
      );
    }
  }

  getCarModel (equipment) {
    const { l } = this.context.i18n;
    if (equipment && equipment.language && equipment.language[0].name) {
      return (
        <dl>
          <dt>{l('Model')}</dt>
          <dd>{equipment.language[0].name}</dd>
        </dl>
      );
    }
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

  getReservation (reservation) {
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
          <dt>{l('Reservation #')}</dt>
          <dd>{reservation.items[0].confirmationNumber}</dd>
        </dl>
      );
    }
    return <dl />;
  }

  render () {
    const { l, getTimezoneTime } = this.context.i18n;
    const reservation = this.prepareState(this.props.carReservation);
    if (!reservation.items[0]) return null;

    const carInfo = reservation.items[0];
    const totalPrice = this.getTotalPrice(reservation);
    const carCode = carInfo.vendor && carInfo.vendor.code ? carInfo.vendor.code : '';
    const vendorName = this.getVendorName(carInfo.vendor);
    const carType = this.getCarType(carInfo.equipment);
    const carModel = this.getCarModel(carInfo.equipment);
    const dateFormat = !isManual(carInfo) ? 'MMM D' : 'MMM D, hh:mm A';
    const pickUpTime = getTimezoneTime(
      carInfo.startsAt.$date,
      dateFormat,
      carInfo.startStation.timeZoneName
    );
    const DropOffTime = getTimezoneTime(
      carInfo.endsAt.$date,
      dateFormat,
      carInfo.endStation ? carInfo.endStation.timeZoneName : carInfo.startStation.timeZoneName
    );
    const pickUpAddress = this.getAddress(carInfo.startStation);
    const dropOffAddress = this.getAddress(carInfo.endStation);
    const reservationInfo = this.getReservation(reservation);
    const names = reservation.items.map((item) => item.vendor.code + item.journeyName).join('');
    return (
      <div className='reservation-item car-reservation  item-l2'>
        <CollapseHolder
          saveBySession
          saveState={this.props.saveState ? 'car' + names : false}
          expanded={this.props.collapseExpanded}
          disabled={this.props.collapseDisabled}>
          <CollapseOpener>
            <table>
              <tbody>
                <tr>
                  <td width='22'><span className='car type-icon'>car</span></td>
                  <td width='200'><h4>{l('Car Reservation')}</h4></td>
                  <td>{reservationInfo}</td>
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
              <div className='row' style={{marginLeft: '0px'}} >
                <VendorImage code={carCode} vendorName={vendorName} type='car-rental' />
                <h3>{vendorName}</h3>
                {totalPrice}
              </div>
              <div className='info-holder row' style={{marginLeft: '0px'}}>
                <div className='flight-place-info'>
                  <dl>
                    <dt>{l('Pick-up time')}</dt>
                    <dd>{pickUpTime}</dd>
                  </dl>
                  <dl>
                    <dt>{l('Pick-up address')}</dt>
                    <dd>{pickUpAddress}</dd>
                  </dl>
                  {carType}
                  {carModel}
                </div>
                <div className='flight-place-info'>
                  <dl>
                    <dt>{l('Drop-off time')}</dt>
                    <dd>{DropOffTime}</dd>
                  </dl>
                  <dl>
                    <dt>{l('Drop-off address')}</dt>
                    <dd>{dropOffAddress || pickUpAddress}</dd>
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
export default CarRentalReservation;
