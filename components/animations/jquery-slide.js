/* eslint-disable react/no-find-dom-node */
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default class JQuerySlide extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    slideUpCallback: PropTypes.func,
    slideDownCallback: PropTypes.func
  };

  componentWillEnter (callback) {
    const $el = $(ReactDOM.findDOMNode(this));
    $el.hide().slideDown(() => {
      if (this.props.slideDownCallback) this.props.slideDownCallback();
      return callback();
    });
  }

  componentWillLeave (callback) {
    const $el = $(ReactDOM.findDOMNode(this));
    $el.slideUp(() => {
      if (this.props.slideUpCallback) this.props.slideUpCallback();
      return callback();
    });
  }

  render () {
    return <div>{this.props.children}</div>;
  }
}
