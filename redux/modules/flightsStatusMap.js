import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';

import {
  FSM_UPDATE_FLIGHT_STATUS,
  FSM_SET_FLIGHT_STATUS,
  FSM_LOAD_FLIGHT_STATUS,
  FSM_CHANGE_FLIGHT_STATUS_FILTER,
  FSM_CHANGE_TD_TIMEFRAME_FILTER,
  FSM_CHANGE_TIMEFRAME_FILTER,
  FSM_FLIGHT_STATUS_ERROR
} from '../constants';

const defaultTimeFrameHours = 3;

const initialState = {
  flightsStatuses: [],
  filterTimeframe: defaultTimeFrameHours,
  tdFilterTimeframe: defaultTimeFrameHours,
  loading: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const updateFlightStatuses = () => {
  return (dispatch, getState) => {
    dispatch({ type: FSM_UPDATE_FLIGHT_STATUS });
    dispatch(loadFlightStatuses());
  };
};
export const loadFlightStatuses = () => {
  return (dispatch, getState) => {
    dispatch({ type: FSM_LOAD_FLIGHT_STATUS });
    serverApi.getFlightsMap({
      language: ''
    }).then(function (result) {
      if (result.data && result.data.data) {
        dispatch(setFlightStatusMap(result.data.data));
      } else {
        throw new Error('Invalid data: flights status map');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, FSM_FLIGHT_STATUS_ERROR));
  };
};
export const setFlightStatusMap = createAction(FSM_SET_FLIGHT_STATUS, (statuses = []) => statuses);
export const changeFlightStatusMapFilter = createAction(FSM_CHANGE_FLIGHT_STATUS_FILTER, (status = '') => status);
export const changeTdFlightStatusTimeframeFilter = createAction(
  FSM_CHANGE_TD_TIMEFRAME_FILTER, (timeframe = defaultTimeFrameHours) => timeframe
);
export const changeFlightStatusTimeframeFilter = createAction(
  FSM_CHANGE_TIMEFRAME_FILTER, (timeframe = defaultTimeFrameHours) => timeframe
);

export const actions = {
  loadFlightStatuses,
  updateFlightStatuses,
  setFlightStatusMap,
  changeFlightStatusMapFilter,
  changeTdFlightStatusTimeframeFilter,
  changeFlightStatusTimeframeFilter
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FSM_SET_FLIGHT_STATUS]: (state, { payload }) => {
    return { ...state, flightsStatuses: payload, loading: false };
  },
  [FSM_LOAD_FLIGHT_STATUS]: (state) => {
    return { ...state, loading: true };
  },
  [FSM_FLIGHT_STATUS_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [FSM_CHANGE_FLIGHT_STATUS_FILTER]: (state, { payload }) => {
    return { ...state, filterStatus: payload };
  },
  [FSM_CHANGE_TIMEFRAME_FILTER]: (state, { payload }) => {
    return { ...state, filterTimeframe: payload };
  },
  [FSM_CHANGE_TD_TIMEFRAME_FILTER]: (state, { payload }) => {
    return { ...state, tdFilterTimeframe: payload };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateFlightsStatuses = (state) => state.flightsStatusMap.flightsStatuses;
export const stateFilterFlightStatusTimeframe = (state) => state.flightsStatusMap.filterTimeframe;
export const stateTdFlightStatusFilterTimeframe = (state) => state.flightsStatusMap.tdFilterTimeframe;
export const stateFlightStatusLoading = (state) => state.flightsStatusMap.loading;
