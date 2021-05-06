import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'react-slick';
import { getFightStatus } from '../../helpers/timeline';

export class TimelineNotificationsSlider extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    notificationsList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  get slides () {
    const { l } = this.context.i18n;
    return this.props.notificationsList.map((item, index, notificationsList) => {
      const product = item.productRaw;
      const startDate = product.startsAt.$date;
      const endDate = product.endsAt.$date;
      const flightStatusObj = getFightStatus(product.latestEvent, startDate, endDate);
      let flightStatusMessage = '';

      switch (flightStatusObj.flightStatus) {
        case 'delayed':
          flightStatusMessage = `${l('Flight delay:')} ${flightStatusObj.delay}`;
          break;
        case 'canceled':
          flightStatusMessage = l('Flight canceled');
          break;
        case 'diverted':
          flightStatusMessage = l('Flight diverted');
          break;
      }
      return (
        <div key={index} className={`${flightStatusObj.travelerStatus}-bgcolor ${flightStatusObj.flightStatus}`}>
          <div className='holder'>
            <div className={`pull-left bold ${flightStatusObj.travelerStatus}-color`}>
              <span className={`icon ${flightStatusObj.travelerStatus}`} />{flightStatusMessage}
            </div>
            <div className='pull-right'>{index + 1}/{notificationsList.length}</div>
          </div>
          <div className='holder'>
            <div className='pull-left'>{item.eventLabel}</div>
            <div className='pull-right'>
              {this.getDate(product, flightStatusObj.flightStatus)}
            </div>
          </div>
        </div>);
    });
  }

  getDate (product, status) {
    const { getTimezoneTime } = this.context.i18n;
    const startDate = product.startsAt.$date;
    const endDate = product.endsAt.$date;
    const startTimeZone = product.startStation.timeZoneName;
    const endTimeZone = product.endStation.timeZoneName;
    const startDateDay = getTimezoneTime(startDate, 'MMM DD', startTimeZone);
    const startDateTime = getTimezoneTime(startDate, 'hh:mm A', startTimeZone);
    const endDateDay = getTimezoneTime(endDate, 'MMM DD', endTimeZone);
    const endDateTime = getTimezoneTime(endDate, 'hh:mm A', endTimeZone);
    const flifo = product.latestEvent.flifo;

    let startDateFormatted = (<span>{`${startDateDay}, ${startDateTime}`}</span>);
    let endDateFormatted = (<span>{`${endDateDay}, ${endDateTime}`}</span>);

    // Calc delay
    let delayedStartDateFormatted;
    let delayedEndDateFormatted;
    if (status !== 'canceled' && flifo.ETDDiff) {
      const delayedStartDate = startDate + flifo.ETDDiff * 60000;
      delayedStartDateFormatted = (
        <strong>
          {getTimezoneTime(delayedStartDate, 'MMM DD, hh:mm A', startTimeZone)}
        </strong>
      );
      if (startDateDay === getTimezoneTime(delayedStartDate, 'MMM DD', startTimeZone)) {
        startDateFormatted = (<span className='through'>{startDateTime}</span>);
      } else {
        startDateFormatted = (<span className='through'>{`${startDateDay}, ${startDateTime}`}</span>);
      }
    }

    if (status !== 'canceled' && flifo.ETADiff !== 0) {
      const delayedEndDate = endDate + flifo.ETADiff * 60000;
      delayedEndDateFormatted = (<strong>{getTimezoneTime(delayedEndDate, 'MMM DD, hh:mm A', endTimeZone)}</strong>);
      if (endDateDay === getTimezoneTime(delayedEndDate, 'MMM DD', endTimeZone)) {
        endDateFormatted = (<span className='through'>{endDateTime}</span>);
      } else {
        endDateFormatted = (<span className='through'>{`${endDateDay}, ${endDateTime}`}</span>);
      }
    }

    return (
      <span className='time-items'>
        {delayedStartDateFormatted} {startDateFormatted} - {delayedEndDateFormatted} {endDateFormatted}
      </span>
    );
  }

  render () {
    const { notificationsList } = this.props;
    const slideSettings = {
      dots: true,
      speed: 500,
      infinite: false,
      slidesToShow: 1
    };

    if (notificationsList.length > 1) {
      slideSettings.infinite = true;
    }

    return (
      <Slider {...slideSettings}>
        {this.slides}
      </Slider>
    );
  }
}
export default TimelineNotificationsSlider;
