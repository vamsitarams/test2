import PropTypes from 'prop-types';
import React from 'react';

import CheckboxField from '../../components/forms/checkboxField';
import RadioButtonsGroup from '../../components/forms/radioButtonsGroup';

export default class NotificationsFields extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    changeNotificationsProp: PropTypes.func.isRequired,
    toggleArrNotificationsValue: PropTypes.func.isRequired,
    toggleNotificationsValue: PropTypes.func.isRequired,
    assistedTravelers: PropTypes.bool.isRequired,
    newTravelersAll: PropTypes.bool.isRequired,
    newTravelersVIP: PropTypes.bool.isRequired,
    airportStatusChange: PropTypes.bool.isRequired,
    airportStatusChangeAll: PropTypes.bool.isRequired,
    newTravelers: PropTypes.bool.isRequired,
    airportStatusChangeWorse: PropTypes.bool.isRequired,
    flightStatusChange: PropTypes.array.isRequired,
    toggleFlightStatusChange: PropTypes.func.isRequired
  };

  flightStatusChangeHandler = value => {
    this.props.toggleArrNotificationsValue('flightStatusChange', value);
  };

  onChangeNewTravelersRadio = value => {
    this.props.changeNotificationsProp(value, true);
    this.props.changeNotificationsProp(
      value === 'newTravelersAll' ? 'newTravelersVIP' : 'newTravelersAll',
      false
    );
  };

  onAirportStatusChangeRadio = value => {
    this.props.changeNotificationsProp(value, true);
    this.props.changeNotificationsProp(
      value === 'airportStatusChangeAll' ? 'airportStatusChangeWorse' : 'airportStatusChangeAll',
      false
    );
  };

  render () {
    const { l } = this.context.i18n;
    const {
      assistedTravelers,
      newTravelers,
      newTravelersAll,
      newTravelersVIP,
      airportStatusChange,
      airportStatusChangeAll,
      airportStatusChangeWorse,
      flightStatusChange
    } = this.props;

    const newTravelersRadios = [{
      label: l('All Travelers'),
      value: 'newTravelersAll',
      checked: newTravelersAll
    }, {
      label: l('VIPs only'),
      value: 'newTravelersVIP',
      checked: newTravelersVIP
    }];

    const airportStatusChangeRadios = [{
      label: l('All Status Changes'),
      value: 'airportStatusChangeAll',
      checked: airportStatusChangeAll
    }, {
      label: l('Only where status change gets worse'),
      value: 'airportStatusChangeWorse',
      checked: airportStatusChangeWorse
    }];

    return (
      <div className='grid-container'>
        <div className='filter-card notification-card'>
        <h3 className='global-filter-field-cnt__title'>{l('Show Notifications for:')}</h3>
        <div className='checkbox-group checkbox-group_cols'>
          <div className='cust-cb'>
            <CheckboxField checkUpdate
              name='assistedTravelers'
              label={l('Message(s) from Assisted Traveler')}
              defaultValue={assistedTravelers}
              onChangeHandler={() => this.props.toggleNotificationsValue('assistedTravelers')} />

            <CheckboxField checkUpdate
              name='newTravelers'
              label={l('New Traveler in the List')}
              defaultValue={newTravelers}
              onChangeHandler={() => this.props.toggleNotificationsValue('newTravelers')} />
          </div>

          <div className='radio-cnt'>
            <RadioButtonsGroup disabled={!newTravelers} updateChecked
              name='newTravelersRadio'
              fields={newTravelersRadios}
              onRadioGroupChange={this.onChangeNewTravelersRadio} />
          </div>
        </div>
                <div className='checkbox-group checkbox-group_cols'>
          <div className='cust-cb'>
            <CheckboxField checkUpdate
              name='airportStatusChange'
              label={l('Airports Status Change')}
              defaultValue={airportStatusChange}
              onChangeHandler={() => this.props.toggleNotificationsValue('airportStatusChange')} />
          </div>
          <div className='radio-cnt'>
            <RadioButtonsGroup disabled={!airportStatusChange} updateChecked
              name='airportStatusChangeRadio'
              fields={airportStatusChangeRadios}
              onRadioGroupChange={this.onAirportStatusChangeRadio} />
          </div>
        </div>

        <div className='checkbox-group checkbox-group_cols airport-within'>
          <div className='cust-cb'>
            <CheckboxField checkUpdate
              name='flightStatusChange'
              label={l('Flight Status Change')}
              defaultValue={!!flightStatusChange.length}
              onChangeHandler={this.props.toggleFlightStatusChange} />
            <div className='sub-checkbox-group'>
              <div className='child-label'>
              <CheckboxField checkUpdate
                name='flightStatusChangeAll'
                label={l('All Status Changes')}
                defaultValue={flightStatusChange.indexOf('all') > -1}
                onChangeHandler={() => this.flightStatusChangeHandler('all')} />
                <CheckboxField checkUpdate
                name='flightStatusChangeEarly'
                label={l('Early')}
                defaultValue={flightStatusChange.indexOf('early') > -1}
                onChangeHandler={() => this.flightStatusChangeHandler('early')} />

              <CheckboxField checkUpdate
                name='flightStatusChangeOntime'
                label={l('Ontime')}
                defaultValue={flightStatusChange.indexOf('ontime') > -1}
                onChangeHandler={() => this.flightStatusChangeHandler('ontime')} />

              <CheckboxField checkUpdate
                name='flightStatusChangeDelayGreen'
                label={l('≤ 15 mins')}
                defaultValue={flightStatusChange.indexOf('delayGreen') > -1}
                onChangeHandler={() => this.flightStatusChangeHandler('delayGreen')} />

              <CheckboxField checkUpdate
                name='flightStatusChangeAllDelayYellow'
                label={l('16–45 mins')}
                defaultValue={flightStatusChange.indexOf('delayYellow') > -1}
                onChangeHandler={() => this.flightStatusChangeHandler('delayYellow')} />

              <CheckboxField checkUpdate
                name='flightStatusChangeAllDelayRed'
                label={l('≥ 45 mins')}
                defaultValue={flightStatusChange.indexOf('delayRed') > -1}
                onChangeHandler={() => this.flightStatusChangeHandler('delayRed')} />

              <CheckboxField checkUpdate
                name='flightStatusChangeAllCancelled'
                label={l('Canceled')}
                defaultValue={flightStatusChange.indexOf('cancelled') > -1}
                onChangeHandler={() => this.flightStatusChangeHandler('cancelled')} />
              </div>
            </div>
          </div>
        </div>
        </div>

      </div>
    );
  }
}
