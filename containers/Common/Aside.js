import PropTypes from 'prop-types';
import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import Aside from '../../components/common/aside';
import { stateSideMenuOpened } from '../../redux/modules/appSettings';

const mapStateToProps = createSelector(
  stateSideMenuOpened,
  (sideMenuOpened) => ({
    sideMenuOpened
  })
);

export class LoadingContainer extends React.Component {
  static propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    sideMenuOpened: PropTypes.bool.isRequired
  };

  render () {
    return (
      <Aside {...this.props} />
    );
  }
}

export default connect(mapStateToProps, null)(LoadingContainer);
