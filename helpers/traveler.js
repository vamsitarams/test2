import i18nTools from '../helpers/i18nTools';
const { getTimezoneTime } = i18nTools;

export const STATUS_ACTIVE = 'active';
export const STATUS_BLOCKED = 'blocked';

export function isBlocked (traveler) {
  return (
    traveler &&
    Object.prototype.hasOwnProperty.call(traveler, 'status') &&
    traveler.status === STATUS_BLOCKED
  );
}

export function timeInCountry (countryCode, products) {
  if (products && products.length) {
    let startDate = '';
    let endDate = '';

    products.forEach(product => {
      const stLng = (stationName) => {
        const lng = (
          product &&
          product[stationName] &&
          product[stationName].language
        );
        return lng && (lng.find(l => l.type === 'en_us') || lng.find(l => l.type === 'default'));
      };

      const location = (lng) => {
        return lng && lng.locations && lng.locations.find(l => l.countryCode);
      };

      const esLng = stLng('endStation');
      const eLocation = location(esLng);
      const ssLng = stLng('startStation');
      const sLocation = location(ssLng);

      if (
        product.productType === 'Lodging' &&
        !startDate &&
        !endDate &&
        product.startStation &&
        (sLocation && sLocation.countryCode === countryCode)
      ) {
        startDate = getTimezoneTime(product.startsAt.$date, 'MMM Do', product.startStation.timeZoneName) + ' -';
        endDate = getTimezoneTime(product.endsAt.$date, 'MMM Do, YYYY', product.startStation.timeZoneName);
      } else {
        if (
          !startDate &&
          product.endStation &&
          (eLocation && eLocation.countryCode && eLocation.countryCode === countryCode) &&
          (sLocation && sLocation.countryCode && sLocation.countryCode !== countryCode)
        ) {
          startDate = getTimezoneTime(product.endsAt.$date, 'MMM Do', product.endStation.timeZoneName) + ' -';
        } else if (
          !endDate &&
          product.startStation &&
          (eLocation && eLocation.countryCode && eLocation.countryCode !== countryCode) &&
          (sLocation && sLocation.countryCode && sLocation.countryCode === countryCode)
        ) {
          endDate = getTimezoneTime(product.startsAt.$date, 'MMM Do, YYYY', product.startStation.timeZoneName);
        }
      }
    });

    return `${startDate} ${endDate}`;
  }
  return '';
}
