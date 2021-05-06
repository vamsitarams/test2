import PropTypes from 'prop-types';
import React from 'react';
import uniq from 'lodash/uniq';
import FlightReservation from './flightReservation';
import CarRentalReservation from './carRentalReservation';
import LodgingReservation from './lodgingReservation';
import RailReservation from './railReservation';
import moment from 'moment';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../../components/common/collapse';



export class ReservationsList extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    travelerId: PropTypes.string.isRequired,
    reservations: PropTypes.array.isRequired
  };



  render () {
    const { getTimezoneTimeInterval } = this.context.i18n;
    const { reservations, travelerId } = this.props;
    console.log(reservations);
    const reservationsList = reservations.map((groupReservation) => {
      const tripName = groupReservation.tripName;
      const types = uniq(groupReservation.types).map((type, i) => {
        type = type.toLowerCase().replace(/\s+/, '-');
        const count = groupReservation.typesCount[i] > 1 ? 'x' + groupReservation.typesCount[i] : '';
        return (
          <div className='icon-hold' key={type}><span className={`${type} type-icon`}>{type}</span> <span
            className='count'>{count}</span></div>
        );
      });
      const resKeys = Object.keys(groupReservation.reservations);
      const reservationItems = resKeys.map((id) => {
        const reservation = {
          items: groupReservation.reservations[id].products,
          id: id,
          travelers: groupReservation.reservations[id].travelersInReservation,
          source: groupReservation.source,
          type: groupReservation.reservations[id].products[0].productType.toLowerCase().replace(/\s+/g, '-')
        };

        switch (reservation.type) {
          case 'flight' :
            return <FlightReservation key={id} flightReservation={reservation} travelerId={travelerId} />;
          case 'car-rental' :
          case 'vehicle' :
            return <CarRentalReservation key={id} carReservation={reservation} />;
          case 'rail' :
            return <RailReservation key={id} railReservation={reservation} />;
          case 'lodging' :
            return <LodgingReservation key={id} lodgingReservation={reservation} />;
          default:
            return null;
        }
      });

      const dates = getTimezoneTimeInterval(
        groupReservation.start.startsAt.$date,
        groupReservation.start.timeZoneName,
        groupReservation.end.endsAt.$date,
        groupReservation.end.timeZoneName
      );
      const startEventDate = moment.utc(groupReservation.start.startsAt.$date).subtract(3, 'day');
      const endEventDate = moment.utc(groupReservation.end.endsAt.$date);
      const expandedTrip = startEventDate < moment.utc() && moment.utc() < endEventDate;

      return (
        <div key={groupReservation.reservationId} className='reservationItem'>
          <CollapseHolder
            saveBySession
            saveState={reservations.reservationId}
            expanded={expandedTrip}>
            <CollapseOpener>
              <div className='item-l1'>
                <div className='holder'>
                  <h3>{tripName} - <span className='dates'>{dates}</span></h3>
                  <span className='dates'>{dates}</span>
                </div>
                <div className='tipes'>
                  {types}
                </div>
              </div>
            </CollapseOpener>
            <CollapseBlock>
              {reservationItems}
            </CollapseBlock>
          </CollapseHolder>
        </div>
      );
    });

    return (
      <div className='reservationsList'>
        {reservationsList}
      </div>
    );
  }
}
export default ReservationsList;
{/*<span className='arrow' />*/}
