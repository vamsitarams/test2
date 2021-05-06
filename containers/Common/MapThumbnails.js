import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import {
  actions as mapActions,
  stateAreaShown
} from '../../redux/modules/atMap';
import {
  stateByContNumbers
} from '../../redux/modules/activeTravelers';
import MapThumbnails from '../../components/common/mapThumbnails';
import areas from '../../config/areas-list';

const mapStateToProps = createSelector(
  stateAreaShown,
  stateByContNumbers,
  (areaShown, spotByContNumbers) => ({
    areaShown,
    spotByContNumbers
  })
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(mapActions, dispatch)
  };
};

export class MapThumbnailsContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpened: true
    };
  }

  static propTypes = {
    atChangeAreaShown: PropTypes.func.isRequired,
    areaShown: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    panMapTo: PropTypes.func.isRequired,
    spotByContNumbers: PropTypes.object.isRequired
  };

  toggle = () => {
    this.setState({ isOpened: !this.state.isOpened });
  };

  handleClick = areaKey => {
    if (areas[areaKey].name === this.props.areaShown) {
      this.props.atChangeAreaShown(false);
    } else {
      this.props.atChangeAreaShown(areas[areaKey].name);
      this.props.panMapTo(areas[areaKey].center);
    }
  };

  render () {
    const { isOpened } = this.state;
    const {
      areaShown,
      spotByContNumbers
    } = this.props;
    const iconClass = 'map-thumbnails__icon-arrow';

    return (
      <div className='map-thumbnails-holder'>
        <button className='map-thumbnails__toggle-btn' onClick={this.toggle}>
          <i className={isOpened ? iconClass : `${iconClass} top`} />
        </button>

        <MapThumbnails areas={areas}
          activatedArea={areaShown}
          handleClick={this.handleClick}
          isOpened={isOpened}
          spotByContNumbers={spotByContNumbers} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapThumbnailsContainer);
