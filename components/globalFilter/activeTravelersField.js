import PropTypes from 'prop-types';
import React from 'react';

import CheckboxField from '../../components/forms/checkboxField';

export default class ActiveTravelersField extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    disruptionStatus: PropTypes.array.isRequired,
    onlyVIP: PropTypes.bool.isRequired,
    onlyAssisting: PropTypes.bool.isRequired,
    changeFilterProp: PropTypes.func.isRequired,
    toggleArrFilterValue: PropTypes.func.isRequired,
    toggleFilterValue: PropTypes.func.isRequired
  };

  onDistruptionChange = value => {
    this.props.toggleArrFilterValue('disruptionStatus', value);
  };

  render () {
    const { l } = this.context.i18n;
    const {
      disruptionStatus,
      onlyVIP,
      onlyAssisting
    } = this.props;

    return (
      <div className='global-filter-field-cnt filter-card'>
        <h3 className='global-filter-field-cnt__title'>{l('Active Traveler Field')}</h3>

        <div className='checkbox-group'>
          <div className='label-cnt'>
            <h4>{l('Disruption status:')}</h4>
          </div>

          <div className='cust-cb'>
            <CheckboxField checkUpdate
              name='red'
              label={l('Red')}
              defaultValue={disruptionStatus.indexOf('red') > -1}
              onChangeHandler={() => this.onDistruptionChange('red')} />

            <CheckboxField checkUpdate
              name='yellow'
              label={l('Yellow')}
              defaultValue={disruptionStatus.indexOf('yellow') > -1}
              onChangeHandler={() => this.onDistruptionChange('yellow')} />

            <CheckboxField checkUpdate
              name='green'
              label={l('Green')}
              defaultValue={disruptionStatus.indexOf('green') > -1}
              onChangeHandler={() => this.onDistruptionChange('green')} />
          </div>
        </div>

        <div className='checkbox-group'>
          <div className='label-cnt'>
            <h4>Travelers type: </h4>
          </div>

          <div className='cust-cb'>
            <CheckboxField checkUpdate
              name='onlyVip'
              label={l('Only Display VIP Travelers')}
              defaultValue={onlyVIP}
              onChangeHandler={() => this.props.toggleFilterValue('onlyVIP')} />

            <CheckboxField checkUpdate
              name='onlyAssisted'
              label={l('Only Display Travelers I Am Assisting')}
              defaultValue={onlyAssisting}
              onChangeHandler={() => this.props.toggleFilterValue('onlyAssisting')} />
          </div>
        </div>
      </div>
    );
  }
}
