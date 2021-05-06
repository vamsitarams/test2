import Jed from 'jed';
import config from '../config';

export function getSupportedLocales () {
  return Object.keys(config.locale.supportedLocales);
}

export function getSupportedLanguages () {
  return config.locale.supportedLocales;
}

export function sprintf (text, ...params) {
  return Jed.sprintf(text, ...params);
}
