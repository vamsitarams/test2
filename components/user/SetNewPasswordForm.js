import PropTypes from 'prop-types';
import React from 'react';
import Validator from '../../helpers/validator';
import PasswordCriteria from '../../components/common/passwordCriteria';

export class SetNewPasswordForm extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.any,
    user: PropTypes.any.isRequired,
    saveNewPassword: PropTypes.func.isRequired,
    toggleError: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    // this._newPasswordFieldRef = React.createRef();
    this._passwordCriteriaRef = React.createRef();
    // this._confirmPasswordFieldRef = React.createRef();
    this.state = {
      newPasswordErrors: false,
      confirmPasswordErrors: false,
      newPassword: '',
      confirmPassword: '',
      toggleText: false,
      showError: false,
      errorMsg: '',
      toggleButton: false
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ showError: true, errorMsg: nextProps.user.errorMessage });
    setTimeout(() => {
      if (nextProps.user.errorFlag) {
        console.log(nextProps.user.errorFlag);
        this.props.toggleError();
        console.log(nextProps.user);
        this.setState({ showError: false, errorMsg: '', toggleButton: true });
      }
    }, 5000);
  }

  handleMatch = (e) => {
    this.setState({ confirmPassword: e.target.value });
    if (e.target.value === this.state.newPassword) {
      this.setState({ toggleText: true });
    }
  }

    handleError = () => {
      this.props.user.errorFlag && this.props.toggleError();
      this.setState({ showError: false });
    }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.validateForm() && this.props.user.identityId) {
      this.props.saveNewPassword(
        this.context.i18n.l,
        this.state.newPassword,
        this.props.match.params.code
      );
    }
  }

  addError (state, errorText) {
    this.setState({
      [state]: (
        <span className='error'>
          {this.context.i18n.l(errorText)}
        </span>
      )
    });
  }

  validateForm () {
    let valid = true;
    if (!Validator.isEmpty(this.state.newPassword)) {
      valid = false;
      this.addError('newPasswordErrors', 'Password is required');
    } else if (this._passwordCriteriaRef.current.isValid()) {
      valid = false;
      this.addError('newPasswordErrors', 'Password is not strong enough');
    } else this.setState({ newPasswordErrors: false });

    if (!Validator.isEmpty(this.state.confirmPassword)) {
      valid = false;
      this.addError('confirmPasswordErrors', 'Confirm is required');
    } else this.setState({ confirmPasswordField: false });

    if (this.state.confirmPassword !== this.state.newPassword) {
      valid = false;
      this.addError('confirmPasswordErrors', 'Confirm password doesn\'t match');
    }

    return valid;
  }

  pushLogin =(e) => {
    console.log('Triggering');
    e.preventDefault();
  }

  render () {
    const { l } = this.context.i18n;
    const { user } = this.props;
    let form = null;
    // const text = this._passwordCriteriaRef.current.value;
    // const confirmText = this._confirmPasswordFieldRef.current.value;
    form = (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-xs-12 logoh ">
          <div className="logo"></div>
        <form className='login-form sec' onSubmit={!this.state.toggleButton ? this.onSubmit : this.pushLogin}>

            <fieldset>
            <div className='field'>
              {this.state.newPasswordErrors}
              <PasswordCriteria ref={this._passwordCriteriaRef}>
              <input type='password'
                     id='newPassword'
                     name='newPassword'
                     value={this.state.newPassword}
                     onChange={(e) => this.setState({ newPassword: e.target.value })}
                     maxLength='30'
                     autoComplete='off'
                     placeholder='Password' />
                </PasswordCriteria>
            </div>
            <div className='field'>
              {this.state.confirmPasswordErrors}
              <input type='password'
                     id='confirmPassword'
                     name='confirmPassword'
                     maxLength='30'
                     value= {this.state.confirmPassword}
                     onChange={this.handleMatch}
                     autoComplete='off'
                     placeholder='Confirm Password' />
            </div>
            <button type='submit' className='btn btn01' disabled={!this.state.toggleText}
            style={{ boxShadow: !this.state.toggleText ? 'none' : '' }}>
            {!this.state.toggleButton ? l('Submit') : l('Go to Login')}
            </button>
            {this.state.showError && (this.state.errorMsg !== undefined)
              ? (<div className='btn btn01 mt-4' style={{ background: '#4BC07A' }}>
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
    return form;
  }
}
export default SetNewPasswordForm;
