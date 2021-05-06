import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { isCompanyAdminOrUser } from '../../helpers/user';
import findIndex from 'lodash/findIndex';
import debounce from 'lodash/debounce';
import { createSelector } from 'reselect';
import FLIGHT_DATA from '../../config/data';

import {
  FS_SET_TRAVELERS_FLIGHTS_LIST,
  FS_LOAD_TRAVELERS_FLIGHTS_LIST,
  FS_SET_TRAVELERS_FLIGHTS_FILTER,
  FS_CLEAR_TRAVELERS_FLIGHTS_FILTER,
  FS_SWITCH_TRAVELERS_FLIGHTS_PAGE,
  FS_SET_TRAVELERS_FLIGHTS_META,
  FS_SET_TRAVELERS_FLIGHTS_FILTER_EMBEDDED,
  FS_SET_TRAVELERS_FLIGHTS_SORTER,
  FS_REQUEST_TRAVELERS_FLIGHTS_LIST_ERROR,
  PUSHER_UPDATE_TRAVELER_HELPEDBY,
  PUSHER_UPDATE_TRAVELER_LOADING,
  PUSHER_UPDATE_TRAVELER
} from '../constants';

const initialState = {
  travelersFlights: [],
  filter: {
    dateRangeType: 'Current',
    dateRangeStart: null,
    dateRangeEnd: null,
    status: {
      alarm: false,
      warning: false,
      ok: false
    },
    vip: false,
    nonHelped: false,
    company: [],
    carrier: [],
    airport: [],
    fstatus: [],
    costcenter_id: []
  },
  companies: [],
  carriers: [],
  airports: [],
  costCenters: [],
  loading: false,
  page: 1,
  pagesize: 2,
  totalPages: 1,
  totalFlights: 0,
  filteredFlights: 0,
  sortBy: '',
  alphabetical: true
};

// ------------------------------------
// Actions
// ------------------------------------
const travelersFlightsRequest = (dispatch, user, tfParams, showLoading = true) => {
  if (showLoading) {
    dispatch({ type: FS_LOAD_TRAVELERS_FLIGHTS_LIST });
  }
  const isCompanyAdminOrUserState = isCompanyAdminOrUser(user.roleName);
  return serverApi.getTravelersFlights(tfParams, isCompanyAdminOrUserState).then(function (result) {
    if (result.data && result.data.data) {
      console.log(result.data);
      dispatch({
        type: FS_SET_TRAVELERS_FLIGHTS_LIST,
        payload: FLIGHT_DATA.data
      });
      dispatch(setFlightStatusFilterEmbedded(result.data.embedded));
      dispatch(setTravelersFlightsMeta({
        totalPages: result.data.meta._total_pages,
        totalFlights: result.data.meta._total_size,
        filteredFlights: result.data.meta._size
      }));
    } else {
      throw new Error('Flight status: invalid response');
    }
    return result;
  }).catch(serverApi.catchErrors.bind(this, dispatch, FS_REQUEST_TRAVELERS_FLIGHTS_LIST_ERROR));
};

const internalEntireTravelersFlightsPagedRequest = (isCompanyAdminOrUserState, tfParams) => {
  return new Promise((resolve, reject) => {
    serverApi.getTravelersFlights(tfParams, isCompanyAdminOrUserState).then(function (result) {
      if (result.data && result.data.data) {
        resolve({
          data: result.data.data,
          meta: result.data.meta
        });
      } else {
        reject();
      }
    });
  });
};

const entireTravelersFlightsRequest = async (user, tfParams) => {
  const isCompanyAdminOrUserState = isCompanyAdminOrUser(user.roleName);
  const flights = [];

  tfParams.pagesize = 500;
  for (let i = 1; ; i++) {
    tfParams.page = i;

    const result = await internalEntireTravelersFlightsPagedRequest(isCompanyAdminOrUserState, tfParams);
    if (result.data && result.meta) {
      if (result.meta._returned > 0) {
        flights.push.apply(flights, result.data);
      } else {
        break;
      }

      if (i === result.meta._total_pages) {
        break;
      }
    } else {
      break;
    }
  }

  return flights;
};

export const loadTravelersFlights = () => {
  return (dispatch, getState) => {
    const state = getState();
    return travelersFlightsRequest(dispatch, state.user, state.flightsStatus);
  };
};

export const getEntireTravelersFlights = () => {
  return (dispatch, getState) => {
    const state = getState();
    return entireTravelersFlightsRequest(state.user, state.flightsStatus);
  };
};

const reloadDebounce = debounce((dispatch, state) => {
  travelersFlightsRequest(dispatch, state.user, state.flightsStatus);
}, 3000);
export const reloadTravelersFlights = (journeyUpdate) => {
  return (dispatch, getState) => {
    const state = getState();
    const pathname = (
      state.router.location && state.router.location.pathname || '/'
    );

    if (pathname === '/flights-status') {
      reloadDebounce(dispatch, state);
    } else {
      let hasFlights;
      if (
        state.flightsStatus &&
        Object.prototype.hasOwnProperty.call(state.flightsStatus, 'travelersFlights') &&
        state.flightsStatus.travelersFlights instanceof Array &&
        state.flightsStatus.travelersFlights.length > 0
      ) {
        hasFlights = state.flightsStatus.travelersFlights.filter((flight) => {
          return (
            flight.journeyId &&
            Object.prototype.hasOwnProperty.call(flight.journeyId, '$oid') &&
            journeyUpdate.data &&
            Object.prototype.hasOwnProperty.call(journeyUpdate.data, 'journeyId') &&
            flight.journeyId.$oid === journeyUpdate.data.journeyId
          );
        });
      }
      if (hasFlights && hasFlights instanceof Array && hasFlights.length > 0) {
        reloadDebounce(dispatch, state);
      }
    }
  };
};

export const setFlightStatusFilterEmbedded = createAction(
  FS_SET_TRAVELERS_FLIGHTS_FILTER_EMBEDDED,
  (embedded) => embedded
);
export const setTravelersFlightsMeta = createAction(FS_SET_TRAVELERS_FLIGHTS_META, (meta) => meta);
export const setTravelersFlightsSorter = (sortBy) => {
  return (dispatch, getState) => {
    const prevSortBy = getState().flightsStatus.sortBy;
    const alphabetical = prevSortBy === sortBy ? !getState().flightsStatus.alphabetical : true;
    dispatch({
      type: FS_SET_TRAVELERS_FLIGHTS_SORTER,
      payload: {
        alphabetical,
        sortBy
      }
    });
    const state = getState();
    travelersFlightsRequest(dispatch, state.user, state.flightsStatus);
  };
};

export const clearTravelersFlightsFilter = () => {
  return (dispatch, getState) => {
    dispatch({ type: FS_CLEAR_TRAVELERS_FLIGHTS_FILTER });
    dispatch({
      type: FS_SWITCH_TRAVELERS_FLIGHTS_PAGE,
      payload: 1
    });
    const state = getState();
    travelersFlightsRequest(dispatch, state.user, state.flightsStatus);
  };
};

export const setTravelersFlightsFilter = (filter) => {
  return (dispatch, getState) => {
    dispatch({
      type: FS_SWITCH_TRAVELERS_FLIGHTS_PAGE,
      payload: 1
    });
    dispatch({
      type: FS_SET_TRAVELERS_FLIGHTS_FILTER,
      payload: filter
    });
    const state = getState();
    travelersFlightsRequest(dispatch, state.user, state.flightsStatus);
  };
};

export const switchTravelersFlightsPage = (page) => {
  return (dispatch, getState) => {
    dispatch({
      type: FS_SWITCH_TRAVELERS_FLIGHTS_PAGE,
      payload: page
    });
    const state = getState();
    travelersFlightsRequest(dispatch, state.user, state.flightsStatus);
  };
};

export const actions = {
  loadTravelersFlights,
  reloadTravelersFlights,
  clearTravelersFlightsFilter,
  setTravelersFlightsFilter,
  switchTravelersFlightsPage,
  setTravelersFlightsSorter,
  getEntireTravelersFlights
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FS_SET_TRAVELERS_FLIGHTS_LIST]: (state, { payload }) => {
    return { ...state, travelersFlights: payload, loading: false };
  },
  [FS_LOAD_TRAVELERS_FLIGHTS_LIST]: (state) => {
    return { ...state, loading: true };
  },
  [FS_SET_TRAVELERS_FLIGHTS_FILTER]: (state, { payload }) => {
    return {
      ...state,
      filter: {
        ...payload
      }
    };
  },
  [FS_SWITCH_TRAVELERS_FLIGHTS_PAGE]: (state, { payload }) => {
    return { ...state, page: payload };
  },
  [FS_SET_TRAVELERS_FLIGHTS_SORTER]: (state, { payload }) => {
    return { ...state, alphabetical: payload.alphabetical, sortBy: payload.sortBy };
  },
  [FS_SET_TRAVELERS_FLIGHTS_META]: (state, { payload }) => {
    return {
      ...state,
      totalPages: payload.totalPages,
      totalFlights: payload.totalFlights,
      filteredFlights: payload.filteredFlights
    };
  },
  [FS_SET_TRAVELERS_FLIGHTS_FILTER_EMBEDDED]: (state, { payload }) => {
    return {
      ...state,
      companies: payload.companies || [],
      airports: payload.airports || [],
      carriers: payload.carriers || [],
      costCenters: payload.costCenters || []
    };
  },
  [PUSHER_UPDATE_TRAVELER_HELPEDBY]: (state, { payload }) => {
    const index = findIndex(state.travelersFlights, { subscriberId: { $oid: payload.travelerId } });
    if (index >= 0) {
      const travelerFlights = state.travelersFlights.map((travelerFlight) => {
        if (travelerFlight.subscriberId.$oid === payload.travelerId) {
          return {
            ...travelerFlight,
            helpedBy: payload.helpedBy
          };
        }
        return travelerFlight;
      });
      return {
        ...state,
        travelersFlights: [
          ...travelerFlights
        ]
      };
    } else {
      return { ...state };
    }
  },
  [PUSHER_UPDATE_TRAVELER_LOADING]: (state, { payload }) => {
    const index = findIndex(state.travelersFlights, { subscriberId: { $oid: payload } });
    if (index >= 0) {
      const travelerFlights = state.travelersFlights.map((travelerFlight) => {
        if (travelerFlight.subscriberId.$oid === payload) {
          return {
            ...travelerFlight,
            helpedBy: {
              ...travelerFlight.helpedBy,
              loading: true
            }
          };
        }
        return travelerFlight;
      });
      return {
        ...state,
        travelersFlights: [
          ...travelerFlights
        ]
      };
    } else {
      return { ...state };
    }
  },
  [FS_CLEAR_TRAVELERS_FLIGHTS_FILTER]: (state) => {
    return { ...state, filter: { ...initialState.filter } };
  },
  [FS_REQUEST_TRAVELERS_FLIGHTS_LIST_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [PUSHER_UPDATE_TRAVELER]: (state, { payload }) => {
    const id = payload._id.$oid;
    const index = findIndex(state.travelersFlights, { subscriberId: { $oid: id } });
    if (index !== -1) {
      const updatedTravelersFlights = state.travelersFlights.map((flight) => {
        const updatedFlight = { ...flight };
        if (flight.subscriberId.$oid === id) {
          updatedFlight.blockedStatus = payload.status;
        }
        return updatedFlight;
      });
      return {
        ...state,
        travelersFlights: updatedTravelersFlights
      };
    } else {
      return { ...state };
    }
  }
}, initialState);
// ------------------------------------
// Selector
// ------------------------------------
export const stateTravelersFlights = (state) => state.flightsStatus.travelersFlights;
export const stateTravelersFlightsFilter = (state) => state.flightsStatus.filter;
export const stateTravelersFlightsLoading = (state) => state.flightsStatus.loading;
export const stateTravelersFlightsPage = (state) => state.flightsStatus.page;
export const stateTravelersFlightsMeta = createSelector(
  (state) => state.flightsStatus.totalPages,
  (state) => state.flightsStatus.totalFlights,
  (state) => state.flightsStatus.filteredFlights,
  (totalPages, totalFlights, filteredFlights) => {
    return {
      totalPages,
      totalFlights,
      filteredFlights
    };
  }
);
export const stateTravelersFlightsFilterEmbedded = createSelector(
  (state) => state.flightsStatus.companies,
  (state) => state.flightsStatus.airports,
  (state) => state.flightsStatus.carriers,
  (state) => state.flightsStatus.costCenters,
  (companies, airports, carriers, costCenters) => {
    return {
      companies,
      airports,
      carriers,
      costCenters
    };
  }
);
export const stateTravelersFlightsSortBy = (state) => state.flightsStatus.sortBy;
export const stateTravelersFlightsSortByDirect = (state) => state.flightsStatus.alphabetical;
