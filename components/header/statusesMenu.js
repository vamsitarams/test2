import PropTypes from 'prop-types';
import React from 'react';
import DropdownMenu from 'react-dd-menu';
import 'react-dd-menu/dist/react-dd-menu.css';

export class StatusesDropdown extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    menuOptions: PropTypes.object.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    const { menuOptions } = this.props;

    return (
      <DropdownMenu {...menuOptions} className='header-dropdown'>
        <li className='green-link'><a href='#'>{l('Available')}</a></li>
        <li className='red-link'><a href='#'>{l('Unavailable')}</a></li>
        <li className='grey-link'><a href='#'>{l('Offline')}</a></li>
      </DropdownMenu>
    );
  }
}

export default StatusesDropdown;
