import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import isEqual from 'lodash/isEqual';
import { isAdmin, isGlobalAdmin } from '../../helpers/user';
import LoadingIcon from '../../components/common/loadingIcon';

import { actions as pusherActions } from '../../redux/modules/pusher';
import { stateUser } from '../../redux/modules/user';

const mapStateToProps = createSelector(
  stateUser,
  (user) => {
    return {
      user
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(pusherActions, dispatch)
  };
};

class HelpedBlockContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    extend: PropTypes.string,
    helpedBy: PropTypes.object.isRequired,
    travelerId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    helpTraveler: PropTypes.func.isRequired,
    addTravelerAction: PropTypes.func,
    closeTraveler: PropTypes.func.isRequired,
    releaseTraveler: PropTypes.func.isRequired
  };

  helpTraveler = () => {
    this.props.helpTraveler(this.props.travelerId);
  }

  releaseTraveler = () => {
    this.props.releaseTraveler(this.props.travelerId, this.props.helpedBy);
  }

  closeTraveler = () => {
    this.props.closeTraveler(this.props.travelerId, this.props.helpedBy);
  }

  addTravelerAction = () => {
    this.props.addTravelerAction();
  }

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.extend, nextProps.extend) ||
      !isEqual(this.props.helpedBy, nextProps.helpedBy) ||
      !isEqual(this.props.travelerId, nextProps.travelerId) ||
      !isEqual(this.props.user, nextProps.user)
    );
  }

  render () {
    const { l } = this.context.i18n;
    const { travelerId, extend, user, helpedBy } = this.props;
    const userId = user._id;
    const userRoleName = user.roleName;
    if (!travelerId) return null;
    let helpedMsg, helpBtn, releaseBtn, caseActions, closeCaseBtn;
    // conditions
    const openCase = helpedBy && helpedBy._id && helpedBy.status === 'opened';
    const openCaseBySomeTA = helpedBy && helpedBy._id && helpedBy._id.$oid !== userId;
    const caseClosed = helpedBy && helpedBy._id && helpedBy.status === 'closed';

    if (openCase && helpedBy) {
      if (openCaseBySomeTA) {
        // case open and helped by somebody
        helpedMsg = (
          <span className='helpedMsg'>
            {l('Helped by')}<br /> {helpedBy.firstName} {helpedBy.lastName}
          </span>
        );
      } else if (isGlobalAdmin(userRoleName)) {
        // case open and helped by me but not CU
        caseActions = (
          <button className='btn btn01' onClick={this.addTravelerAction}>
            {l('Add Case Action')}<span className='arrow' />
          </button>
        );
      }
      if (isGlobalAdmin(userRoleName)) {
        releaseBtn = (<button className='btn btn03' onClick={this.releaseTraveler}>{l('Release')}</button>);
        closeCaseBtn = (<button className='btn btn03' onClick={this.closeTraveler}>{l('Close Case')}</button>);
      }
    } else {
      if (caseClosed) {
        helpedMsg = (
          <span className='helpedMsg'>
            {l('Case Closed')}
          </span>
        );
      }
      if (isGlobalAdmin(userRoleName)) {
        helpBtn = (<button className='btn btn02 help' onClick={this.helpTraveler}>{l('Help')}</button>);
      }
    }

    const loading = helpedBy && helpedBy.loading ? helpedBy.loading : false;

    let helpedBlock;
    const closeClass = caseClosed ? 'case-close-block' : '';
    // extend version is used for traveler details page
    if (extend) {
      if (isAdmin(userRoleName)) {
        helpedBlock = (
          <div className={`${closeClass} helped-block`}>
            {<LoadingIcon loading={loading} />}
            {helpedMsg}
            {releaseBtn}
            {closeCaseBtn}
          </div>
        );
      } else {
        helpedBlock = (
          <div className={`${closeClass} helped-block`}>
            {<LoadingIcon loading={loading} />}
            {helpedMsg}
            {helpBtn}
            {caseActions}
            {releaseBtn}
            {closeCaseBtn}
          </div>
        );
      }
    } else {
      // helped block for all cases
      if (isAdmin(userRoleName)) {
        helpedBlock = (
          <div className={`${closeClass} helped-block`}>
            {<LoadingIcon loading={loading} />}
            {helpedMsg}
            {releaseBtn}
          </div>
        );
      } else {
        helpedBlock = (
          <div className={`${closeClass} helped-block`}>
            {<LoadingIcon loading={loading} />}
            {helpBtn}
            {helpedMsg}
            {releaseBtn}
          </div>
        );
      }
    }

    return helpedBlock;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpedBlockContainer);
