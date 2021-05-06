import React from 'react';

import ActiveTravelersFilterComponent from '../../components/activeTravelers/activeTravelersFilter';

export class ActiveTravelersFilter extends React.Component {
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
    const btnClass = 'travelers-filter__btn';
    const toggle = (
      <button className={this.state.isShown ? `${btnClass} active` : btnClass}
        onClick={this.toggle}>Filter</button>
    );
    const filterOptions = {
      isOpen: this.state.isShown,
      close: this.close,
      toggle,
      align: 'center',
      closeOnInsideClick: false
    };

    return (
      <ActiveTravelersFilterComponent menuOptions={filterOptions} {...this.props} />
    );
  }
}

export default ActiveTravelersFilter;
