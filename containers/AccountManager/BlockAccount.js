import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { TYPE_AGENCY, isBlocked } from '../../helpers/organization';

import { actions as accountManagerActions, stateBlockLoading } from '../../redux/modules/organizationManager';

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
    ...bindActionCreators(accountManagerActions, dispatch)
  };
};

class BlockAccount extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    organization: PropTypes.object,
    blockOrganizationRequest: PropTypes.func.isRequired,
    unblockOrganizationRequest: PropTypes.func.isRequired,
    blockLoading: PropTypes.bool.isRequired
  };

  toggleAccountState = (organization) => (e) => {
    e.preventDefault();
    const { l } = this.context.i18n;
    const modalMessage = isBlocked(organization)
      ? (
          organization.type &&
      organization.type === TYPE_AGENCY
            ? l('Are you sure you want to unblock this agency?')
            : l('Are you sure you want to unblock this company?')
        )
      : (
          organization.type &&
      organization.type === TYPE_AGENCY
            ? l('Are you sure you want to block this agency?')
            : l('Are you sure you want to block this company?')
        );

    if (confirm(modalMessage)) {
      if (this.props.blockLoading) {

        // alert(l('Previous action still in process. please wait...'));
      } else {
        if (isBlocked(organization)) {
          this.props.unblockOrganizationRequest(organization);
        } else {
          this.props.blockOrganizationRequest(organization);
        }
      }
    }
  };

  render () {
    const { l } = this.context.i18n;
    const { organization, blockLoading } = this.props;
    let blockedClass = isBlocked(organization) ? 'unblock-account' : 'block-account';
    if (blockLoading) {
      blockedClass += ' disabled';
    }
    const text =
      isBlocked(organization)
        ? (
            organization.type && organization.type === TYPE_AGENCY ? l('Unblock Agency') : l('Unblock Company')
          )
        : (
            organization.type && organization.type === TYPE_AGENCY ? l('Block Agency') : l('Block Company')
          );
    return (
      <span>
        <a
          className={blockedClass}
          href='#'
          onClick={this.toggleAccountState(organization)}
        >{text}</a>
      </span>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockAccount);
