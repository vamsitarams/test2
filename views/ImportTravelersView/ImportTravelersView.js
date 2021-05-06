import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Link } from 'react-router-dom';
import ImportTravelers from '../../components/importTravelers/importTravelers';

import config from '../../config/index';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
const headerHeight = config.layout.headerHeight;

const mapStateToProps = createSelector(
  stateAppSettingsDimensions,
  (appSettingsDimensions) => {
    return {
      appSettingsDimensions
    };
  }
);

export class ImportTravelersView extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    appSettingsDimensions: PropTypes.object.isRequired
  };

  render () {
    const { l } = this.context.i18n;

    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };

    return (
      <div
        id='pageImportScrollHolder'
        className='scrollable-horizontally page-content page-import-travelers'
        style={containerStyle}>
        <div className='head-row'>
          <ul className='breadcrumb'>
            <li><Link to='/travelers-list'>{l('Travelers List')}</Link></li>
            <li>{l('Import Travelers')}</li>
          </ul>
        </div>
        <ImportTravelers />
      </div>
    );
  }
}

export default connect(mapStateToProps)(ImportTravelersView);
