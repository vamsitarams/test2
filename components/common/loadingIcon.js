import PropTypes from 'prop-types';
import React from 'react';
import Nanobar from 'nanobar';

export default class LoadingIcon extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    overlay: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this._loadingHolderRef = React.createRef();
  }

  setProgress (start) {
    if (this._timer) clearInterval(this._timer);
    if (start) {
      this._started = 30;
      this._nanobar.go(this._started);
      this._timer = setInterval(() => {
        if (this._started) {
          if (this._started < 60) {
            this._started += 8;
          } else if (this._started < 80) {
            this._started += 4;
          } else if (this._started < 95) {
            this._started += 1;
          }
          this._nanobar.go(this._started);
        }
      }, 250);
    } else if (this._started) {
      this._started = false;
      this._nanobar.go(100);
    }
  }

  componentDidMount () {
    this._nanobar = new Nanobar({
      target: this._loadingHolderRef.current
    });
    this._started = false;
    this.setProgress(!!this.props.loading);
  }

  componentDidUpdate () {
    this.setProgress(!!this.props.loading);
  }

  componentWillUnmount () {
    this.setProgress();
  }

  render () {
    return <div ref={this._loadingHolderRef} className='loading-holder' />;
  };
}
