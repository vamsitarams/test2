import PropTypes from 'prop-types';
import React from 'react';
import $ from 'jquery';
import HelpedTravelersList from '../../containers/HelpedTravelers/HelpedTravelersList';
import MainMenu from '../../containers/Common/MainMenu';

export default class Aside extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    sideMenuOpened: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this._asideRef = React.createRef();
  }

  toggleMenu = () => {
    this.props.toggleSidebar();
  }

  componentDidMount () {
    const $parent = $(this._asideRef.current).closest('.page > div');
    $(this._asideRef.current).on('mouseover.aside', () => {
      if (!this.props.sideMenuOpened) {
        $parent
          .removeClass('side-menu-closed')
          .addClass('side-menu-opened')
          .parent()
          .addClass('opened-by-hover');
      }
    }).on('mouseleave.aside', () => {
      if (!this.props.sideMenuOpened) {
        $parent
          .removeClass('side-menu-opened')
          .addClass('side-menu-closed');
      }
      $parent
        .parent()
        .removeClass('opened-by-hover');
    }).on('click.aside', () => {
      if (this.props.sideMenuOpened) {
        $parent
          .parent()
          .removeClass('opened-by-hover');
      }
    });
  }

  componentWillUnmount () {
    $(this._asideRef.current).off('mouseover.aside mouseleave.aside click.aside');
  }

  render () {
    const { l } = this.context.i18n;

    const pinText = this.props.sideMenuOpened ? l('Unpin side menu') : l('Pin side menu');

    return (
      <aside ref={this._asideRef} className='side-menu'>
        <div className='side-menu-content'>
          <MainMenu />
          <HelpedTravelersList />
          <span className='glyphicon glyphicon-pushpin menu-opened' onClick={this.toggleMenu}>
            <em>{pinText}</em>
          </span>
        </div>
      </aside>
    );
  }
}
