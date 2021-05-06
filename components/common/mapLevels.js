import PropTypes from 'prop-types';
import React from 'react';

export default class MapLevels extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor (props) {
    super(props);
    this._timeframeLabels = {};
  }

  render () {
    return (
      <div>
        <div className='map-bottom-area'>
          <div className='cust-cb levels'>
            <div className='level level-4'>
              <em>4</em>
              <strong>Do Not Travel</strong>
            </div>
            <div className='level level-3'>
              <em>3</em>
              <strong>Reconsider Travel</strong>
            </div>
            <div className='level level-2'>
              <em>2</em>
              <strong>Exercise Increased Caution</strong>
            </div>
            <div className='level level-1'>
              <em>1</em>
              <strong>Exercise Normal Precautions</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
