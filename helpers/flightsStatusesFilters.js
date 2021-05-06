import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import moment from 'moment';

const arrayHasSomeItems = (array, items) => {
  let hasOneItem = false;
  items.forEach((item) => {
    if (indexOf(array, item) !== -1) {
      hasOneItem = true;
    }
  });
  return hasOneItem;
};

export const flightsStatusesTimeframeFilter = (flightsStatuses, timeframe) => {
  const timePlus = moment().add(timeframe * 60, 'minutes').utc().valueOf();
  const filteredFlightsStatuses = flightsStatuses.map((departure) => {
    const destinations = departure.destinations.map((destination) => {
      const flights = destination.flights.filter((flight) => {
        return flight.departureLocation.estimatedDateTime.$date < timePlus;
      });
      return { ...destination, flights };
    });
    return { ...departure, destinations };
  });
  // console.log('filteredFlightsStatuses -> ' + JSON.stringify(filteredFlightsStatuses));
  return filteredFlightsStatuses;
};

// this code still be an issue (not filtering correct data)
export const flightsStatusesByTravelers = (flightsStatuses, travelers) => {
  console.log('flightsStatusesByTravelers');
  if (travelers.length) {
    const travelersIds = travelers.map((traveler) => traveler._id.$oid);
    // flightsStatuses = filter(flightsStatuses, (departure) => {
    const newFlightsStatuses = flightsStatuses.filter((departure) => {
      if (arrayHasSomeItems(travelersIds, departure.subscribersIds)) {
        departure.destinations = departure.destinations.filter((destination) => {
          if (arrayHasSomeItems(travelersIds, destination.subscribersIds)) {
            destination.flights = destination.flights.filter((flight) => {
              if (arrayHasSomeItems(travelersIds, flight.subscribersIds)) return true;
              else return false;
            });
            return true;
          } else return false;
        });
        return true;
      } else {
        return false;
      }
    });
    return newFlightsStatuses;
  } else {
    return [];
  }
};

export const flightsStatusesByTraveler = (flightsStatuses, traveler) => {
  const travelerId = traveler._id.$oid;
  if (flightsStatuses.length) {
    flightsStatuses = filter(flightsStatuses, (departure) => {
      if (indexOf(departure.subscribersIds, travelerId) !== -1) {
        return departure.destinations.filter((destination) => {
          if (indexOf(destination.subscribersIds, travelerId) !== -1) {
            return destination.flights.filter((flight) => {
              if (indexOf(flight.subscribersIds, travelerId) !== -1) {
                return flight;
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    });
    return flightsStatuses;
  } else {
    return [];
  }
};
