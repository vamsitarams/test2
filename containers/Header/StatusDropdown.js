import React from 'react';

import StatusesMenu from '../../components/header/statusesMenu';

export class StatusDropdown extends React.Component {
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
    const btnClass = 'header-status_btn';

    const toggle = (
      <span className={this.state.isShown ? `${btnClass} active` : btnClass}
        onClick={this.toggle}>Available</span>
    );

    const menuOptions = {
      isOpen: this.state.isShown,
      close: this.close,
      toggle,
      align: 'center'
    };

    return (
      <div className='status-cntr'>
        <StatusesMenu menuOptions={menuOptions} />
      </div>
    );
  }
}

export default StatusDropdown;
