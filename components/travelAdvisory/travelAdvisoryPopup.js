import PropTypes from 'prop-types';
import React from 'react';
import TravelersBox from './travelersBox';
import AdvisoryBox from './advisoryBox';

class TravelAdvisoryPopup extends React.Component {
  static propTypes = {
    country: PropTypes.object,
    onClose: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._advisory = {
      title: 'Advisory Info',
      isActive: true
    };
    if (props.country && props.country.travelers) {
      this._travelers = {
        title: `Travelers (${Object.keys(props.country.travelers).length})`,
        isActive: false
      };
    } else {
      this._travelers = null;
    }

    this.state = {
      navigation: {
        advisory: { ...this._advisory },
        travelers: { ...this._travelers }
      }
    };
  }

  UNSAFE_componentWillReceiveProps (props) {
    this.setState(() => {
      if (props.country && props.country.travelers) {
        this._travelers = {
          title: `Travelers (${Object.keys(props.country.travelers).length})`,
          isActive: false
        };
      } else {
        this._travelers = null;
      }
      return {
        navigation: {
          advisory: { ...this._advisory, isActive: true },
          travelers: { ...this._travelers }
        }
      };
    });
  }

  handleNav = e => {
    const { navigation } = this.state;
    const id = e.currentTarget.dataset.id;

    Object.keys(navigation).map(key => (navigation[key].isActive = key === id));
    this.setState({ navigation });
  };

  close = () => {
    this.props.onClose();
  };

  render () {
    const { country } = this.props;
    if (!country || !Object.keys(country).length) return null;

    const levelText = country.levelText.replace(/\d:/g, '-');

    const { navigation } = this.state;
    const items = Object.keys(navigation).map(key => (
      <li key={key} data-id={key} onClick={this.handleNav} className={navigation[key].isActive ? 'active' : ''}>
        {navigation[key].title}
      </li>
    ));

    let content = '';
    if (navigation.travelers && navigation.travelers.isActive) {
      content = <TravelersBox country={country} />;
    }
    if (navigation.advisory && navigation.advisory.isActive) {
      content = <AdvisoryBox country={country} />;
    }

    return (
      <div className='popup-travel-advisory'>
        <div className='popup-travel-advisory-content'>
          <div className='headbox'>
            <div className='head'>
              <div className='title'>
                <h4>
                  {country.country} <em className={'level level-' + country.level}>{country.level}</em>
                </h4>
                <p>{levelText}</p>
              </div>
              <button className='btn-close' onClick={this.close}>
                Close
              </button>
            </div>
            <div className='popup-menu'>
              <ul>{items}</ul>
            </div>
          </div>
          <div className='contentbox'>{content}</div>
        </div>
      </div>
    );
  }
}

export default TravelAdvisoryPopup;
