import PropTypes from 'prop-types';
import React from 'react';
import { createSelector } from 'reselect';
import $ from 'jquery';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions as userActions, stateUser } from '../../redux/modules/user';
import { messageReceive } from '../../helpers/tabCommunication';

const mapStateToProps = createSelector(
  stateUser,
  (user) => ({
    user
  })
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userActions, dispatch)
  };
};

export class TabsCommunication extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    logOutUser: PropTypes.func.isRequired
  };

  componentDidMount () {
    $(window).on('storage', (e) => {
      messageReceive(e, (message) => {
        switch (message.type) {
          case 'logout' :
            if (this.props.user.isAuthenticated) {
              this.props.logOutUser();
            }
            break;
          case 'login' :
            if (!this.props.user.isAuthenticated) {
              window.location.reload();
            }
            break;
        }
      });
    });
  }

  render = () => null
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsCommunication);
