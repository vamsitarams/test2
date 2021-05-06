import PropTypes from 'prop-types';
import React from 'react';

export class TrainStationInfo extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    type: PropTypes.string.isRequired,
    station: PropTypes.object.isRequired,
    date: PropTypes.number.isRequired
  };

  get stationName () {
    const { l } = this.context.i18n;
    const station = this.props.station;
    const label = this.props.type === 'departure' ? l('Departure station') : l('Arrival station');
    if (station &&
      station.language &&
      station.language[0] &&
      station.language[0].locations &&
      station.language[0].locations[0]) {
      const name = station.language[0].name ? '- ' + station.language[0].name : null;
      const { city, stateProvinceCode } = station.language[0].locations[0];
      const stationName = stateProvinceCode ? (<strong>{city}, {stateProvinceCode} {name}</strong>)
        : (<span>{city} {name}</span>);
      return (
        <dl>
          <dt>{label}</dt>
          <dd>{stationName}</dd>
        </dl>
      );
    }
  }

  get date () {
    const { l, getTimezoneTime } = this.context.i18n;
    let date = this.props.date;
    const tz = this.props.station.timeZoneName;

    date = getTimezoneTime(date, 'MMM DD, hh:mm A', tz);
    const label = this.props.type === 'departure' ? l('Departure') : l('Arrival');
    return (
      <dl>
        <dt>{label}</dt>
        <dd>{date}</dd>
      </dl>
    );
  }

  render () {
    return (
      <div className='flight-place-info'>
        {this.date}
        {this.stationName}
      </div>
    );
  }
}
export default TrainStationInfo;
