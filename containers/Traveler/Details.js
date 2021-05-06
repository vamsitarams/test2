import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import {
  actions as travelerActions,
  stateTraveler, stateOnlineStatus
} from '../../redux/modules/travelerDetails';

import TravelerDetails from '../../components/traveler/travelerDetails';
import { stateUserRole } from '../../redux/modules/user';
const mapStateToProps = createSelector(
  stateTraveler, stateOnlineStatus, stateUserRole,
  (traveler, onlineStatus, userRole) => {
    return {
      traveler,
      onlineStatus,
      userRole
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerActions, dispatch)
  };
};

export class DetailsContainer extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    traveler: PropTypes.object.isRequired,
    onlineStatus: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired
  };

  render () {
    if (!this.props.traveler._id) return null;
    return (
      <TravelerDetails {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsContainer);
