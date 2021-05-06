import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import './Covid19View.css';

const mapStateToProps = createSelector(
  stateAppSettingsDimensions,
  (appSettingsDimensions) => {
    return {
      appSettingsDimensions
    };
  }
);

class Covid19View extends React.Component {
  static propTypes = {
    appSettingsDimensions: PropTypes.object.isRequired
  };

  render () {
    const containerStyle = {
      height: this.props.appSettingsDimensions.height
    };

    return (
      <div style={containerStyle}>
        <iframe src='https://bing.com/covid' className='bingmap' />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Covid19View);
