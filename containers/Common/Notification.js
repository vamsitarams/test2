import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import NotificationSystem from 'react-notification-system';
import {
  actions as notificationActions,
  stateNotification
} from '../../redux/modules/notification';

const mapStateToProps = createSelector(
  stateNotification,
  (stateNotification) => {
    return {
      stateNotification
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(notificationActions, dispatch)
  };
};

export class NotificationSystemContainer extends React.Component {
  static propTypes = {
    stateNotification: PropTypes.object.isRequired,
    showNotification: PropTypes.func.isRequired,
    hideNotification: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._notificationRef = React.createRef();
  }

  componentDidMount () {
    this._notification = this._notificationRef.current;
    window.nnn = this._notification;
  }

  componentDidUpdate () {
    const notify = this.props.stateNotification;
    if (notify.title || notify.message) {
      notify.dismissible = false;
      this._notification.addNotification(notify);
    }
  }

  render () {
    return (
      <NotificationSystem ref={this._notificationRef} style={false} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSystemContainer);
