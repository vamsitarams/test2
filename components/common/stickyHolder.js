/* eslint-disable react/no-find-dom-node */
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import $ from 'jquery';

$.fn.hasScrollBar = function () {
  return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
};

export default class StickyHolder extends React.Component {
  static propTypes = {
    holderRef: PropTypes.any,
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element
    ])
  };

  constructor (props) {
    super(props);
    this._placeHolderRef = React.createRef();
    this._stickyRef = React.createRef();
  }

  findScrollHolder () {
    this.setParams();
    if (this.props.holderRef && document.getElementById(this.props.holderRef)) {
      this._scrollHolder = $(document.getElementById(this.props.holderRef));
      $(this._scrollHolder).off('scroll.sticky').on('scroll.sticky', () => {
        this.setParams();
      });
      return false;
    } else {
      this._domEl.parents().each((i, el) => {
        if ($(el).hasScrollBar()) {
          this._scrollHolder = $(el);
          $(this._scrollHolder).off('scroll.sticky').on('scroll.sticky', () => {
            this.setParams();
          });
          return false;
        }
      });
    }
  }

  setParams () {
    if (this._scrollHolder && this._domEl) {
      const scrollTopPos = this._scrollHolder.offset().top;
      const scrollWidth = this._scrollHolder.width();
      const stickyTop = this._domEl.offset().top;
      const stickyHeight = this._domEl.height();

      if (stickyTop < scrollTopPos) {
        this._domEl.addClass('sticky-is-fixed');
        this._placeholder.css({
          height: stickyHeight
        });
        this._sticky.css({
          position: 'fixed',
          top: scrollTopPos,
          width: scrollWidth
        });
      } else {
        this._domEl.removeClass('sticky-is-fixed');
        this._placeholder.removeAttr('style');
        this._sticky.removeAttr('style');
      }
    }
  }

  componentDidMount () {
    this._domEl = $(ReactDOM.findDOMNode(this));
    this._placeholder = $(this._placeHolderRef.current);
    this._sticky = $(this._stickyRef.current);
    this.findScrollHolder();
    this._resizeDebounce = debounce(() => {
      this.findScrollHolder();
    }, 250);
    $(window).on('resize.sticky', this._resizeDebounce);
  }

  componentWillUnmount () {
    $(window).off('resize.sticky', this._resizeDebounce);
    $(this._scrollHolder).off('scroll.sticky');
  }

  componentDidUpdate () {
    this.refreshPosition();
  }

  refreshPosition () {
    if (this._resizeDebounce) this._resizeDebounce();
  }

  render () {
    return (
      <div className={'stickyHolder'}>
        <div ref={this._stickyRef}>
          {this.props.children}
        </div>
        <div ref={this._placeHolderRef} />
      </div>
    );
  }
}
