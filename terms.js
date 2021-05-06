/* eslint-disable max-len */
// /* eslint-disable max-len */
// import React,{useState,useEffect} from 'react';

// const Terms = () => {
//   const [scrolling, setScrolling] = useState(false);
//   const [scrollTop, setScrollTop] = useState(0);
//   useEffect(() => {
//     const onScroll = e => {
//       setScrollTop(e.target.documentElement.scrollTop);
//       setScrolling(e.target.documentElement.scrollTop > scrollTop);
//     };
//     window.addEventListener('scroll', onScroll);

//     return () => window.removeEventListener('scroll', onScroll);
//   }, [scrollTop]);
//   return (
//         <div data-spy="scroll" data-target="#myScrollspy" data-offset="20">
//            <div classNameName="container">

// <div classNameName="row">

// <div classNameName="col-sm-8 col-md-12">
// <h1 classNameName="terms-conditions">Terms & Conditions</h1>

// </div>
// </div>
// <div classNameName="container ">
//   <div classNameName="row">
//     <div classNameName="col-sm-8  col-md-12">
//       <div classNameName="overflow-auto  vertical-scrollable">
//       <div classNameName="section1">
//         <h4>WorldWatch Terms & Conditions</h4>
//         <p>WorldWatch is a web application (the “App”) operated by World Travel, Inc. (“we” or “our” or “us”) which travelers (“users,” or “you”), travel managers, and other authorized users can access using the internet. Please read these Terms & Conditions carefully before using this App. Your use of this App is expressly conditioned on your acceptance of the following terms. By using this App, you signify your assent to these Terms & Conditions. If you do not agree with any part of the following terms, you should not use this App.</p>

// <p>In addition to these Terms & Conditions, please also carefully read the companion Privacy Policy for WorldWatch.</p>

// <p>You can obtain a specific list of data processed by WorldWatch anytime by emailing your request to privacy@worldtravelinc.com.</p>

// <p>These Terms & Conditions are governed by and will be construed in accordance with the laws of the United States and the State of Pennsylvania. Any disputes arising under or in connection with these Terms & Conditions, or your access or use of the App shall be subject to the exclusive jurisdiction of the State and federal courts located in Pennsylvania.</p>
//         <p>1. Your address, telephone number, and email address;</p>
// <p>2. A description of the copyrighted work that you claim has been infringed;</p>
// <p>3. A description of the allegedly infringing material and information reasonable sufficient to permit us to locate the material;</p>
// <p>4. A statement by you that you have a good faith belief that the disputed use is not authorized by you, the copyright owner, its agent, or the law;</p>
// <p>5. An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest; and</p>
// <p>6. A statement by you, made under penalty of perjury, that the above information in your Notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.
// Copyright Agent: Maribeth L. Minella, EVP & Corporate Counsel, World Travel, Inc.; 620 Pennsylvania Drive, Exton, PA 19341; mminella@worldtravelinc.com</p>

// <p>11. Contact Us
// Questions regarding these terms should be addressed to privacy@worldtravelinc.com or to World Travel, Inc.’s corporate counsel, Maribeth L. Minella, at mminella@worldtravelinc.com.</p>
// </div>
// </div>

//   </div>
// </div>
// </div>
// <div classNameName="container">
//       <div classNameName="row">
//       <div classNameName="col-sm-8 butn">
//     <button classNameName="disagree">Disagree</button>
// eslint-disable-next-line max-len
//     <button type="button" data-toggle="tooltip" data-placement="bottom" title="Tooltip on top" classNameName="accept-button" >
//     <span classNameName="iconCol">
//         <i classNameName="arrow-right arr-cls "></i>
//             </span>
//               Accept
//     </button>
//       </div>
//     </div>
//   </div>
// </div>
// </div>
//   );
// };
// export default Terms;
// import { node } from 'prop-types';
import React from 'react';
import './terms.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as userActions } from './redux/modules/user';

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userActions, dispatch)
  };
};
class Terms extends React.Component {
   static propTypes = {
     history: PropTypes.any.isRequired,
     push: PropTypes.func.isRequired,
     user: PropTypes.object.isRequired,
     logOutUser: PropTypes.func.isRequired
   };

   constructor (props) {
     super(props);
     this.state = {
       buttonColor: false
     };
     this.handleScroll = this.handleScroll.bind(this);
     this.handleDecline = this.handleDecline.bind(this);
   }

   componentDidMount () {
     window.addEventListener('scroll', this.handleScroll);
   }

   componentWillUnmount () {
     window.removeEventListener('scroll', this.handleScroll);
   }

   handleDecline () {
     this.props.user && this.props.logOutUser();
     this.props.history.push('/login');
   }

   handleAccept = () => {
     this.props.history.push('/home');
   }

   handleScroll (event) {
     if (event.target.scrollTop > 250) {
       this.setState({ buttonColor: true });
     } else {
       this.setState({ buttonColor: false });
     }
   }

   render () {
     const { buttonColor } = this.state;
     return (
    <div className='body' >
    <div data-spy="scroll" data-target="#myScrollspy" data-offset="20">
<div className="container">
<div className="row">

<div className="col-sm-8 col-md-12">
<h1 className="terms-conditions">Terms & Conditions</h1>
</div>
</div>
<div className="container ">
  <div className="row">
    <div className="col-sm-8  col-md-12">
      <div onScroll={e => { this.handleScroll(e); }} className="overflow-auto   vertical-scrollable">
      <div className="section1">
        <h4>WorldWatch Terms & Conditions</h4>
        <p>WorldWatch is a web application (the “App”) operated by World Travel, Inc. (“we” or “our” or “us”) which travelers (“users,” or “you”), travel managers, and other authorized users can access using the internet. Please read these Terms & Conditions carefully before using this App. Your use of this App is expressly conditioned on your acceptance of the following terms. By using this App, you signify your assent to these Terms & Conditions. If you do not agree with any part of the following terms, you should not use this App.</p>

<p>In addition to these Terms & Conditions, please also carefully read the companion Privacy Policy for WorldWatch.</p>

<p>You can obtain a specific list of data processed by WorldWatch anytime by emailing your request to privacy@worldtravelinc.com.</p>

<p>These Terms & Conditions are governed by and will be construed in accordance with the laws of the United States and the State of Pennsylvania. Any disputes arising under or in connection with these Terms & Conditions, or your access or use of the App shall be subject to the exclusive jurisdiction of the State and federal courts located in Pennsylvania.</p>
        <p>1. Your address, telephone number, and email address;</p>
<p>2. A description of the copyrighted work that you claim has been infringed;</p>
<p>3. A description of the allegedly infringing material and information reasonable sufficient to permit us to locate the material;</p>
<p>4. A statement by you that you have a good faith belief that the disputed use is not authorized by you, the copyright owner, its agent, or the law;</p>
<p>5. An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest; and</p>
<p>6. A statement by you, made under penalty of perjury, that the above information in your Notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.
Copyright Agent: Maribeth L. Minella, EVP & Corporate Counsel, World Travel, Inc.; 620 Pennsylvania Drive, Exton, PA 19341; mminella@worldtravelinc.com</p>

<p>11. Contact Us
Questions regarding these terms should be addressed to privacy@worldtravelinc.com or to World Travel, Inc.’s corporate counsel, Maribeth L. Minella, at mminella@worldtravelinc.com.</p>
</div>
</div>
  </div>
</div>x
</div>
<div className="container">
      <div style={{ float: 'right', marginRight: '2%' }}>
      <div className="butn">
     <div style={{ paddingRight: '24px' }} >
     <button className="disagree" onClick = {this.handleDecline}>Disagree</button>
      </div>
    <button onClick={this.handleAccept} title={!buttonColor ? 'scroll to end to accept' : null}
    disabled={!buttonColor} type="button" style={buttonColor ? { backgroundColor: '#4C93FF', color: '#ffffff' } : { backgroundColor: '#DFDFDF' }} className= 'accept'>Accept
     <span className="fa_customs">
    <i style={buttonColor ? { backgroundColor: '#3A7FE7', color: 'white' } : { backgroundColor: '#BBBBBB', color: 'black' }} className="arrow-right arr-cl"></i>
      </span>
    </button>
    {/* <button type='submit' className='btnn'
      style={{ backgroundColor: '#4C93FF', color: 'white' }} onClick={this.handleOnboard}>
      <span className="loginText">Next</span>
      <span className="fa_custom">
        <i className="arrow-right arr-cls"></i>
      </span>
    </button> */}
      </div>
    </div>
  </div>

</div>

</div>
</div>
     );
   }
}
export default connect(mapStateToProps, mapDispatchToProps)(Terms);
