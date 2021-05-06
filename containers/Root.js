import PropTypes from 'prop-types';
import React from 'react';
import Loading from './Common/Loading';
import Notification from './Common/Notification';

export default class Root extends React.Component {
  static propTypes = {
    routes: PropTypes.element.isRequired,
    loading: PropTypes.bool
  };

  get content () {
    return (
      <div>
        <div>
          {this.props.routes}
        </div>
        <Loading />
        <Notification />
      </div>
    );
  }

  render () {
    return (
      <div>
        {this.content}
      </div>
    );
  }
}
