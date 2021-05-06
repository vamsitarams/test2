import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

import CheckboxField from '../../components/forms/checkboxField';

export default class FlightsField extends React.Component {
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
    flightStatus: PropTypes.array.isRequired,
    flightsWithin: PropTypes.number.isRequired
  };

  onFlightStatusChange = value => {
    this.props.toggleArrFilterValue('flightStatus', value);
  };

  render () {
    const { l } = this.context.i18n;
    const {
      flightStatus,
      flightsWithin
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
        <h3 className='global-filter-field-cnt__title'>{l('Flights')}</h3>

        <div className='checkbox-group'>
          <div className='label-cnt'>
            <h4>{l('Flight status:')}</h4>
          </div>

          <div className='cust-cb'>
            <CheckboxField checkUpdate
              name='early'
              label={l('Early')}
              errorText=''
              defaultValue={flightStatus.indexOf('early') > -1}
              onChangeHandler={() => this.onFlightStatusChange('early')} />

            <CheckboxField checkUpdate
              name='ontime'
              label={l('Ontime')}
              errorText=''
              defaultValue={flightStatus.indexOf('ontime') > -1}
              onChangeHandler={() => this.onFlightStatusChange('ontime')} />

            <CheckboxField checkUpdate
              name='delayGreen'
              label={l('Delay ≤ 15 mins')}
              errorText=''
              defaultValue={flightStatus.indexOf('delayGreen') > -1}
              onChangeHandler={() => this.onFlightStatusChange('delayGreen')} />

            <CheckboxField checkUpdate
              name='delayYellow'
              label={l('Delay 16–45 mins')}
              errorText=''
              defaultValue={flightStatus.indexOf('delayYellow') > -1}
              onChangeHandler={() => this.onFlightStatusChange('delayYellow')} />

            <CheckboxField checkUpdate
              name='delayRed'
              label={l('Delay ≥ 45 mins')}
              errorText=''
              defaultValue={flightStatus.indexOf('delayRed') > -1}
              onChangeHandler={() => this.onFlightStatusChange('delayRed')} />

            <CheckboxField checkUpdate
              name='cancelled'
              label={l('Cancelled')}
              errorText=''
              defaultValue={flightStatus.indexOf('cancelled') > -1}
              onChangeHandler={() => this.onFlightStatusChange('cancelled')} />
          </div>
        </div>

        <div className='select-cnt'>
          <b className='select-cnt__label'>{l('Display flights with travelers within next')}</b>
          <Select
            clearable={false}
            value={flightsWithin}
            options={flightWithinOptions}
            onChange={a => this.props.changeFilterProp('flightsWithin', a.value)} />
        </div>
      </div>
    );
  }
}
