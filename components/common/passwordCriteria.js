import PropTypes from 'prop-types';
import React from 'react';
import $ from 'jquery';

export default class PasswordCriteria extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.element.isRequired
  }

  constructor () {
    super(...arguments);
    this.state = {
      showPopup: false,
      validationErrors: {
        minLength: false,
        maxLength: false,
        numberAndLetter: false,
        specialCharacter: false
      }
    };
  }

  isValid = () => {
    const err = this.state.validationErrors;
    return err.minLength || err.maxLength || err.numberAndLetter || err.specialCharacter;
  }

  componentDidMount () {
    if (this.props.children.type === 'input') {
      if (this.props.children.props.id) {
        this._input = $('#' + this.props.children.props.id);
      } else if (this.props.children.props.name) {
        this._input = $(`input[name="${this.props.children.props.name}"]`);
      }
    }
    const letters = /[A-Za-z]/;
    const digest = /\d/;
    const special = /[!@#\/_,\.;:\\\$%\^&\*\(\)~\?"'<>=\+\-\|]/;

    this._input.on('focus.pass-criteria', () => {
      this.setState({ showPopup: true });
    }).on('blur.pass-criteria', () => {
      this.setState({ showPopup: false });
    }).on('keyup.pass-criteria', () => {
      const val = this._input.val();
      this.setState({
        validationErrors: {
          minLength: val.length < 8,
          maxLength: val.length > 30,
          numberAndLetter: !letters.test(val) || !digest.test(val),
          specialCharacter: !special.test(val)
        }
      });
    });
  }

  componentWillUnmount () {
    this._input.off('focus.pass-criteria blur.pass-criteria keypress.pass-criteria');
  }

  render () {
    const { l } = this.context.i18n;
    const { children } = this.props;
    const { showPopup, validationErrors: { minLength, maxLength, numberAndLetter, specialCharacter } } = this.state;

    return (
      <div className='password-criteria'>
        {children}
        {showPopup && <div className='password-popup'>
          <h5>{l('Password criteria')}:</h5>
          <ul>
            <li className={minLength || maxLength ? 'invalid' : 'valid'}>
              {l('be between 8 and 30 characters')}
            </li>
            <li className={numberAndLetter ? 'invalid' : 'valid'}>
              {l('have at least 1 letter and 1 number')}
            </li>
            <li className={specialCharacter ? 'invalid' : 'valid'}>
              {l('have at least 1 special character (!,@,#...)')}
            </li>
          </ul>
        </div>}
      </div>
    );
  }
}
