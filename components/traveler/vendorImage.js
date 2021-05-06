import PropTypes from 'prop-types';
import React from 'react';
import config from '../../config';
const {
  vendorImageUrl: {
    main, airlinePath, carRentalPath, lodgingPath,
    railOperatersPath, defaultImageName, imgExtension
  }
} = config;

export class VendorImage extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    code: PropTypes.string.isRequired,
    vendorName: PropTypes.string,
    type: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    let imgType;
    switch (this.props.type) {
      case 'flight':
        imgType = airlinePath;
        break;
      case 'car-rental':
      case 'vehicle':
        imgType = carRentalPath;
        break;
      case 'lodging':
        imgType = lodgingPath;
        break;
      case 'rail':
        imgType = railOperatersPath;
        break;
    }

    this._url = `${main}/${imgType}`;

    this.state = {
      img: false,
      imgLoading: true
    };
  }

  UNSAFE_componentWillMount () {
    if (this.props.code) {
      const img = new Image();
      img.src = `${this._url}/${this.props.code}${imgExtension}`; // required img
      img.onload = () => {
        if (!this.state.img) {
          this.setState({
            imageLoading: false,
            img: true
          });
        }
      };
      if (img.complete && !this.state.img) {
        this.setState({
          imageLoading: false,
          img: true
        });
      }
    }
  }

  render () {
    const { l } = this.context.i18n;
    const { vendorName } = this.props;
    const loadingClass = this.state.imageLoading ? 'vendor-loading' : '';
    const imgAlt = vendorName || l('Carrier logo');
    const img = this.state.img
      ? (<img src={`${this._url}/${this.props.code}${imgExtension}`} alt={imgAlt} />) : null;
    const defaultBg = !this.state.img
      ? { backgroundImage: `url(${this._url}/${defaultImageName}${imgExtension})` } : {};
    return (
      <div className={`vendor-image ${loadingClass}`} style={defaultBg}>
        {img}
      </div>
    );
  }
}
export default VendorImage;
