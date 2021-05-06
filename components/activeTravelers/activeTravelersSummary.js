import PropTypes from 'prop-types';
import React from 'react';
import filter from 'lodash/filter';

export class ActiveTravelersSummary extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    activeTravelers: PropTypes.array.isRequired
  };

  render () {
    const { l } = this.context.i18n;
    const { activeTravelers } = this.props;
    const nonBlockedActiveTravelers = filter(activeTravelers, { status: 'active' });
    let alarm = 0;
    let warning = 0;
    let ok = 0;

    nonBlockedActiveTravelers.forEach((traveler) => {
      switch (traveler.currentJourneyStatus) {
        case 'alarm':
          alarm++;
          break;
        case 'warning':
          warning++;
          break;
        case 'ok':
          ok++;
          break;
      }
    });
    return (
      <ul className='status-list'>
        <li><strong>{l('Total:')} {nonBlockedActiveTravelers.length}</strong>{'   '}</li>
        <li><i className='icon alarm'>alarm</i>{alarm}{'   '}</li>
        <li><i className='icon warning'>warning</i>{warning}{'   '}</li>
        <li><i className='icon ok'>ok</i>{ok}{'   '}</li>
      </ul>
    );
  }
}
export default ActiveTravelersSummary;
