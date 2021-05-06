import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

import CheckboxField from '../../components/forms/checkboxField';

export default class AirportsField extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    disruptionStatus: PropTypes.array.isRequired,
    onlyVIP: PropTypes.bool.isRequired,
    onlyAssisting: PropTypes.bool.isRequired,
    changeFilterProp: PropTypes.func.isRequired,
    toggleArrFilterValue: PropTypes.func.isRequired,
    toggleFilterValue: PropTypes.func.isRequired,
    airportStatus: PropTypes.array.isRequired,
    airportsWithin: PropTypes.number.isRequired
  };

  onAirportsWithinChange = value => {
    this.props.toggleArrFilterValue('airportStatus', value);
  };

  render () {
    const { l } = this.context.i18n;
    const {
      airportStatus,
      airportsWithin
    } = this.props;
    const flightWithinOptions = [
      { value: 30, label: l('30 min') },
      { value: 60, label: l('60 min') },
      { value: 90, label: l('90 min') },
      { value: 180, label: l('3 hours') },
      { value: 360, label: l('6 hours') },
      { value: 720, label: l('12 hours') },
      { value: 1440, label: l('24 hours') },
      { value: 2160, label: l('36 hours') },
      { value: 2880, label: l('48 hours') }
    ];

    return (
      <div className='global-filter-field-cnt filter-card'>
        <h3 className='global-filter-field-cnt__title'>{l('Airports')}</h3>

        <div className='checkbox-group airport-within'>
          <div className='label-cnt'>
            <h4>{l('FAA status:')}</h4>
          </div>

          <div className='cust-cb'>
            <CheckboxField checkUpdate
              name='blackAirportStatus'
              label={l('Airport closed')}
              defaultValue={airportStatus.indexOf('black') > -1}
              onChangeHandler={() => this.onAirportsWithinChange('black')} />

            <CheckboxField checkUpdate
              name='redAirportStatus'
              label={l('General Arrival/Departure delays are > 45 mins')}
              defaultValue={airportStatus.indexOf('red') > -1}
              onChangeHandler={() => this.onAirportsWithinChange('red')} />

            <CheckboxField checkUpdate
              name='yellowAirportStatus'
              label={l('General Arrival/Departure delays are 16 – 45 mins')}
              defaultValue={airportStatus.indexOf('yellow') > -1}
              onChangeHandler={() => this.onAirportsWithinChange('yellow')} />

            <CheckboxField checkUpdate
              name='greenAirportStatus'
              label={l('General Arrival/Departure delays are < 15 mins')}
              defaultValue={airportStatus.indexOf('green') > -1}
              onChangeHandler={() => this.onAirportsWithinChange('green')} />
          </div>
        </div>

        <div className='select-cnt'>
          <b className='select-cnt__label'>{l('Display airports with travelers within next')}</b>
          <Select
            clearable={false}
            value={airportsWithin}
            options={flightWithinOptions}
            onChange={a => this.props.changeFilterProp('airportsWithin', a.value)} />
        </div>
      </div>
    );
  }
}
