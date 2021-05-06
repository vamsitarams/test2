import React from 'react';
// import ReactDom from 'react-dom';

class HealthView extends React.Component {
  render () {
    return (
    <div style={{ display: 'flex' }}>
    <div style={{ width: '100%', height: '100vh' }} >
    <iframe src='https://www.worldtravelinc.com/worldalert360' width='100%' height='100%' />
    </div>
    </div>
    );
  }
}
export default HealthView;
