import PropTypes from 'prop-types';
import React from 'react';

import MapThumbnail from './mapThumbnail';

export class MapThumbnails extends React.Component {
  static propTypes = {
    areas: PropTypes.array.isRequired,
    isOpened: PropTypes.bool.isRequired
  };

  getAreaItem = (area, key) => {
    return (
      <MapThumbnail key={key}
        index={key}
        area={area}
        {...this.props} />
    );
  };

  render () {
    const {
      areas,
      isOpened
    } = this.props;
    const listClass = 'map-thumbnails';
    const thumbList = areas.map(this.getAreaItem);

    return (
      <ul className={isOpened ? listClass : `${listClass} hidden`}>
        {thumbList}
      </ul>
    );
  }
}

export default MapThumbnails;
