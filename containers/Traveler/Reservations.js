import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

// import LoadingIcon from '../../components/common/loadingIcon';
import Reservations from '../../components/traveler/reservations/reservations';

import {
  actions as reservationsActions,
  stateReservations,
  stateLoading,
  statePastView,
  stateTravelerId
} from '../../redux/modules/reservations';

const mapStateToProps = createSelector(
  stateReservations,
  stateLoading,
  statePastView,
  stateTravelerId,
  (reservations, loading, pastView, travelerId) => {
    const upcomingReservations = [];
    const pastReservations = [];
    Object.keys(reservations).forEach((reservationId) => {
      // sort past and upcoming reservations
      const reservation = { ...reservations[reservationId], reservationId };
      if (reservation.types) {
        reservation.typesCount = reservation.types.map((type) => {
          let count = 0;
          Object.keys(reservation.reservations).forEach((key) => {
            if (reservation.reservations[key].products[0].productType === type) {
              count += (
                reservation.reservations[key].products instanceof Array
                  ? reservation.reservations[key].products.length
                  : 0
              );
            }
          });
          return count;
        });
      }
      if (reservation.end.endsAt.$date < moment.utc().valueOf()) {
        pastReservations.push(reservation);
      } else {
        upcomingReservations.push(reservation);
      }
    });
    return {
      reservations,
      upcomingReservations,
      pastReservations,
      loading,
      travelerId,
      pastView
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(reservationsActions, dispatch)
  };
};

export class ReservationsContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.object,
    travelerId: PropTypes.string.isRequired,
    reservations: PropTypes.object.isRequired,
    upcomingReservations: PropTypes.array.isRequired,
    pastReservations: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    pastView: PropTypes.bool.isRequired,
    loadReservations: PropTypes.func.isRequired,
    reservationsChangeView: PropTypes.func.isRequired
  };

  UNSAFE_componentWillMount () {
    const { match: { params: { id } }, reservations } = this.props;
    if (id && isEmpty(reservations)) {
      this.props.loadReservations(id);
    }
  }

  render () {
    return <Reservations {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservationsContainer);
