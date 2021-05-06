/* eslint-disable react/no-find-dom-node */
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import { Transition, CSSTransition } from 'react-transition-group';
import JQuerySlide from '../../components/animations/jquery-slide';
import { localStorage, sessionStorage } from '../../helpers/localStorage';

let domEls = [];
$(window.document.body).on('click.collapse', (e) => {
  domEls.forEach((domEl) => {
    if (domEl && !$(e.target).closest(domEl).length && domEl.hide) {
      domEl.hide();
    }
  });
});

export class CollapseHolder extends React.Component {
  static propTypes = {
    saveState: PropTypes.any,
    saveBySession: PropTypes.bool,
    opener: PropTypes.string,
    expanded: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.string,
    closeByOutsideClick: PropTypes.string,
    collapseLoading: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element
    ]),
    onCollapseOpen: PropTypes.func,
    onCollapseOpened: PropTypes.func,
    onCollapseClose: PropTypes.func,
    onCollapseClosed: PropTypes.func
  };

  shouldComponentUpdate (nextProps, nextState) {
    return (
      !isEqual(this.props.saveState, nextProps.saveState) ||
      !isEqual(this.props.opener, nextProps.opener) ||
      !isEqual(this.props.expanded, nextProps.expanded) ||
      !isEqual(this.props.disabled, nextProps.disabled) ||
      !isEqual(this.props.style, nextProps.style) ||
      !isEqual(this.props.closeByOutsideClick, nextProps.closeByOutsideClick) ||
      !isEqual(this.props.collapseLoading, nextProps.collapseLoading) ||
      !isEqual(this.props.children, nextProps.children) ||
      !isEqual(this.state, nextState)
    );
  }

  constructor (props) {
    super(props);
    if (props.saveState) {
      if (props.saveBySession) {
        this.state = {
          expanded: !!sessionStorage.get(props.saveState)
        };
      } else {
        this.state = {
          expanded: !!localStorage.get(props.saveState)
        };
      }
    } else {
      this.state = {
        expanded: !!props.expanded
      };
    }
  }

  get isExpanded () {
    return this.state.expanded;
  }

  toggle = (e) => {
    const { onCollapseOpen, onCollapseClose } = this.props;
    if (!this.props.disabled && e.nativeEvent.button !== 1) {
      if (!this.state.expanded && onCollapseOpen) {
        onCollapseOpen(e);
      } else if (this.state.expanded && onCollapseClose) {
        onCollapseClose(e);
      } else {
        e.preventDefault();
      }

      if (
        this.props.opener &&
        ($(e.target).hasClass(this.props.opener) || $(e.target).closest('.' + this.props.opener).length)
      ) {
        this.toggleExpanded();
      } else if (!this.props.opener) {
        this.toggleExpanded();
      }
    }
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  close = () => {
    this.setState({
      expanded: false
    });
  }

  componentDidMount () {
    if (this.props.closeByOutsideClick && !this.props.disabled) {
      const domEl = ReactDOM.findDOMNode(this);
      domEl.rid = domEl.dataset.reactid;
      domEl.hide = () => {
        this.setState({
          expanded: false
        });
      };
      domEls.push(domEl);
    }
    if (this.state.expanded && this.props.onCollapseOpen) this.props.onCollapseOpen(true);
  }

  componentWillUnmount () {
    if (this.props.closeByOutsideClick) {
      const domEl = ReactDOM.findDOMNode(this);
      domEls = filter(domEls, (el) => el.rid !== domEl.rid);
    }
  }

  render () {
    if (this.props.saveState) {
      if (this.props.saveBySession) {
        sessionStorage.set(this.props.saveState, this.state.expanded);
      } else {
        localStorage.set(this.props.saveState, this.state.expanded);
      }
    }
    const children = React.Children.map(this.props.children, (child) => {
      if (child && React.isValidElement(child)) {
        return React.cloneElement(child, {
          expanded: this.state.expanded,
          onCollapseOpened: this.props.onCollapseOpened,
          onCollapseClosed: this.props.onCollapseClosed,
          loading: this.props.collapseLoading,
          style: this.props.style,
          toggle: this.toggle
        });
      }
      return child;
    });
    return (
      <div>
        {children}
      </div>
    );
  }
}

export class CollapseOpener extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    loading: PropTypes.bool,
    toggle: PropTypes.func,
    children: PropTypes.any
  };

  render () {
    const expanded = this.props.expanded ? 'expanded' : '';
    const classname = 'collapseOpener ' + expanded;
    return (
      <div className={classname} onClick={this.props.toggle}>
        {this.props.children}
      </div>
    );
  }
}

export class CollapseBlock extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    loading: PropTypes.bool,
    style: PropTypes.string,
    toggle: PropTypes.func,
    onCollapseOpened: PropTypes.func,
    onCollapseClosed: PropTypes.func,
    children: PropTypes.any
  };

  shouldComponentUpdate (nextProps, nextState) {
    return (
      !isEqual(this.props.style, nextProps.style) ||
      !isEqual(this.props.loading, nextProps.loading) ||
      !isEqual(this.props.expanded, nextProps.expanded) ||
      !isEqual(this.props.children, nextProps.children) ||
      !isEqual(this.state, nextState)
    );
  }

  constructor (props) {
    super(props);
    this.state = {
      style: this.props.style || 'slide'
    };
  }

  get block () {
    let block = null;
    if (this.props.expanded && !this.props.loading) {
      if (this.state.style === 'slide') {
        block = (
          <JQuerySlide slideUpCallback={this.props.onCollapseClosed} slideDownCallback={this.props.onCollapseOpened}>
            {this.props.children}
          </JQuerySlide>
        );
      } else if (this.state.style === 'fade') {
        block = (<div>{this.props.children}</div>);
      }
    }
    return block;
  }

  render () {
    let animationHolder = null;
    if (this.state.style === 'slide') {
      animationHolder = (
        <Transition
         timeout={500}>
          {state => (
            this.block
          )}
        </Transition>
      );
    } else if (this.state.style === 'fade') {
      animationHolder = (
        <CSSTransition
          timeout={500}>
          {state => (
            this.block
          )}
        </CSSTransition>
      );
    }
    return animationHolder;
  }
}
