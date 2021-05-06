import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingIcon from '../../components/common/loadingIcon';
import { createSelector } from 'reselect';
import { STATUS_ACTIVE } from '../../helpers/traveler';

import { actions as travelerManagerActions, stateBlockLoading } from '../../redux/modules/travelerManager';

const mapStateToProps = createSelector(
  stateBlockLoading,
  (blockLoading) => {
    return {
      blockLoading
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerManagerActions, dispatch)
  };
};

class BlockTraveler extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    travelerId: PropTypes.string.isRequired,
    travelerStatus: PropTypes.string.isRequired,
    blockTravelerRequest: PropTypes.func.isRequired,
    unblockTravelerRequest: PropTypes.func.isRequired,
    blockLoading: PropTypes.bool.isRequired
  };

  toggleTravelerState = (id) => (e) => {
    e.preventDefault();
    const { l } = this.context.i18n;
    const { travelerStatus } = this.props;
    const modalMessage = travelerStatus === STATUS_ACTIVE
      ? l('Are you sure you want to block this traveler?')
      : l('Are you sure you want to unblock this traveler?');

    if (confirm(modalMessage)) {
      if (this.props.travelerStatus === 'active') {
        this.props.blockTravelerRequest(id);
      } else {
        this.props.unblockTravelerRequest(id);
      }
    }
  }

  render () {
    const { l } = this.context.i18n;
    const { travelerId, travelerStatus } = this.props;
    const blockedClass = travelerStatus === 'active' ? 'block-user' : 'unblock-user';
    const text = travelerStatus === STATUS_ACTIVE ? l('Block User') : l('Unblock User');
    return (
      <span>
        <a className={blockedClass} href='#' onClick={this.toggleTravelerState(travelerId)}>{text}</a>
        <LoadingIcon loading={this.props.blockLoading} />
      </span>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockTraveler);
