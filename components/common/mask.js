import PropTypes from 'prop-types';
import React from 'react';
import $ from 'jquery';
import '../../sdk/jquery.mask.min';

export default class Mask extends React.Component {
  static propTypes = {
    mask: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
  }

  constructor () {
    super(...arguments);
    this._maskRef = React.createRef();
    this.state = {
      phone: ''
    };
  }

  setTitle () {
    this.setState({ phone: $(this._maskRef.current).text() });
  }

  componentDidMount () {
    $(this._maskRef.current).mask(this.props.mask);
    this.setTitle();
  }

  componentDidUpdate () {
    $(this._maskRef.current).unmask().mask(this.props.mask);
    this.setTitle();
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.children !== nextProps.children || this.state.phone !== nextState.phone;
  }

  render () {
    return (
      <span ref={this._maskRef} title={this.state.phone}>
        {this.props.children}
      </span>
    );
  }
}
