import Jed from 'jed';
import moment from 'moment-timezone';
import 'moment-duration-format';
import { sprintf } from './utils';
const timezones = require('../config/timezones.json');

export default class Tools {
  constructor ({ localeData, locale }) {
    this.jed = new Jed(localeData);
    this.locale = locale;
  }

  l = (text) => {
    return this.jed.gettext(text);
  };

  ngettext = (singular, plural, amount) => {
    return this.jed.ngettext(singular, plural, amount);
  };

  getLocale = () => {
    return this.locale;
  };

  getTimeFromNow = (date) => {
    moment.locale(this.locale, {
      relativeTime: {
        future: this.l('new'),
        past: this.l('%s'),
        s: this.l('30s'),
        m: this.l('1m'),
        mm: this.l('%dm'),
        h: this.l('1h'),
        hh: this.l('%dh'),
        d: this.l('1d'),
        dd: this.l('%dd'),
        M: this.l('1m'),
        MM: this.l('%dm'),
        y: this.l('1y'),
        yy: this.l('%dy')
      }
    });

    return moment(date).fromNow();
  };

  getTimezoneDescription = (utc, tzName) => {
    let desc = timezones[tzName];
    if (desc) {
      tzName = tzName.replace(/\s+/g, '_');
      desc += '\nUTC ' + moment(utc).tz(tzName).format('Z');
    }
    return desc;
  };

  getTimezoneTime = (utc, format, tzName) => {
    let date;
    moment.locale(this.locale);
    if (!tzName) {
      date = moment(utc).local().format(format);
    } else {
      tzName = tzName.replace(/\s+/g, '_');
      date = moment(utc).tz(tzName).format(format);
    }
    return date;
  };

  getTimezoneTimeInterval = (startUtc, startTz = '', endUtc, endTz = '') => {
    moment.locale(this.locale);
    const fullFormat = 'MMM D, YYYY';
    startTz = startTz.replace(/\s+/g, '_');
    endTz = endTz.replace(/\s+/g, '_');
    let startDate, endDate;
    if (startTz && endTz) {
      startDate = moment(startUtc).tz(startTz);
      endDate = moment(endUtc).tz(endTz);
    } else {
      startDate = moment(startUtc);
      endDate = moment(endUtc);
    }
    if (startDate.year() !== endDate.year()) {
      return `
        ${this.getTimezoneTime(startUtc, fullFormat, startTz)} - ${this.getTimezoneTime(endUtc, fullFormat, endTz)}
      `;
    } else if (startDate.month() !== endDate.month()) {
      return `
        ${this.getTimezoneTime(startUtc, 'MMM D', startTz)} - ${this.getTimezoneTime(endUtc, fullFormat, endTz)}
      `;
    } else if (startDate.date() !== endDate.date()) {
      return `
        ${this.getTimezoneTime(startUtc, 'MMM D', startTz)} - ${this.getTimezoneTime(endUtc, ' D, YYYY', endTz)}
      `;
    } else {
      return this.getTimezoneTime(startUtc, fullFormat, startTz);
    }
  }

  humanizeDuration = (time, unit, format) => {
    moment.locale(this.locale);
    let result;
    const duration = moment.duration(time, unit);

    const hours = duration.hours();
    const hoursString = hours ? sprintf('%dh', hours) : '';

    const minutes = duration.minutes();
    const minutesString = minutes ? sprintf('%dmin', minutes) : '';

    const days = duration.days();
    const daysString = days ? sprintf('%ddays', days) : '';

    result = `${daysString} ${hoursString} ${minutesString}`;

    if (format === 'flight-delay') {
      const hour = 60;
      if (
        (time < hour && time >= 0) ||
        (time > -hour && time < 0)
      ) {
        const min = this.l('min');
        result = duration.format(`m [${min}]`);
      } else {
        const m = this.l('m');
        const h = this.l('h');
        result = duration.format(`h[${h}] m[${m}]`);
        const trimIndex = result.indexOf(` 0${m}`);
        if (trimIndex !== -1) {
          result = result.substring(0, trimIndex);
        }
      }
    }

    return result;
  };
}
