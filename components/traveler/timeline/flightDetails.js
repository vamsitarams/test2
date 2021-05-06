import PropTypes from 'prop-types';
import React from 'react';
import { FlightPlaceInfo } from './flightPlaceInfo';
import VendorContacts from '../vendorContacts';
import VendorImage from '../vendorImage';

import uniqBy from 'lodash/uniqBy';

export class FlightDetails extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    flightInfo: PropTypes.object.isRequired,
    reservation: PropTypes.object.isRequired,
    reservationId: PropTypes.string.isRequired,
    showReservationModal: PropTypes.func.isRequired
  };

  get airlineHeadInfo () {
    const { l } = this.context.i18n;
    const { marketingAirline, operatingAirline } = this.props.flightInfo;
    const marketingAirlineName = this.getCompanyName(marketingAirline);
    const operatingAirlineName = this.getCompanyName(operatingAirline);

    let airlineHeadSubtitle;
    if (marketingAirlineName && operatingAirlineName && marketingAirlineName !== operatingAirlineName) {
      airlineHeadSubtitle = (<span>{l('Operated by')} {operatingAirlineName}</span>);
    }

    if (marketingAirlineName) {
      return (
        <div className='name-area'>
          <div className='airline-hold'>
            <h3>{marketingAirlineName}</h3>
            <VendorImage code={marketingAirline.code} vendorName={marketingAirlineName} type='flight' />
          </div>
          {airlineHeadSubtitle}
        </div>
      );
    }
  }

  get recLoc () {
    const { l } = this.context.i18n;
    const { recLoc, confirmationNumber } = this.props.flightInfo;
    const airlineRECLOC = confirmationNumber ? (
      <dl className='inline'><dt>{l('Airline RECLOC #')}</dt><dd>{confirmationNumber}</dd></dl>) : null;
    const agencyRECLOC = recLoc ? (
      <dl className='inline'><dt>{l('Agency RECLOC #')}</dt><dd>{recLoc}</dd></dl>) : null;
    return (<div className='dl-hold'>
      {airlineRECLOC}
      {agencyRECLOC}
    </div>);
  }

  get contacts () {
    const { marketingAirline, operatingAirline } = this.props.flightInfo;
    let contacts = [marketingAirline, operatingAirline];
    contacts = uniqBy(contacts, (contact) => contact.code);
    return (
      <VendorContacts contacts={contacts} />
    );
  }

  getCompanyName (companyData) {
    if (companyData &&
      companyData.language &&
      companyData.language[0] &&
      companyData.language[0].name) {
      return companyData.language[0].name;
    }
  }

  showModal = (reservationId, reservation, travelerId) => (e) => {
    e.preventDefault();
    this.props.showReservationModal(reservationId, reservation, travelerId);
  }

  render () {
    const { l } = this.context.i18n;
    const {
      flightInfo, flightInfo: { startStation, endStation, seatAssignment },
      reservation, reservationId
    } = this.props;
    const startDate = flightInfo.startsAt.$date;
    const endDate = flightInfo.endsAt.$date;
    const latestEvent = flightInfo.latestEvent;

    let reservationLink;
    if (reservation.products && reservation.products.length) {
      const travelerId = flightInfo.subscriberId.$oid;
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
            {this.airlineHeadInfo}
            {this.recLoc}
          </div>
        </div>
        <div className='info-holder row'>
          <FlightPlaceInfo
            type='departure'
            station={startStation}
            date={startDate}
            seats={seatAssignment}
            latestEvent={latestEvent}
          />
          <FlightPlaceInfo
            type='arrival'
            station={endStation}
            date={endDate}
            latestEvent={latestEvent}
          />
        </div>
        {this.contacts}
      </section>
    );
  }
}
export default FlightDetails;
