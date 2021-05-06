import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import config from '../../config';
import './Covid19TravelAdvisoryView.css';

const mapStateToProps = createSelector(
  stateAppSettingsDimensions,
  (appSettingsDimensions) => {
    return {
      appSettingsDimensions
    };
  }
);

class Covid19TravelAdvisoryView extends React.Component {
  static propTypes = {
    appSettingsDimensions: PropTypes.object.isRequired
  };

  render () {
    const containerStyle = {
      height: this.props.appSettingsDimensions.height
    };

    return (
      <div style={containerStyle}>
        <iframe src={config.links.travelAdvisory.whereCanITravel} className='covidcheckermap' />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Covid19TravelAdvisoryView);
