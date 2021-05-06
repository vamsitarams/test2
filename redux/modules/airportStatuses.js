import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import findIndex from 'lodash/findIndex';

import {
  PUSHER_UPDATE_STATION_ON_MAP,
  AS_SET_AIRPORT_STATUSES,
  AS_LOAD_AIRPORT_STATUSES,
  AS_CHANGE_AIRPORT_STATUS_FILTER,
  AS_CHANGE_TD_AIRPORT_STATUS_FILTER,
  AS_CHANGE_TIMEFRAME_FILTER,
  AS_CHANGE_TD_TIMEFRAME_FILTER,
  AS_AIRPORT_STATUSES_ERROR
} from '../constants';

const defaultTimeFrameHours = 24;
const initialState = {
  statuses: [],
  loading: false,
  filterStatus: '',
  tdFilterStatus: '',
  filterTimeframe: defaultTimeFrameHours,
  tdFilterTimeframe: defaultTimeFrameHours
};

// ------------------------------------
// Actions
// ------------------------------------
export const loadAirportStatuses = () => {
  return (dispatch, getState) => {
    dispatch({ type: AS_LOAD_AIRPORT_STATUSES });
    serverApi.getStations().then(function (result) {
      if (result.data && result.data.data) {
        dispatch(setAirportStatuses(result.data.data));
      } else {
        throw new Error('Invalid data: airport status');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, AS_AIRPORT_STATUSES_ERROR));
  };
};
export const setAirportStatuses = createAction(AS_SET_AIRPORT_STATUSES, (statuses = []) => statuses);
export const changeAirportStatusFilter = createAction(AS_CHANGE_AIRPORT_STATUS_FILTER, (status = '') => status);
export const changeTdAirportStatusFilter = createAction(AS_CHANGE_TD_AIRPORT_STATUS_FILTER, (status = '') => status);
export const changeAirportTimeframeFilter = createAction(
  AS_CHANGE_TIMEFRAME_FILTER, (timeframe = defaultTimeFrameHours) => timeframe);
export const changeTdAirportTimeframeFilter = createAction(
  AS_CHANGE_TD_TIMEFRAME_FILTER, (timeframe = defaultTimeFrameHours) => timeframe);

export const actions = {
  loadAirportStatuses,
  setAirportStatuses,
  changeAirportStatusFilter,
  changeTdAirportStatusFilter,
  changeAirportTimeframeFilter,
  changeTdAirportTimeframeFilter
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [PUSHER_UPDATE_STATION_ON_MAP]: (state, { payload }) => {
    const stationId = payload._id.$oid;
    const index = findIndex(state.statuses, { _id: { $oid: stationId } });
    if (index !== -1) {
      const updatedStation = {
        ...state.statuses[index],
        ...payload
      };
      return {
        ...state,
        statuses: [
          ...state.statuses.slice(0, index),
          updatedStation,
          ...state.statuses.slice(index + 1)
        ]
      };
    } else {
      return { ...state };
    }
  },
  [AS_SET_AIRPORT_STATUSES]: (state, { payload }) => {
    return { ...state, statuses: payload, loading: false };
  },
  [AS_LOAD_AIRPORT_STATUSES]: (state) => {
    return { ...state, loading: true };
  },
  [AS_AIRPORT_STATUSES_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [AS_CHANGE_AIRPORT_STATUS_FILTER]: (state, { payload }) => {
    return { ...state, filterStatus: payload };
  },
  [AS_CHANGE_TD_AIRPORT_STATUS_FILTER]: (state, { payload }) => {
    return { ...state, tdFilterStatus: payload };
  },
  [AS_CHANGE_TIMEFRAME_FILTER]: (state, { payload }) => {
    return { ...state, filterTimeframe: payload };
  },
  [AS_CHANGE_TD_TIMEFRAME_FILTER]: (state, { payload }) => {
    return { ...state, tdFilterTimeframe: payload };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateAirportStatuses = (state) => state.airportStatuses.statuses;
export const stateAirportStatusesLoading = (state) => state.airportStatuses.loading;
export const stateFilterAirportStatus = (state) => state.airportStatuses.filterStatus;
export const stateTdAirportFilterStatus = (state) => state.airportStatuses.tdFilterStatus;
export const stateFilterAirportTimeframe = (state) => state.airportStatuses.filterTimeframe;
export const stateTdAirportFilterTimeframe = (state) => state.airportStatuses.tdFilterTimeframe;
