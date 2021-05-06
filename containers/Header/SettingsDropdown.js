import React from 'react';

import SettingsMenu from '../../components/header/settingsMenu';

export class SettingsDropdown extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isShown: false
    };
  }

  toggle = () => {
    this.setState({ isShown: !this.state.isShown });
  };

  close = () => {
    this.setState({ isShown: false });
  };

  render () {
    const btnClass = 'header-settings_btn';
    const menuOptions = {
      isOpen: this.state.isShown,
      close: this.close,
      toggle: <i className={this.state.isShown ? `${btnClass} active` : btnClass} onClick={this.toggle} />,
      align: 'center'
    };

    return (
      <SettingsMenu menuOptions={menuOptions} />
    );
  }
}

export default SettingsDropdown;
