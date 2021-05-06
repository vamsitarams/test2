import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router';
import TravelerMessageIcon from '../../containers/Common/TravelerMessageIcon';
import config from '../../config';
import { Scrollbars } from 'react-custom-scrollbars';

export class ActiveTravelersList extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    travelers: PropTypes.array.isRequired,
    sideMenuOpened: PropTypes.bool.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    const { travelers } = this.props;

    if (travelers.length) {
      const travelersList = travelers.map((traveler) => {
        let status;
        if (traveler.currentJourneyStatus) {
          status = (
            <i className={`icon ${traveler.currentJourneyStatus}`}>
              {traveler.currentJourneyStatus}
            </i>
          );
        }

        let firstLatters, fullName;
        if (traveler.firstName && traveler.lastName) {
          fullName = traveler.firstName + ' ' + traveler.lastName;
          firstLatters = traveler.firstName[0] + '' + traveler.lastName[0];
        } else {
          fullName = traveler.userName;
          firstLatters = traveler.userName[0] + ' ' + traveler.userName[1];
        }

        return (
          <li key={traveler._id.$oid} className={'traveler-' + traveler.currentJourneyStatus}>
            <NavLink to={`/traveler/${traveler._id.$oid}`} activeClassName='active'>
              {status}
              <strong>
                <span title={fullName} className='open-menu'>
                  {fullName}
                </span>
                <span className='close-menu'>
                  {firstLatters}
                </span>
                <TravelerMessageIcon travelerId={traveler._id.$oid} />
              </strong>
            </NavLink>
          </li>
        );
      });

      return (
        <div className='helpedTravelers'>
          <h4 className='open-menu'>{l('Help Status')}</h4>
          <h4 className='close-menu'>{l('Help')}</h4>
          <Scrollbars
            className='custom-scroll'
            autoHide style={{ height: `calc(100vh - 250px - ${config.layout.headerHeight}px)` }}>
            <ul className='helped-travelers-list'>
              {travelersList}
            </ul>
          </Scrollbars>
        </div>
      );
    }

    return null;
  }
}
export default ActiveTravelersList;
