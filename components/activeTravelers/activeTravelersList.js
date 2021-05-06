import PropTypes from 'prop-types';
import React from 'react';
import ActiveTravelersListItem from './activeTravelersListItem';
import isEqual from 'lodash/isEqual';
import ReactList from 'react-list';

export class ActiveTravelersList extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    activeTravelers: PropTypes.array.isRequired,
    filteredActiveTravelers: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    onItemsOpened: PropTypes.func,
    onItemsClosed: PropTypes.func,
    helpTraveler: PropTypes.func.isRequired,
    releaseTraveler: PropTypes.func.isRequired,
    loadLatestProducts: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.activeTravelers, nextProps.activeTravelers) ||
      !isEqual(this.props.filteredActiveTravelers, nextProps.filteredActiveTravelers) ||
      !isEqual(this.props.user, nextProps.user)
    );
  }

  renderItem = (index, key) => {
    const activeTraveler = this.props.activeTravelers[index];
    // console.log(activeTraveler, 'ready');

    if (activeTraveler.status === 'blocked') return;

    return (
      <ActiveTravelersListItem
        key={key}
        activeTraveler={activeTraveler}
        userRole={this.props.user.roleName}
        helpTraveler={this.props.helpTraveler}
        releaseTraveler={this.props.releaseTraveler}
        onItemClosed={this.props.onItemsClosed}
        onItemOpened={this.props.onItemsOpened}
        loadLatestProducts={this.props.loadLatestProducts} />
    );
  };

  render () {
    const { activeTravelers } = this.props;

    return (
      <div className='travelers-list-cntr'>
          {/* <ActiveTravelersListItem/> */}
          <ReactList
          itemRenderer={this.renderItem}
          length={activeTravelers.length} />
      </div>
    );
  }
}
export default ActiveTravelersList;
