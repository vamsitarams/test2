import PropTypes from 'prop-types';
import React from 'react';

export class MapThumbnail extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    area: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
    activatedArea: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    spotByContNumbers: PropTypes.object.isRequired
  };

  handleClick = () => {
    this.props.handleClick(this.props.index);
  };

  render () {
    const {
      activatedArea,
      spotByContNumbers,
      area
    } = this.props;

    const itemClass = 'map-thumbnails__area';
    const className = activatedArea && activatedArea === area.name
      ? `${itemClass} active` : itemClass;

    return (
      <li className={className}
        onClick={this.handleClick}>
        <span className='map-thumbnails__spots-number'>{spotByContNumbers ? spotByContNumbers[area.name] : 0}</span>
        <i className={`map-thumbnails__icon ${area.name} ${activatedArea === area.name ? 'active' : ''}`} />
        <span className='map-thumbnails__area-title'>{area.title}</span>
      </li>
    );
  }
}

export default MapThumbnail;
