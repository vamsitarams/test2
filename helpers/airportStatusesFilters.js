import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import moment from 'moment';

export const airportStatusesStatusFilter = (airportStatuses, status) => {
  let filteredAirportStatuses = false;
  if (status) {
    filteredAirportStatuses = filter(airportStatuses, (airport) => {
      const color = airport.status && airport.status.color ? airport.status.color : 'none';
      if (status === color) {
        return true;
      }
      return false;
    });
  }
  return filteredAirportStatuses || airportStatuses;
};

export const availableAirportTimeframes = (availableTimeframes, airportStatuses) => {
  const filteredAvailableTimeframes = filter(availableTimeframes, (timeframe) => {
    const timePlus = moment().add(timeframe * 60, 'minutes').utc().valueOf();
    const filteredAirportStatuses = filter(map(airportStatuses, (airport) => {
      const travelersIn = airport.travelers.filter((traveler) => {
        return traveler.departureDateTime.$date <= timePlus;
      });
      if (travelersIn.length) {
        return { ...airport, travelersIn };
      }
      return false;
    }), item => item);
    return !!filteredAirportStatuses.length;
  });
  return filteredAvailableTimeframes;
};

export const airportStatusesTimeframeFilter = (airportStatuses, timeframe) => {
  let filteredAirportStatuses = false;
  if (timeframe) {
    const timePlus = moment().add(timeframe * 60, 'minutes').utc().valueOf();
    filteredAirportStatuses = filter(map(airportStatuses, (airport) => {
      const travelersIn = airport.travelers.filter((traveler) => {
        return traveler.departureDateTime.$date <= timePlus;
      });
      if (travelersIn.length) {
        return { ...airport, travelersIn };
      }
      return false;
    }), item => item);
  }
  return filteredAirportStatuses || airportStatuses;
};

export const availableStatusesFilter = (availableStatuses, airportStatuses) => {
  if (airportStatuses.length) {
    const filteredAirportStatuses = filter(availableStatuses, (status) => {
      const statusExist = airportStatuses.filter((airport) => {
        const color = airport.status && airport.status.color ? airport.status.color : 'none';
        return color === status;
      });
      return !!statusExist.length;
    });
    return filteredAirportStatuses;
  }
  return [];
};

export const airportStatusesByTravelers = (airportStatuses, travelers) => {
  let filteredAirportStatuses = false;
  if (travelers.length) {
    const travelersIds = travelers.map((traveler) => traveler._id.$oid);
    filteredAirportStatuses = filter(map(airportStatuses, (airport) => {
      const travelersIn = airport.travelers.filter((traveler) => {
        return indexOf(travelersIds, traveler._id.$oid) >= 0;
      });
      if (travelersIn.length) {
        return { ...airport, travelersIn };
      }
      return false;
    }), item => item);
    return filteredAirportStatuses || airportStatuses;
  } else {
    return [];
  }
};

export const airportStatusesByTraveler = (airportStatuses, traveler) => {
  return filter(airportStatuses, (airport) => {
    const airportIds = airport.travelers.map((traveler) => traveler._id.$oid);
    if (indexOf(airportIds, traveler._id.$oid) >= 0) {
      return true;
    }
    return false;
  });
};

export const getAvailableAirportStatuses = (stateAirportStatuses) => {
  let availableStatuses = [];
  if (stateAirportStatuses.length) {
    availableStatuses = map(stateAirportStatuses, (airport) => {
      const color = airport.status && airport.status.color ? airport.status.color : 'none';
      return color;
    });
    availableStatuses = uniq(availableStatuses);
  }
  return availableStatuses;
};
