import PropTypes from 'prop-types';
import React from 'react';

export default class Provider extends React.Component {
  static childContextTypes = { i18n: PropTypes.object };

  static propTypes = {
    i18n: PropTypes.any.isRequired,
    children: PropTypes.any.isRequired
  };

  getChildContext () {
    return { i18n: this.props.i18n };
  }

  render () {
    return React.Children.only(this.props.children);
  }
}
