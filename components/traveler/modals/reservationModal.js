import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../../containers/Common/Modal';
import FlightReservation from '../reservations/flightReservation';
import CarRentalReservation from '../reservations/carRentalReservation';
import LodgingReservation from '../reservations/lodgingReservation';
import RailReservation from '../reservations/railReservation';

export default class ReservationModal extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor (props) {
    super(props);
    this._modalRef = React.createRef();
    this.state = {
      isOpen: false,
      reservationId: '',
      reservation: {},
      travelerId: ''
    };
  }

  showReservationModal = (reservationId, reservation, travelerId) => {
    this._modalRef.current.openModal();
    this.setState({
      reservationId: reservationId,
      reservation: reservation,
      travelerId: travelerId
    });
  }

  render () {
    let reservationView;
    const { reservationId, reservation, travelerId } = this.state;
    if (reservation.products && reservation.products.length) {
      const reservationType = reservation.products[0].productType.toLowerCase().replace(/\s+/, '-');
      const source = reservation.products[0].source || '';
      const reservationObj = {
        items: reservation.products,
        id: reservationId,
        source: source,
        travelers: reservation.travelersInReservation,
        type: reservationType
      };

      switch (reservationType) {
        case 'flight' :
          reservationView = (<FlightReservation flightReservation={reservationObj}
            travelerId={travelerId} collapseExpanded collapseDisabled saveState={false} />
          );
          break;
        case 'car-rental' :
        case 'vehicle' :
          reservationView = (<CarRentalReservation carReservation={reservationObj}
            collapseExpanded collapseDisabled saveState={false} />);
          break;
        case 'rail' :
          reservationView = (<RailReservation railReservation={reservationObj}
            collapseExpanded collapseDisabled saveState={false} />);
          break;
        case 'lodging' :
          reservationView = (<LodgingReservation lodgingReservation={reservationObj}
            collapseExpanded collapseDisabled saveState={false} />);
          break;
      }
    }

    return (
      <Modal isOpen={this.state.isOpen} ref={this._modalRef}>
        <div className='modal-reservation'>
          {reservationView}
        </div>
      </Modal>
    );
  }
}
