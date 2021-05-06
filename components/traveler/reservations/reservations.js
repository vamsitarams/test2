import PropTypes from 'prop-types';
import React from 'react';
import ReservationsList from './reservationsList';
import LoadingIcon from '../../../components/common/loadingIcon';

export class Reservations extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.object,
    travelerId: PropTypes.string.isRequired,
    upcomingReservations: PropTypes.array.isRequired,
    pastReservations: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    pastView: PropTypes.bool.isRequired,
    reservationsChangeView: PropTypes.func.isRequired
  };

  switchView = (e) => {
    e.preventDefault();
    this.props.reservationsChangeView();
  }

  render () {
    const { l } = this.context.i18n;
    const {
      pastView, upcomingReservations, pastReservations, match: { params: { id } },
      loading, travelerId
    } = this.props;
    const switchViewText = pastView ? l('View Upcoming Reservations') : l('View Past Reservations');

    let reservations = <div className='load-events'><span>{l('No reservations found')}</span></div>;
    if (upcomingReservations && upcomingReservations.length) {
      reservations = <ReservationsList reservations={upcomingReservations} travelerId={id} />;
    }
    if (pastView && pastReservations && pastReservations.length) {
      reservations = <ReservationsList reservations={pastReservations} travelerId={id} />;
    }

    let switchLink;
    if (pastReservations && pastReservations.length) {
      switchLink = (
        <div className='load-events'>
          {pastReservations ? <a href='/' onClick={this.switchView}>{switchViewText}</a> : null}
        </div>
      );
    }

    return (
      <div className='reservations'>
        <LoadingIcon loading={loading} />
        {travelerId === id && switchLink}
        {travelerId === id && reservations}
      </div>
    );
  }
}
export default Reservations;
