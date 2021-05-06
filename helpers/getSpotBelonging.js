import whichPolygon from 'which-polygon';
import continents from '../config/continents.geo.json';
const continentsQuery = whichPolygon(continents);

const initialValues = {
  namerica: 0,
  samerica: 0,
  europe: 0,
  asia: 0,
  oceania: 0,
  africa: 0
};

export const computeSpotBelonging = (traveler) => {
  if (!traveler.geoLocation) return;

  const area = continentsQuery([
    traveler.geoLocation.longitude,
    traveler.geoLocation.latitude
  ]);

  return area ? area.name : null;
};

export const computeSpotsBelonging = (initValues, travelers) => {
  const numbers = Object.assign({}, initValues);

  const computed = travelers.reduce((numbers, traveler) => {
    if (!traveler.geoLocation) return numbers;
    const area = continentsQuery([
      traveler.geoLocation.longitude,
      traveler.geoLocation.latitude
    ]);

    if (area) numbers[area.name] = numbers[area.name] + 1;
    return numbers;
  }, numbers);

  return computed;
};

export default (travelers) => computeSpotsBelonging(initialValues, travelers);
