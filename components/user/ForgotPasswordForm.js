/* eslint-disable max-len */
/* eslint-disable react/jsx-no-comment-textnodes */
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Validator from '../../helpers/validator';

export class LoginForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.any.isRequired,
    requestHashCode: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._emailFieldRef = React.createRef();
    this.state = {
      emailErrors: false,
      email: '',
      show: false
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      emailErrors: false
    });
  }

  // handleClick (event) {
  //   if (event.target.scrollTop > 250) {
  //     this.setState({ buttonColor: true });
  //   } else {
  //     this.setState({ buttonColor: false });
  //   }
  // }

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  }

  showbtn = (e) => {
    this.setState({
      show: true
    });
    const resetLink = window.location.origin + '/set-new-password/';
    if (this.validateForm() && this.props.user.identityId) {
      this.props.requestHashCode(this.context.i18n.l, this._emailFieldRef.current.value, resetLink);
    }
  }

  validateForm () {
    let valid = true;
    if (!Validator.isValidEmail(this._emailFieldRef.current.value)) {
      valid = false;
      this.setState({
        emailErrors: (
          <span className='error'>
            {this.context.i18n.l('Invalid email')}
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
        // <form className='forgot-form' onSubmit={this.onSubmit}>
        //   <fieldset>
        //     <h2>{l('Forgot your password?')}</h2>
        //     <label htmlFor='name'>{l(`Enter your email address and we will send you instructions on how
        //     to change it.`)}</label>
        //     <div className='field'>
        //       {this.state.emailErrors}
        //       <input type='text' id='name' name='name' ref={this._emailFieldRef} placeholder='Email' />
        //     </div>
        //     <div className='btn-hold'>
        //       <Link className='btn btn03' to='/login'>{l('Back to Log In')}</Link>
        //       <button type='submit' className='btn btn01' disabled={!user.identityId}>
        //         {l('Send')}
        //       </button>
        //     </div>
        //   </fieldset>
        // </form>
        <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-xs-12 logoh">
          <div className="logo"></div>
        <form className='login-form' onSubmit={this.onSubmit}>

            <fieldset>
            {(!this.state.show)
              ? (
               <>
              <div className="head">
                It happens to all of us!
              </div>
              <div className="message">
                Enter your email address where you received your WorldWatch invitation.

              </div>
              <div className="message msg2">
                 We will send you instructions on how to create a new one.
              </div>
            <div className='field field1' >
           {this.state.emailErrors}
            <input type='text' id='name' name='email' value= {this.state.email} onChange={this.handleChange}
            ref={this._emailFieldRef}
            placeholder='Email' />
          </div>
          {user.errorMessage && (<div className='btn btn01' style={{ background: '#F25151' }}>
              <span className="loginText">{this.props}</span>
              <span className="fa_custom">
                <i className="fas fa-times"></i>
              </span>
            {/* <i className="fa fa-arrow-circle-right fa_custom"></i> */}
            </div>)}
            {/* <div className='field'>
              {this.state.emailErrors}
              <input type='text' id='name' name='name' ref={this._usernameFieldRef} placeholder='Email' />
            </div> */}
            {/* <div className='field'>
              {this.state.passwordErrors}
              <input type='password' id='password' name='password' ref={this._passwordFieldRef}
                placeholder='Password' />
            </div>
            <div className='forgot-link'>
              <Link to='/forgot-password' style={{ color: '#4C93FF', margin: '4%' }}>   {l('Forgot password?')}</Link>
            </div> */}
            {/* <button type='submit' className='btn btn01'>
              <span className="loginText">{l('Send')}</span> */}
              <div className= "btn-hold btn-flex">
                <div>
                  <Link className='bck btn03' to='/login'>{l('Back')}</Link>
                </div>
                <div>
                <button type='submit' disabled={!(this.state.email.length >> 1)} onClick={this.showbtn} className='btn btn01'>
                 {l('Send')}
                 <span className="fa_customm">
                  <i className="arrow-right arr-cls"></i>
              </span>
               </button>
                </div>
              </div>
                 </>)
              : (
                <>
                <div className="head">
                Check your Email
              </div>
              <div className="message">
               An email has been sent to the email address on file. Check your email Inbox for a password reset link from WorldWatch.

              </div>
              <div className="message msg2">
                 Email not arriving? Be sure to check your spam folder.
              </div>
               <div className= "btn-hold btn-flex">
                  <Link className='bc btn02' to='/login'>{l('Back to Log In')}</Link>
                </div>
                </>
                )}
              {/* <div className='btn-hold'>
               <Link className='bck btn03' to='/login'>{l('Back')}</Link>
              <button type='submit' className='btn btn01'>
                 {l('Send')}
                 <span className="fa_custom">
                  <i className="arrow-right arr-cls"></i>
              </span>
               </button>
             </div> */}

            {/* <i className="fa fa-arrow-circle-right fa_custom"></i> */}

            {/* </button> */}
            {/* <div className='terms-conditions'><a href={config.links.privacyPolicy}
            rel='noopener noreferrer'
             target='_blank' style={{ color: '#4C93FF' }}>Privacy Policy</a>
              <a className="justi-content" href={process.env.PUBLIC_URL + 'public/terms.html'}
              // {config.links.termsAndConditions}
               rel='noopener noreferrer' target='_blank' style={{ color: '#4C93FF' }}>
                Terms &#38; Conditions</a>
            </div> */}
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
