import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import $ from 'jquery';

import {
  actions as appSettingsActions,
  stateAppSettings
} from '../../redux/modules/appSettings';

const mapStateToProps = createSelector(
  stateAppSettings,
  (appSettings) => {
    return {
      appSettings
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(appSettingsActions, dispatch)
  };
};

export class AppSettingsContainer extends React.Component {
  static propTypes = {
    appSettings: PropTypes.object.isRequired,
    changeDimensions: PropTypes.func.isRequired,
    requestAppSettings: PropTypes.func.isRequired
  };

  componentDidMount () {
    const { appSettings, changeDimensions, requestAppSettings } = this.props;
    if (!appSettings.constants) {
      requestAppSettings();
    }
    const $win = $(window);
    $win.on('resize', () => {
      changeDimensions({
        width: $win.width(),
        height: $win.height()
      });
    }).trigger('resize');
  }

  render = () => null;
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettingsContainer);
