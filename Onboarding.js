import React from 'react';
import PropTypes from 'prop-types';
import './onboarding.css';
import Computer from './styles/images/Computer.svg';
export default class Terms extends React.Component {
  static propTypes = {
    history: PropTypes.any.isRequired,
    push: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.handleOnboard = this.handleOnboard.bind(this);
  }

  handleOnboard () {
    this.props.history.push('/terms');
  }

  render () {
    return (
        <div className="onboarding-wrapper">
            <h1 className="title">Get Started with WorldWatch</h1>
            <img className='onboard-img' src={Computer} alt="comp"/>
            <p className="desc"> To begin we need to cover a few legal things. <br/> Are you ready? Let’s go! </p>
            <button type='submit' className='btnn' onClick={this.handleOnboard}>
              <span className="loginText">Next</span>
              <span className="fa_custom">
                <i className="arrow-right arr-cls"></i>
              </span>
            </button>
        </div>
    );
  }
}
