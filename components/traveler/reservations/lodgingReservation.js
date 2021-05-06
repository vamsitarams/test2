import PropTypes from 'prop-types';
import React from 'react';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../../components/common/collapse';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';
import { getAddressString, isManual } from '../../../helpers/timeline';

export class LodgingReservation extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    lodgingReservation: PropTypes.object.isRequired,
    collapseExpanded: PropTypes.bool,
    saveState: PropTypes.bool,
    collapseDisabled: PropTypes.bool
  };

  prepareState (lodgingReservation) {
    const reservation = { ...lodgingReservation };
    reservation.totalPrice = reduce(reservation.items, (sum, item) => sum + (item.price || 0), 0);
    const contacts = [];
    reservation.items.forEach((lodging) => {
      if (lodging.startStation &&
        lodging.startStation.language &&
        lodging.startStation.language[0] &&
        lodging.startStation.language[0].contacts &&
        lodging.startStation.language[0].contacts[0]) {
        const contact = lodging.startStation.language[0].contacts[0];
        contacts.push({ ...lodging.startStation, code: contact.name });
      }
    });
    if (contacts.length) {
      reservation.contacts = uniqBy(contacts, (contact) => contact.code);
    }

    return reservation;
  }

  getAddress (hotel) {
    if (
      hotel.startStation.language &&
      hotel.startStation.language[0].locations &&
      hotel.startStation.language[0].locations[0]
    ) {
      return getAddressString(hotel.startStation.language[0].locations[0]);
    }
    return '';
  }

  getHotelName (hotel) {
    if (
      hotel.startStation.language &&
      hotel.startStation.language[0].name
    ) {
      return hotel.startStation.language[0].name;
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

  getConfirmation (reservation) {
    const { l } = this.context.i18n;
    if (
      reservation.confirmationNumber &&
      reservation.confirmationNumber.indexOf('PROD_ID_') === -1 &&
      reservation.confirmationNumber.indexOf('CONF_NUM_') === -1
    ) {
      return (
        <dl>
          <dt>{l('Confirmation #')}</dt>
          <dd>{reservation.confirmationNumber}</dd>
        </dl>
      );
    }
    return <dl />;
  }

  render () {
    const { l, getTimezoneTime } = this.context.i18n;
    const reservation = this.prepareState(this.props.lodgingReservation);
    if (!reservation.items[0]) return null;

    const lodgingInfo = reservation.items[0];
    const totalPrice = this.getTotalPrice(reservation);
    const hotelName = this.getHotelName(lodgingInfo);
    const hotelCode = lodgingInfo.vendor && lodgingInfo.vendor.code ? lodgingInfo.vendor.code : '';
    const dateFormat = !isManual(lodgingInfo) ? 'MMM D' : 'MMM D, hh:mm A';
    const checkInTime = getTimezoneTime(
      lodgingInfo.startsAt.$date,
      dateFormat,
      lodgingInfo.startStation.timeZoneName
    );
    const CheckOutTime = getTimezoneTime(
      lodgingInfo.endsAt.$date,
      dateFormat,
      lodgingInfo.startStation.timeZoneName
    );
    const hotelAddress = this.getAddress(lodgingInfo);
    const confirmation = this.getConfirmation(lodgingInfo);
    // get uniq ID for reservation
    const names = reservation.items.map((item) => {
      const sst = item.startStation;
      return item.journeyName + (sst.language ? sst.language[0].name : item.source);
    }).join('');
    return (
      <div className='reservation-item lodging-reservation item-l2'>
        <CollapseHolder
          saveBySession
          saveState={this.props.saveState ? 'hotel' + names : false}
          expanded={this.props.collapseExpanded}
          disabled={this.props.collapseDisabled}>
          <CollapseOpener>
            <table>
              <tbody>
                <tr>
                  <td width='22'><span className='lodging type-icon'>lodging</span></td>
                  <td width='200'><h4>{l('Hotel Reservation')}</h4></td>
                  <td>{confirmation}</td>
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
                <VendorImage code={hotelCode} vendorName={hotelName} type='lodging' />
                <h3>{hotelName}</h3>
                {totalPrice}
              </div>
              <div className='info-holder row' style={{marginLeft: '0px'}}>
                <div className='flight-place-info'>
                  <dl>
                    <dt>{l('Check-in')}</dt>
                    <dd>{checkInTime}</dd>
                  </dl>
                  <dl>
                    <dt>{l('Address')}</dt>
                    <dd>{hotelAddress}</dd>
                  </dl>
                </div>
                <div className='flight-place-info'>
                  <dl>
                    <dt>{l('Check-out')}</dt>
                    <dd>{CheckOutTime}</dd>
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
export default LodgingReservation;
