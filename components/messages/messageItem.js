import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import HelpedBlock from '../../containers/Traveler/HelpedBlock';
import TravelerMessageIcon from './travelerMessageIcon';

export class MessageItem extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    traveler: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      helpedBy: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string
      }),
      isVIP: PropTypes.bool,
      currentJourneyStatus: PropTypes.string,
      lastMessage: PropTypes.shape({
        message: PropTypes.string,
        timestampUTC: PropTypes.object
      }),
      organization: PropTypes.shape({
        name: PropTypes.string
      }),
      _id: PropTypes.shape({
        $oid: PropTypes.string
      })
    }).isRequired,
    helped: PropTypes.bool,
    helpTraveler: PropTypes.func.isRequired,
    releaseTraveler: PropTypes.func.isRequired
  };

  helpTraveler = () => {
    this.props.helpTraveler(this.props.traveler);
  }

  releaseTraveler = () => {
    this.props.releaseTraveler(this.props.traveler);
  }

  render () {
    const { traveler, helped } = this.props;

    let vip, status;

    if (traveler.isVIP) {
      vip = (<strong className='vip'>VIP</strong>);
    }
    if (traveler.currentJourneyStatus) {
      status = (
        <i className={`icon ${traveler.currentJourneyStatus}`}>
          {traveler.currentJourneyStatus}
        </i>
      );
    }

    return (
      <div className='message-holder'>
        {!helped ? <HelpedBlock helpedBy={traveler.helpedBy} travelerId={traveler._id.$oid} /> : null}
        <div className='traveler-info'>
          {status}
          <div className='info-item'>
            <div className='name'>
              <Link to={`/traveler/${traveler._id.$oid}`}>
                <strong className='travelers-name'>{traveler.firstName} {traveler.lastName}</strong>
                , <span className='organization'>{traveler.organization.name}</span>
                {vip}
              </Link>
              <TravelerMessageIcon lastMessage={traveler.lastMessage} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MessageItem;
