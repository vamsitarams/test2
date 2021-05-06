import React from 'react';
// import ReactDom from 'react-dom';

class WorldHub extends React.Component {
  render () {
    return (
    <div style={{ display: 'flex' }}>
    <div style={{ width: '100%', height: '100vh' }} >
    <iframe src='http://worldhub.wti.global/worldtravel/login' width='100%' height='100%' />
    </div>
    </div>
    );
  }
}
export default WorldHub;
