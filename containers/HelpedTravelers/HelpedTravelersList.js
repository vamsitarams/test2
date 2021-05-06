import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { bindActionCreators } from 'redux';

import HelpedTravelersList from '../../components/helpedTravelers/helpedTravelersList';
import { stateSideMenuOpened } from '../../redux/modules/appSettings';

import {
  actions as helpedTravelersActions,
  stateHelpedTravelers
} from '../../redux/modules/helpedTravelers';

const mapStateToProps = createSelector(
  stateHelpedTravelers,
  stateSideMenuOpened,
  (stateHelpedTravelers, sideMenuOpened) => {
    const sortedTravelers = sortBy(stateHelpedTravelers.travelers, (traveler) => {
      const updatedDateTime = traveler.helpedBy.updatedDateTime;
      return updatedDateTime && updatedDateTime.$date ? -updatedDateTime.$date : 0;
    });
    return {
      travelers: sortedTravelers,
      loading: stateHelpedTravelers.loading,
      sideMenuOpened
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(helpedTravelersActions, dispatch)
  };
};

export class HelpedTravelersListContainer extends React.Component {
  static propTypes = {
    travelers: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    requestHelpedTravelers: PropTypes.func.isRequired,
    sideMenuOpened: PropTypes.bool.isRequired
  };

  UNSAFE_componentWillMount () {
    if (!this.props.travelers.length) {
      this.props.requestHelpedTravelers();
    }
  }

  render () {
    return (
      <HelpedTravelersList {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpedTravelersListContainer);

