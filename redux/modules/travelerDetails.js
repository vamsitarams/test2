import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
// import { push } from 'connected-react-router';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';
import { isCompanyAdminOrUser } from '../../helpers/user';
import serverApi from '../../helpers/serverApi';
import { actions as notificationActions } from './notification';
import i18nTools from '../../helpers/i18nTools';
import ACTIVE_DATA from '../../config/Activedata';
import Data from '../../../src/helpers/dummydata'
import {
  PUSHER_UPDATE_TRAVELER_CASE,
  PUSHER_UPDATE_TRAVELER_HELPEDBY,
  PUSHER_UPDATE_TRAVELER_LAST_MESSAGE,
  PUSHER_UPDATE_TRAVELER_LOADING,
  TD_REQUEST_TRAVELER,
  TD_SET_TRAVELER,
  TD_CHANGE_TRAVELER_ONLINE_STATUS,
  TD_REQUEST_TRAVELER_ERROR,
  TD_TRAVELER_SWITCH_MAP_VIEW,
  TD_REQUEST_TRAVELER_CASE_HISTORY,
  TD_SET_TRAVELER_CASE_HISTORY,
  TD_TRAVELER_CASE_HISTORY_ERROR,
  TD_REQUEST_FOR_UPDATE_TRAVELER_CASE,
  TD_SET_TRAVELER_FLIGHTS,
  TD_SET_TRAVELER_FLIGHTS_SORTER,
  TD_REQUEST_TRAVELER_FLIGHTS,
  TD_REQUEST_TRAVELER_FLIGHTS_ERROR,
  PUSHER_UPDATE_TRAVELER,
  TD_REQUEST_TRAVELER_ADVISORY,
  TD_SET_TRAVELER_ADVISORY,
  TD_TRAVELER_ADVISORY_ERROR,
  TD_SEND_INVITATION
} from '../constants';

const initialState = {
  traveler: {},
  loading: false,
  onlineStatus: false,
  caseHistory: {
    cases: [],
    loading: false,
    editingCase: false
  },
  map: {
    mapView: 'locations'
  },
  travelAdvisory: {
    countryStatuses: {},
    travelerProducts: [],
    loading: false
  },
  flightsStatus: {
    travelerFlights: [],
    sortBy: '',
    alphabetical: true,
    loading: false
  }
};

// ------------------------------------
// Actions
// ------------------------------------
export const setTraveler = createAction(TD_SET_TRAVELER, (traveler) => traveler);
export const travelerSwitchMapView = createAction(TD_TRAVELER_SWITCH_MAP_VIEW, (mapView = 'locations') => mapView);
export const setTravelerFlights = createAction(TD_SET_TRAVELER_FLIGHTS, (travelerFlights) => travelerFlights);
export const changeTravelerOnlineStatus = createAction(
  TD_CHANGE_TRAVELER_ONLINE_STATUS,
  (onlineStatus) => onlineStatus
);
export const travelerUpdateLastMessage = createAction(
  PUSHER_UPDATE_TRAVELER_LAST_MESSAGE,
  (traveler) => traveler
);

export const requestTraveler = (id) => {
  return (dispatch) => {
    dispatch({ type: TD_REQUEST_TRAVELER });
    dispatch(setTraveler(ACTIVE_DATA.data[0]));
    console.log(id);
    // serverApi.getTraveler({ subscriberId: id }).then(function (result) {
    //   if (result.data && result.data.data) {
    //     dispatch(setTraveler(result.data.data[0]));
    //   }
    //   return result;
    // }).catch((result) => {
    //   if (result.status >= 400) {
    //     // dispatch(push('/404'));
    //     return;
    //   }
    //   serverApi.catchErrors(dispatch, TD_REQUEST_TRAVELER_ERROR, result);
    // });
    dispatch(setTraveler(Data['traveler'].data.data[0]));
  };
};

export const sendInvitation = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TD_SEND_INVITATION });
    dispatch(notificationActions.showNotification({
      message: i18nTools.l('Invitation sent'),
      level: 'success'
    }));
    serverApi.sendInvitationToTraveler(id).then(function (result) {
      // will update invitation information from pusher
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TD_REQUEST_TRAVELER_ERROR));
  };
};

const requestTravelerFlights = (dispatch, user, id, tfParams, showLoading = true) => {
  if (showLoading) {
    dispatch({ type: TD_REQUEST_TRAVELER_FLIGHTS });
  }
  const isCompanyAdminOrUserState = isCompanyAdminOrUser(user.roleName);
  return serverApi.getSingleTravelerFlights(id, tfParams, isCompanyAdminOrUserState).then(function (result) {
    if (result.data && result.data.data) {
      dispatch(setTravelerFlights(result.data.data));
    }
    return result;
  }).catch(serverApi.catchErrors.bind(this, dispatch, TD_REQUEST_TRAVELER_FLIGHTS_ERROR));
};

export const loadTravelerFlights = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    requestTravelerFlights(dispatch, state.user, id, state.travelerDetails.flightsStatus);
  };
};

export const loadTravelerAdvisory = (subscriberId) => {
  return (dispatch, getState) => {
    dispatch({ type: TD_REQUEST_TRAVELER_ADVISORY });
    serverApi.getTravelAdvisory({ subscriberId }).then((result) => {
      if (result.data) {
        dispatch({
          type: TD_SET_TRAVELER_ADVISORY,
          payload: result.data
        });
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TD_TRAVELER_ADVISORY_ERROR));
  };
};

export const reloadTravelerFlights = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    const td = state.travelerDetails;
    if (td.traveler && td.traveler._id && td.traveler._id.$oid === id) {
      requestTravelerFlights(dispatch, state.user, id, td.flightsStatus, false);
    }
  };
};

export const setTravelerFlightsSorter = (sortBy) => {
  return (dispatch, getState) => {
    const prevSortBy = getState().travelerDetails.flightsStatus.sortBy;
    const alphabetical = prevSortBy === sortBy ? !getState().travelerDetails.flightsStatus.alphabetical : true;
    dispatch({
      type: TD_SET_TRAVELER_FLIGHTS_SORTER,
      payload: {
        alphabetical,
        sortBy
      }
    });
    const id = getState().travelerDetails.traveler._id.$oid;
    const tfParams = getState().travelerDetails.flightsStatus;
    requestTravelerFlights(dispatch, getState().user, id, tfParams);
  };
};

export const requestTravelerCaseHistory = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TD_REQUEST_TRAVELER_CASE_HISTORY });
    serverApi.getTravelerCaseHistory(id).then(function (result) {
      if (result.data && result.data.data) {
        dispatch({
          type: TD_SET_TRAVELER_CASE_HISTORY,
          payload: result.data.data
        });
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TD_TRAVELER_CASE_HISTORY_ERROR));
  };
};

export const actions = {
  setTraveler,
  requestTraveler,
  requestTravelerCaseHistory,
  travelerSwitchMapView,
  loadTravelerFlights,
  reloadTravelerFlights,
  setTravelerFlightsSorter,
  travelerUpdateLastMessage,
  changeTravelerOnlineStatus,
  loadTravelerAdvisory,
  sendInvitation
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TD_REQUEST_TRAVELER]: (state) => {
    return {
      ...state,
      traveler: {},
      caseHistory: initialState.caseHistory,
      flightsStatus: initialState.flightsStatus,
      loading: true
    };
  },
  [TD_REQUEST_TRAVELER_ADVISORY]: (state) => {
    return {
      ...state,
      travelAdvisory: {
        ...state.travelAdvisory,
        loading: true
      }
    };
  },
  [TD_TRAVELER_ADVISORY_ERROR]: (state) => {
    return {
      ...state,
      travelAdvisory: {
        ...state.travelAdvisory,
        loading: false
      }
    };
  },
  [TD_SET_TRAVELER_ADVISORY]: (state, { payload }) => {
    return {
      ...state,
      travelAdvisory: {
        ...payload,
        loading: false
      }
    };
  },
  [TD_SET_TRAVELER]: (state, { payload }) => {
    return { ...state, traveler: payload };
  },
  [TD_CHANGE_TRAVELER_ONLINE_STATUS]: (state, { payload }) => {
    return { ...state, onlineStatus: payload };
  },
  [TD_TRAVELER_SWITCH_MAP_VIEW]: (state, { payload }) => {
    return {
      ...state,
      map: {
        ...state.map,
        mapView: payload
      }
    };
  },
  [TD_REQUEST_TRAVELER_CASE_HISTORY]: (state) => {
    return {
      ...state,
      caseHistory: {
        ...state.caseHistory,
        loading: true
      }
    };
  },
  [TD_REQUEST_FOR_UPDATE_TRAVELER_CASE]: (state) => {
    return {
      ...state,
      caseHistory: {
        ...state.caseHistory,
        loading: true
      }
    };
  },
  [TD_TRAVELER_CASE_HISTORY_ERROR]: (state) => {
    return {
      ...state,
      caseHistory: {
        ...state.caseHistory,
        loading: false
      }
    };
  },
  [TD_SET_TRAVELER_CASE_HISTORY]: (state, { payload }) => {
    return {
      ...state,
      caseHistory: {
        ...state.caseHistory,
        cases: payload,
        loading: false
      }
    };
  },
  [PUSHER_UPDATE_TRAVELER_LOADING]: (state, { payload }) => {
    if (state.traveler._id && state.traveler._id.$oid === payload) {
      return {
        ...state,
        traveler: {
          ...state.traveler,
          helpedBy: {
            ...state.traveler.helpedBy,
            loading: true
          }
        },
        caseHistory: {
          ...state.caseHistory,
          loading: true
        }
      };
    } else {
      return { ...state };
    }
  },
  [PUSHER_UPDATE_TRAVELER_HELPEDBY]: (state, { payload }) => {
    if (state.traveler._id && state.traveler._id.$oid === payload.travelerId) {
      return {
        ...state,
        traveler: {
          ...state.traveler,
          helpedBy: payload.helpedBy
        }
      };
    } else {
      return { ...state };
    }
  },
  [PUSHER_UPDATE_TRAVELER_LAST_MESSAGE]: (state, { payload }) => {
    if (state.traveler._id && state.traveler._id.$oid === payload._id.$oid) {
      return {
        ...state,
        traveler: {
          ...state.traveler,
          lastMessage: payload.lastMessage
        }
      };
    } else {
      return { ...state };
    }
  },
  [PUSHER_UPDATE_TRAVELER_CASE]: (state, { payload }) => {
    const index = findIndex(state.caseHistory.cases, { _id: { $oid: payload._id.$oid } });
    if (index === -1 && state.traveler._id && payload._id.$oid === state.traveler._id.$oid) {
      return {
        ...state,
        caseHistory: {
          ...state.caseHistory,
          loading: false,
          cases: [payload, ...state.caseHistory.cases]
        }
      };
    } else if (index >= 0 && !isEqual(state.caseHistory.cases[index], payload)) {
      const updatedCase = {
        ...state.caseHistory.cases[index],
        ...payload
      };
      return {
        ...state,
        caseHistory: {
          ...state.caseHistory,
          loading: false,
          cases: [
            ...state.caseHistory.cases.slice(0, index),
            updatedCase,
            ...state.caseHistory.cases.slice(index + 1)
          ]
        }
      };
    } else {
      return { ...state };
    }
  },
  [TD_REQUEST_TRAVELER_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [TD_SEND_INVITATION]: (state) => {
    return {
      ...state,
      invitation: {
        ...state.invitation,
        loading: true
      }
    };
  },
  [TD_SET_TRAVELER_FLIGHTS]: (state, { payload }) => {
    return {
      ...state,
      flightsStatus: {
        ...state.flightsStatus,
        travelerFlights: payload,
        loading: false
      }
    };
  },
  [TD_SET_TRAVELER_FLIGHTS_SORTER]: (state, { payload }) => {
    return {
      ...state,
      flightsStatus: {
        ...state.flightsStatus,
        sortBy: payload.sortBy,
        alphabetical: payload.alphabetical
      }
    };
  },
  [TD_REQUEST_TRAVELER_FLIGHTS]: (state) => {
    return {
      ...state,
      flightsStatus: {
        ...state.flightsStatus,
        loading: true
      }
    };
  },
  [TD_REQUEST_TRAVELER_FLIGHTS_ERROR]: (state) => {
    return {
      ...state,
      flightsStatus: {
        ...state.flightsStatus,
        loading: false
      }
    };
  },
  [PUSHER_UPDATE_TRAVELER]: (state, { payload }) => {
    const id = payload._id.$oid;
    if (state.traveler._id && state.traveler._id.$oid && state.traveler._id.$oid === id) {
      return {
        ...state,
        traveler: {
          ...state.traveler,
          ...payload
        }
      };
    } else {
      return { ...state };
    }
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateTraveler = (state) => state.travelerDetails.traveler;
export const stateLoading = (state) => state.travelerDetails.loading;
export const stateOnlineStatus = (state) => state.travelerDetails.onlineStatus;
export const stateTravelerMapView = (state) => state.travelerDetails.map.mapView;
export const stateTravelAdvisoryCountries = (state) => {
  const { countryStatuses } = state.travelerDetails.travelAdvisory;
  return Object.values(countryStatuses);
};
export const stateTravelAdvisoryLoading = (state) => state.travelerDetails.travelAdvisory.loading;
export const stateTravelAdvisoryProducts = (state) => state.travelerDetails.travelAdvisory.travelerProducts;
export const stateTravelAdvisoryLevel = (state) => {
  let max = 0;
  const { countryStatuses } = state.travelerDetails.travelAdvisory;

  if (countryStatuses && Object.keys(countryStatuses).length) {
    Object.keys(countryStatuses).forEach(code => {
      if (countryStatuses[code].level > max) max = countryStatuses[code].level;
    });
  }
  return max;
};
export const stateCaseHistory = createSelector(
  (state) => state.travelerDetails.caseHistory.cases,
  (state) => state.travelerDetails.caseHistory.loading,
  (state) => state.travelerDetails.caseHistory.editingCase,
  (cases, loading, editingCase) => {
    return { cases, loading, editingCase };
  }
);

export const stateFlightsStatus = createSelector(
  (state) => state.travelerDetails.flightsStatus.travelerFlights,
  (state) => state.travelerDetails.flightsStatus.sortBy,
  (state) => state.travelerDetails.flightsStatus.alphabetical,
  (state) => state.travelerDetails.flightsStatus.loading,
  (travelerFlights, sortBy, alphabetical, loading) => {
    return {
      travelerFlights,
      sortBy,
      alphabetical,
      loading
    };
  }
);
