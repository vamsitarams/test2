import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default class TimeAgo extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    timestampUTC: PropTypes.number.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      timeAgo: this.getTime()
    };
    this.timer = null;
  }

  getTime () {
    if (this.props.timestampUTC && this.context) {
      return this.context.i18n.getTimeFromNow(moment.utc(this.props.timestampUTC));
    }
    return '';
  }

  initTimer () {
    if (this.props.timestampUTC) {
      if (this.timer) clearInterval(this.timer);
      if (this.state.timeAgo !== this.getTime()) {
        this.setState({
          timeAgo: this.getTime()
        });
      }
      this.timer = setInterval(() => {
        this.setState({
          timeAgo: this.getTime()
        });
      }, 15000);
    }
  }

  componentDidMount () {
    this.initTimer();
    this.setState({
      timeAgo: this.getTime()
    });
  }

  componentWillUnmount () {
    if (this.timer) clearInterval(this.timer);
  }

  componentDidUpdate () {
    this.initTimer();
  }

  render () {
    return (
      <span className='timeAgo'>
        {this.state.timeAgo}
      </span>
    );
  }
}
