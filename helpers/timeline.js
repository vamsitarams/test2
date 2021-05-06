import moment from 'moment-timezone';
import isEmpty from 'lodash/isEmpty';
import reverse from 'lodash/reverse';
import i18nTools from './i18nTools';
import config from '../config';

export function getPastEvents (arr) {
  const prevEventsNumber = 2;
  const dayAgo = moment().subtract(1, 'days').utc();
  const monthAgo = moment().subtract(1, 'months').utc();
  const lastDayEvents = [];
  const pastEvents = [];
  if (!arr || !arr.length) {
    return {
      lastDayEvents,
      pastEvents
    };
  }

  const reversedArr = reverse(arr);

  reversedArr.forEach((item) => {
    if (item.eventDateTime >= dayAgo && lastDayEvents.length < prevEventsNumber) {
      lastDayEvents.unshift(item);
    } else if (item.eventDateTime >= monthAgo) {
      pastEvents.unshift(item);
    }
  });

  return {
    lastDayEvents,
    pastEvents
  };
}

export function isExternalEventWithoutTime (event) {
  const productType = event && event.productRaw && event.productRaw.productType.toLowerCase().replace(/\s+/g, '-');
  return (
    event && event.productRaw && event.productRaw.source.toLowerCase() !== 'manual' &&
    (productType === 'car-rental' || productType === 'lodging' || productType === 'vehicle')
  );
}

export function addDelay (utc, minutes) {
  if (minutes !== 0) {
    const command = minutes > 0 ? 'add' : 'subtract';
    return moment(utc)[command](Math.abs(minutes), 'm').valueOf();
  }
  return utc;
}

export function getDelay (event) {
  let delayStart = 0;
  let delayEnd = 0;
  if (event.productRaw && event.productRaw.latestEvent && event.productRaw.latestEvent.flifo) {
    const flifo = event.productRaw.latestEvent.flifo;
    delayEnd = flifo.ETADiff ? flifo.ETADiff : delayEnd;
    delayStart = flifo.ETDDiff ? flifo.ETDDiff : delayStart;
  }
  return {
    delayStart,
    delayEnd
  };
}

export function separateEventsBk (events) {
  const now = moment().valueOf();
  const upcomingEvents = [];
  const pastEvents = [];
  let isUpcoming = false;
  let externalEventStartDay = false;
  let lastTimeZoneName = '';
  let lastEventDay = 0;
  let eventDay = false;
  let hasPrev = false;
  let currentDay = false;

  events.forEach((event, index, arr) => {
    event.activePosition = '';
    const externalEventWithoutTime = isExternalEventWithoutTime(event);
    const prev = (index - 1 >= 0) ? arr[index - 1] : null;
    const eventDate = event.eventDateTime;
    const { delayStart, delayEnd } = getDelay(event);
    const type = event.eventType.toLowerCase();

    lastTimeZoneName = event.timeZoneName ? event.timeZoneName : lastTimeZoneName;
    eventDay = i18nTools.getTimezoneTime(eventDate, 'DD', lastTimeZoneName);
    currentDay = i18nTools.getTimezoneTime(now, 'DD', lastTimeZoneName);
    lastEventDay = lastEventDay < parseInt(eventDay, 10) ? eventDay : lastEventDay;

    // Start and end dates for light and rail events
    let currentEventStart, currentEventEnd;
    if (type === 'flight' || type === 'rail' || externalEventWithoutTime) {
      currentEventStart = addDelay(event.productRaw.startsAt.$date, delayStart);
      currentEventEnd = addDelay(event.productRaw.endsAt.$date, delayEnd);

      // check if we have event with time after events without time
      let hasCurrentProduct = false;
      if (externalEventWithoutTime && !isUpcoming) {
        let nextEvents = [];
        if (events.length >= index + 1) {
          nextEvents = events.slice(index);
          hasCurrentProduct = nextEvents.filter((nextEvent) => {
            const { delayStart, delayEnd } = getDelay(nextEvent);
            const nextEventStart = addDelay(nextEvent.productRaw.startsAt.$date, delayStart);
            const nextEventEnd = addDelay(nextEvent.productRaw.endsAt.$date, delayEnd);
            return now >= nextEventStart && now <= nextEventEnd && !isExternalEventWithoutTime(nextEvent);
          }).length;
        }
      }
      if (
        (
          lastEventDay === currentDay &&
          externalEventWithoutTime &&
          (index === 0 || !hasCurrentProduct)
        ) ||
        (
          lastEventDay === currentDay &&
          now >= currentEventStart &&
          now <= currentEventEnd &&
          !hasCurrentProduct &&
          !hasPrev
        )
      ) {
        if (
          !isUpcoming ||
          (
            externalEventWithoutTime &&
            isUpcoming !== 'flight' &&
            isUpcoming !== 'rail' &&
            (!externalEventStartDay || externalEventStartDay === lastEventDay)
          )
        ) {
          event.activePosition = 'current';
          isUpcoming = type;
          externalEventStartDay = lastEventDay;
        }
      }
    }

    // Check if this is the closest upcoming event
    const prevEventDate = prev ? prev.eventDateTime : -Infinity;
    if (!isUpcoming && now < eventDate && now > prevEventDate && !externalEventWithoutTime) {
      event.activePosition = 'prev';
      isUpcoming = type;
      hasPrev = true;
    }

    // if it's the last event then draw line after the events
    if (!isUpcoming && index === (arr.length - 1)) {
      event.activePosition = 'next';
    }
    if (isUpcoming || (moment(eventDate).valueOf() >= now && externalEventWithoutTime)) {
      if (event.pastEvent) delete event.pastEvent;
      upcomingEvents.push(event);
    } else {
      event.pastEvent = true;
      pastEvents.push(event);
    }
  });
  return {
    pastEvents: pastEvents,
    upcomingEvents: upcomingEvents
  };
}

export function _dumpEvent (event) {
  console.log('- [%s-%s: %s: %s]: (%s-%s) [%s] - %s',
    event.eventType,
    event.eventLabel,
    event.waypointOrder,
    (isExternalEventWithoutTime(event) ? 'WOTIME' : 'TIME'),
    new Date(event.startTime),
    new Date(event.endTime),
    (Object.prototype.hasOwnProperty.call(event, 'pastEvent') ? 'PAST' : 'UPCOMING'),
    event.activePosition
  );
}

export function separateEvents (events) {
  const upcomingEvents = [];
  const pastEvents = [];
  let lastTimeZoneName = moment.tz.guess();
  let hasUpcomingEvent = false;
  const currentDate = moment();

  events.forEach((event, index, arr) => {
    const externalEventWithoutTime = isExternalEventWithoutTime(event);
    lastTimeZoneName = event.timeZoneName ? event.timeZoneName : lastTimeZoneName;
    const eventDateTime = moment(event.eventDateTime).tz(lastTimeZoneName);

    const prev = (index - 1 >= 0) ? arr[index - 1] : null;
    const type = event.eventType.toLowerCase();

    if (hasUpcomingEvent === false) {
      if ((type !== 'flight' && type !== 'rail') || externalEventWithoutTime === true) {
        event.startTime = eventDateTime.clone().startOf('day').valueOf();
        event.endTime = eventDateTime.clone().endOf('day').valueOf();

        if (currentDate.valueOf() < eventDateTime.valueOf()) {
          hasUpcomingEvent = true;
          event.activePosition = 'prev';
        } else if (
          currentDate.clone().tz(lastTimeZoneName).format('YYYY-MM-DD') ===
            eventDateTime.format('YYYY-MM-DD')
        ) {
          hasUpcomingEvent = true;
          event.activePosition = 'current';
        }
      } else {
        const { delayStart, delayEnd } = getDelay(event);
        event.startTime = addDelay(event.productRaw.startsAt.$date, delayStart);
        event.endTime = addDelay(event.productRaw.endsAt.$date, delayEnd);

        if (currentDate.valueOf() < event.startTime) {
          hasUpcomingEvent = true;
          event.activePosition = 'prev';
        } else if (currentDate.valueOf() < event.endTime) {
          hasUpcomingEvent = true;
          event.activePosition = 'current';
        }
      }
    } else {
      if (
        externalEventWithoutTime === true &&
        prev && Object.prototype.hasOwnProperty.call(prev, 'activePosition') &&
        prev.activePosition === 'current' &&
        currentDate.clone().tz(lastTimeZoneName).format('YYYY-MM-DD') === eventDateTime.format('YYYY-MM-DD')
      ) {
        event.activePosition = 'current';
      }
    }

    if (hasUpcomingEvent === true) {
      upcomingEvents.push(event);
    } else {
      event.pastEvent = true;
      pastEvents.push(event);
    }
  });

  return {
    pastEvents: pastEvents,
    upcomingEvents: upcomingEvents
  };
}

export function separateEvents3 (events) {
  const now = moment().valueOf();
  const upcomingEvents = [];
  const pastEvents = [];
  let lastTimeZoneName = '';
  let hasActivePosition = false;
  let isActiveWOTime = false;

  events.forEach((event, index, arr) => {
    const externalEventWithoutTime = isExternalEventWithoutTime(event);
    lastTimeZoneName = event.timeZoneName ? event.timeZoneName : lastTimeZoneName;

    const eventType = event.wpId.toString().split('-', 2)[1];
    const eventDateTime = moment(event.eventDateTime).tz(lastTimeZoneName);
    const prev = (index - 1 >= 0) ? arr[index - 1] : null;
    const next = (index + 1 <= arr.length) ? arr[index + 1] : null;

    if (externalEventWithoutTime === true) {
      event.startTime = eventDateTime.clone().startOf('day').valueOf();
      event.endTime = eventDateTime.clone().endOf('day').valueOf();

      if (prev && prev.endTime > event.startTime && !isExternalEventWithoutTime(prev)) {
        event.startTime = prev.endTime;
      }

      if (next && next.startTime < event.endTime && !isExternalEventWithoutTime(next)) {
        event.endTime = next.startTime;
      }
    } else {
      const { delayStart, delayEnd } = getDelay(event);
      event.startTime = addDelay(event.productRaw.startsAt.$date, delayStart);
      event.endTime = addDelay(event.productRaw.endsAt.$date, delayEnd);

      if (eventType === 'B' && prev && !isExternalEventWithoutTime(prev)) {
        const { delayEnd } = getDelay(prev);
        const endTimePrev = addDelay(prev.productRaw.endsAt.$date, delayEnd);
        if (endTimePrev > event.startTime) {
          event.startTime = endTimePrev;
        }
      }

      if (eventType === 'A' && havePointB(event) && next && !isExternalEventWithoutTime(next)) {
        const { delayStart } = getDelay(next);
        const startTimeNext = addDelay(next.productRaw.startsAt.$date, delayStart);
        if (startTimeNext < event.endTime) {
          event.endTime = startTimeNext;
        }
      }
    }
    if (event.endTime < now) {
      event.pastEvent = true;
      pastEvents.push(event);
    } else {
      if (
        hasActivePosition === false ||
        (hasActivePosition === true && isActiveWOTime === true && externalEventWithoutTime)
      ) {
        if (event.startTime < now && event.endTime > now) {
          event.activePosition = 'current';
          hasActivePosition = true;
          isActiveWOTime = externalEventWithoutTime;
        } else if (event.startTime >= now && prev && prev.endTime < now) {
          event.activePosition = 'prev';
          hasActivePosition = true;
          isActiveWOTime = externalEventWithoutTime;
        }
      }
      upcomingEvents.push(event);
    }
  });

  return {
    pastEvents: pastEvents,
    upcomingEvents: upcomingEvents
  };
}

export function havePointB (event) {
  const productType = event && event.productRaw && event.productRaw.productType.toLowerCase().replace(/\s+/g, '-');
  return (productType === 'car-rental' || productType === 'lodging' || productType === 'vehicle');
}

export const flightPrefixes = {
  scheduled: i18nTools.l('Scheduled'),
  inFlight: i18nTools.l('In flight'),
  landed: i18nTools.l('Landed'),
  upcoming: i18nTools.l('Upcoming'),
  canceled: i18nTools.l('Canceled'),
  diverted: i18nTools.l('Diverted')
};

export const travelerStatuses = {
  warn: 'warning',
  alarm: 'alarm',
  ok: 'ok'
};

export const flightSatuses = {
  onTime: 'onTime',
  delay: 'delayed',
  earlier: 'earlier',
  canceled: 'canceled',
  diverted: 'diverted'
};

export function getFightStatus (latestEventObj, startDate, endDate) {
  const result = {};
  // If no latest events - status is on time
  if (isEmpty(latestEventObj)) {
    const now = moment().utc();
    result.travelerStatus = travelerStatuses.ok;
    result.flightStatus = flightSatuses.onTime;
    let statusMessagePrefix = '';
    if (now >= startDate && now <= endDate) {
      statusMessagePrefix = flightPrefixes.inFlight;
    } else if (now < startDate) {
      statusMessagePrefix = flightPrefixes.upcoming;
    } else {
      statusMessagePrefix = flightPrefixes.landed;
    }
    result.statusMessage = `${statusMessagePrefix} - ${i18nTools.l('on time')}`;
    return result;
  }

  const flifo = latestEventObj.flifo;

  // Initialize required variables
  let shortMessage = '';
  if (flifo && flifo.displayText && flifo.displayText[0] &&
    flifo.displayText[0].shortText) {
    shortMessage = flifo.displayText[0].shortText;
  }

  let subAlertType = '';
  if (flifo && flifo.subAlertType) {
    subAlertType = flifo.subAlertType.toLowerCase();
  }

  let ETADiff = 0;
  let ETDDiff = 0;
  if (flifo && flifo.ETADiff) ETADiff = flifo.ETADiff;
  if (flifo && flifo.ETDDiff) ETDDiff = flifo.ETDDiff;

  let worstDiff = ETADiff;
  let worstDirection = '';
  if (Math.abs(ETDDiff) < Math.abs(ETADiff)) {
    worstDirection = 'arrival';
  }
  if (Math.abs(ETDDiff) > Math.abs(ETADiff)) {
    worstDiff = ETDDiff;
    worstDirection = 'departure';
  }

  let ETA = -Infinity;
  if (flifo && flifo.ETA && flifo.ETA.$date) {
    ETA = flifo.ETA.$date;
  }

  let ETD = -Infinity;
  if (flifo && flifo.ETD && flifo.ETD.$date) {
    ETD = flifo.ETD.$date;
  }

  const departureTime = startDate > ETD ? startDate : ETD;
  const arrivalTime = endDate > ETA ? endDate : ETA;
  const warnDelay = config.flightStatus.warningDelayStartMin;
  const alarmDelay = config.flightStatus.alarmDelayStartMin;
  const now = moment().utc();

  // Prepare data for canceled flight
  if (subAlertType === 'cancelled' || subAlertType === 'canceled') {
    return {
      flightStatus: flightSatuses.canceled,
      travelerStatus: travelerStatuses.alarm,
      statusMessage: flightPrefixes.canceled
    };
  }

  // Prepare data for diverted flights
  if (subAlertType === 'arrived-diverted' || subAlertType === 'inair-diverted' || subAlertType === 'landed-diverted' ||
    shortMessage === 'Arrived-Diverted' || shortMessage === 'In Flight-Diverted' ||
    shortMessage === 'Landed-Diverted') {
    result.travelerStatus = travelerStatuses.alarm;
    result.flightStatus = flightSatuses.diverted;
    let statusMessagePrefix = '';
    if ((now >= departureTime && now <= arrivalTime) || shortMessage === 'In Flight-Diverted') {
      statusMessagePrefix = flightPrefixes.inFlight;
    } else if (now < departureTime || shortMessage === 'Arrived-Diverted' || shortMessage === 'Landed-Diverted') {
      statusMessagePrefix = flightPrefixes.scheduled;
    } else {
      statusMessagePrefix = flightPrefixes.landed;
    }
    result.statusMessage = `${statusMessagePrefix} - ${flightPrefixes.diverted.toLowerCase()}`;
    return result;
  }

  // Prepare data for delaying flights
  if (worstDiff && worstDiff >= 0) {
    const delayStr = i18nTools.humanizeDuration(worstDiff, 'm', 'flight-delay');
    result.flightStatus = worstDiff >= warnDelay ? flightSatuses.delay : flightSatuses.onTime;
    result.travelerStatus = travelerStatuses.ok;
    if (worstDiff >= warnDelay) {
      result.travelerStatus = worstDiff > alarmDelay ? travelerStatuses.alarm : travelerStatuses.warn;
    }
    result.delay = delayStr;
    if ((now >= departureTime && now <= arrivalTime)) {
      result.statusMessage = `${flightPrefixes.inFlight} ${i18nTools.l('with delay')} ${delayStr}`;
    } else if (now < departureTime) {
      result.statusMessage = `${i18nTools.l('Delay:')} ${delayStr}`;
    } else {
      result.statusMessage = `${flightPrefixes.landed} ${i18nTools.l('with')} ${delayStr} ${i18nTools.l('delay')}`;
    }
    result.worstDirection = worstDirection;
    return result;
  }

  // Prepare data for flights with negative delay
  if (worstDiff && worstDiff < 0) {
    const delayStr = i18nTools.humanizeDuration(worstDiff, 'm', 'flight-delay').replace('-', '');
    result.flightStatus = flightSatuses.earlier;
    result.travelerStatus = travelerStatuses.ok;
    result.delay = delayStr;
    let statusMessagePrefix = '';
    if (now >= departureTime && now <= arrivalTime) {
      statusMessagePrefix = flightPrefixes.inFlight;
    } else if (now < departureTime) {
      statusMessagePrefix = flightPrefixes.scheduled;
    } else {
      statusMessagePrefix = flightPrefixes.landed;
    }
    result.worstDirection = worstDirection;
    result.statusMessage = `${statusMessagePrefix} ${i18nTools.l('arriving')} ${delayStr} ${i18nTools.l('earlier')}`;
    return result;
  }

  // All other flights are 'on time'
  result.flightStatus = flightSatuses.onTime;
  result.travelerStatus = travelerStatuses.ok;
  let statusMessagePrefix = '';
  if (now >= departureTime && now <= arrivalTime) {
    statusMessagePrefix = flightPrefixes.inFlight;
  } else if (now < departureTime) {
    statusMessagePrefix = flightPrefixes.upcoming;
  } else {
    statusMessagePrefix = flightPrefixes.landed;
  }
  result.statusMessage = `${statusMessagePrefix} ${i18nTools.l('on time')}`;

  return result;
}

export function isManual (event) {
  return event.source && event.source.toLowerCase() === 'manual';
}

export function getActiveTravelerTimeline (timelineEvents) {
  const { upcomingEvents, pastEvents } = separateEvents(timelineEvents);
  const currentUpcoming = upcomingEvents;
  const pastEvent = pastEvents.length ? [pastEvents[pastEvents.length - 1]] : [];
  // const pastEvent = pastEvents;

  return {
    pastEvent: pastEvent,
    currentUpcoming: currentUpcoming
  };
}

export function getAddressString (addressOptions) {
  const { address1, address2, city, state, zip, country, countryCode } = addressOptions;
  const address = [];
  if (address1) {
    let street = address1;
    if (address2) {
      street = `${address1} ${address2}`;
    }
    address.push(street);
  }
  if (city) {
    address.push(city);
  }
  if (state || zip) {
    const provinceItem = state || '';
    const postalCodeItem = zip || '';
    address.push(`${provinceItem} ${postalCodeItem}`);
  }

  if (country) {
    address.push(country);
  }

  if (!country && countryCode) {
    address.push(countryCode);
  }

  return address.join(', ');
}
