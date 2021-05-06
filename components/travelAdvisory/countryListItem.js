import PropTypes from 'prop-types';
import React from 'react';
export class CountryListItem extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    showLetter: PropTypes.bool.isRequired,
    showCountry: PropTypes.func.isRequired,
    activeCountry: PropTypes.shape({
      country: PropTypes.string,
      travelers: PropTypes.array,
      level: PropTypes.string,
      url: PropTypes.string
    }).isRequired
  };

  state = {
    travelersLength: 0
  };

  onCountryClick = (event, country) => {
    this.props.showCountry(country);
  }

  UNSAFE_componentWillReceiveProps (props) {
    const { travelers } = props.activeCountry;
    this.setState({
      travelersLength: travelers ? Object.keys(travelers).length : 0
    });
  }

  render () {
    let letter = '';
    const { showLetter, activeCountry } = this.props;

    if (showLetter) {
      letter = <em>{activeCountry.country.charAt(0).toUpperCase()}</em>;
    }

    const { travelersLength } = this.state;

    return (
      <div className='country-item' onClick={event => this.onCountryClick(event, activeCountry.country)}>
        <div className='letter'>{letter}</div>
        <div className='text'>
          <strong className='name'>{activeCountry.country}</strong>
          <em className={'level level-' + activeCountry.level}>{activeCountry.level}</em>
          <span className={`country-travelers ${!travelersLength ? 'no-travelers' : ''}`}>
            {travelersLength} <i className='travelers' />
          </span>
        </div>
      </div>
    );
  }
}
export default CountryListItem;
