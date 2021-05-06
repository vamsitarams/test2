import PropTypes from 'prop-types';
import React from 'react';
import TravelAdvisoryPopup from '../../travelAdvisory/travelAdvisoryPopup';
import { timeInCountry } from '../../../helpers/traveler';

class TravelAdvisoryListItem extends React.Component {
  static propTypes = {
    country: PropTypes.object,
    products: PropTypes.array
  };

  state = {
    countryToShow: null
  }

  closePopup = () => {
    this.setState({ countryToShow: null });
  }

  showPopup = (e) => {
    e.preventDefault();
    this.setState({ countryToShow: this.props.country });
  }

  render () {
    const { country, level, levelText, shortCode } = this.props.country;
    return (
      <li>
        <div className='title'>
          <strong>{country}</strong>
          <span className={'level level-' + level}>{level}</span> - {levelText.replace(/[\w\s]+:/g, '')}
        </div>
        <p>{timeInCountry(shortCode, this.props.products)}</p>
        <a href='' onClick={this.showPopup}>More Info</a>
        <TravelAdvisoryPopup country={this.state.countryToShow} onClose={this.closePopup} />
      </li>
    );
  }
}

export default TravelAdvisoryListItem;
