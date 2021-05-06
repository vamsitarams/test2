import React from 'react';
// import Terms from '../../terms';
import './Home.css';
import Message from './Message';

function Home () {
  return (
      <div>
          <div className='msg'>
            <Message/>
        </div>
        {/* <div className='mmain'> */}
        <div className="mainn">
            <h1>HOME</h1>
            <div className="home">
                <div className="first">
                    <h2>Active Trips</h2>
                    <h2>1,908</h2>
                </div>
                <div className="second">
                    <h2>Disruption Status</h2>
                    <h2>76</h2>
                </div>
                <div className="third">
                    <h2>Disruption Status</h2>
                    <h2>257</h2>
                </div>
                <div className="fourth">
                    <h2>Disruption Status</h2>
                    <h2>765</h2>
                </div>
            </div>
            <div className="graph">
                <div className="graph1">
                    <h2>27,431</h2>
                    <p># of Flights</p>

                </div>
                <div className="graph2">
                    <h2>162</h2>
                    <p># of Cancellations</p>

                </div>

            </div>
            <div className='news'>
                <div className='alerts'>
                    <h3>Disruption</h3>
                    <p>New Travel Advisory for Liechenstein</p>
                    <p>Flight Cancellation: UA 925</p>
                    <p>Travel Advisory for North Macedonia</p>
                </div>
                <div className='health'>
                    <h3>Health</h3>
                    <p>Lorem ipsum dolor sit amet </p>
                    <p>Consectetur adipiscing elit</p>
                    <p>Sed do eiusmod tempor incididunt ut</p>
                </div>
                <div className='security'>
                    <h3>Security</h3>
                    <p>Lorem ipsum dolor sit amet </p>
                    <p>Consectetur adipiscing elit</p>
                    <p>Sed do eiusmod tempor incididunt ut</p>

                </div>
            </div>
        </div>
        </div>
        // </div>
  );
}

export default Home;
