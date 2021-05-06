import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Validator from '../../helpers/validator';
import config from '../../config';

export class LoginForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    history: PropTypes.any.isRequired,
    push: PropTypes.func.isRequired,
    user: PropTypes.any.isRequired,
    logInUser: PropTypes.func.isRequired,
    toggleError: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._usernameFieldRef = React.createRef();
    this._passwordFieldRef = React.createRef();
    this.state = {
      emailErrors: false,
      passwordErrors: false,
      showError: false,
      errorMsg: ''
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ showError: true, errorMsg: nextProps.user.errorMessage });
    setTimeout(() => {
      if (nextProps.user.errorFlag) {
        console.log(nextProps.user.errorFlag);
        this.props.toggleError();
        console.log(nextProps.user);
        this.setState({ showError: false, errorMsg: '' });
      }
    }, 5000);
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      emailErrors: false,
      passwordErrors: false
    });
    if (
      this.validateForm() &&
      this.props.user.identityId
    ) {
      this.props.logInUser(this._usernameFieldRef.current.value, this._passwordFieldRef.current.value);
    }
  }

    handleError = () => {
      console.log('Triggering');
      this.props.user.errorFlag && this.props.toggleError();
      this.setState({ showError: false });
    }

    validateForm () {
      let valid = true;
      if (!Validator.isValidEmail(this._usernameFieldRef.current.value)) {
        valid = false;
        this.setState({
          emailErrors: (
          <span className='error text-right'>
            {this.context.i18n.l('Invalid email')}
          </span>
          )
        });
      }
      if (!Validator.isEmpty(this._passwordFieldRef.current.value)) {
        valid = false;
        this.setState({
          passwordErrors: (
          <span className='error'>
            {this.context.i18n.l('Please fill the password')}
          </span>
          )
        });
      }
      return valid;
    }

    render () {
      const { l } = this.context.i18n;
      const { user } = this.props;
      let form = null;

      if (!user.isAuthenticated) {
        form = (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-xs-12 logoh ">
          <div className="logo"></div>
        <form className='login-form sec' onSubmit={this.onSubmit}>

            <fieldset>
            <div className='field'>
              {this.state.emailErrors}
              <input type='text' id='name' name='name' ref={this._usernameFieldRef} placeholder='Email' />
            </div>
            <div className='field'>
              {this.state.passwordErrors}
              <input type='password' id='password' name='password' ref={this._passwordFieldRef}
                placeholder='Password' />
            </div>
            <div className='forgot-link text-right'>
              <Link to='/forgot-password' style={{ color: '#4C93FF' }}>   {l('Forgot password?')}</Link>
            </div>
            <button type='submit' className='btn btn01'>
              <span className="loginText">{l('Log In')}</span>

              <span className="fa_custom">
                <i className="arrow-right arr-cls"></i>
              </span>
            {/* <i className="fa fa-arrow-circle-right fa_custom"></i> */}
            </button>
            <div className='terms-conditions'>
            <a href={config.links.privacyPolicy}
            rel='noopener noreferrer'
             target='_blank' style={{ color: '#4C93FF' }}>Privacy Policy</a>
              <a className="justi-content" href='https://www.worldtravelinc.com/worldwatch-terms-conditions'
              // {config.links.termsAndConditions}
               rel='noopener noreferrer' target='_blank' style={{ color: '#4C93FF' }}>
                Terms &#38; Conditions</a>
            </div>
              {this.state.showError && (this.state.errorMsg !== undefined)
                ? (<div className='btn btn01 mt-4' style={{ background: '#F25151' }}>
              <span className="loginText">{user.errorMessage.split(':')[1]}</span>
              <span className="fa_custom" onClick={this.handleError}>
                <i className="fas fa-times"></i>
              </span>
            {/* <i className="fa fa-arrow-circle-right fa_custom"></i> */}
            </div>) : null}
          </fieldset>
          {/* <div className='logo-head'></div> */}
        </form>
        </div>
       <div className="col-lg-8 col-md-6 col-xs-12 backimage">
<h1>Welcome!</h1>
</div>
       </div>
        </div>
        );
      }

      return form;
    }
}

export default LoginForm;
