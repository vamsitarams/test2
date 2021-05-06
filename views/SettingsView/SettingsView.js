import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import './SettingsView.scss';
import SettingsTabs from '../../components/common/settingsTabs';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';

const mapStateToProps = createSelector(
  stateAppSettingsDimensions,
  (appSettingsDimensions) => ({
    appSettingsDimensions
  })
);

const mapDispatchToProps = (dispatch) => {
  return {};
};

class SettingsView extends React.Component {
  static propTypes = {
    appSettingsDimensions: PropTypes.object.isRequired
  };

  render () {
    console.log(this.props);
    return (
    <SettingsTabs appSettingsDimensions={this.props.appSettingsDimensions} />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
