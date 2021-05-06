import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import serverApi from '../../helpers/serverApi';

import {
  TLN_REQUEST_TIMALINE_DATA,
  TLN_SET_TIMALINE_DATA,
  TLN_REQUEST_TIMALINE_DATA_ERROR,
  TLN_RESET_TIMELINE
} from '../constants';

const initialState = {
  timelineEvents: [],
  reservations: {},
  loading: false,
  travelerId: ''
};

// ------------------------------------
// Actions
// ------------------------------------
export const loadEvents = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TLN_REQUEST_TIMALINE_DATA });
    serverApi.getTimalineEvents(id).then(function (result) {
      if (result.data && result.data.data) {
        dispatch({
          type: TLN_SET_TIMALINE_DATA,
          payload: {
            travelerId: id,
            timelineEvents: result.data.data.timelineEvents,
            reservations: result.data.data.reservations
          }
        });
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TLN_REQUEST_TIMALINE_DATA_ERROR));
  };
};

export const resetTimeline = () => {
  return (dispatch, getState) => {
    dispatch({
      type: TLN_RESET_TIMELINE
    });
  };
};

export const actions = {
  loadEvents,
  resetTimeline
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TLN_REQUEST_TIMALINE_DATA]: (state) => {
    return {
      ...state,
      loading: true
    };
  },
  [TLN_SET_TIMALINE_DATA]: (state, { payload }) => {
    return {
      ...state,
      travelerId: payload.travelerId,
      timelineEvents: payload.timelineEvents,
      reservations: payload.reservations,
      loading: false
    };
  },
  [TLN_REQUEST_TIMALINE_DATA_ERROR]: (state) => {
    return {
      ...state,
      loading: false
    };
  },
  [TLN_RESET_TIMELINE]: (state) => {
    return { ...initialState };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateTimelineData = createSelector(
  (state) => state.timeline.timelineEvents,
  (state) => state.timeline.reservations,
  (state) => state.timeline.travelerId,
  (timelineEvents, reservations, travelerId) => {
    return {
      timelineEvents,
      reservations,
      travelerId
    };
  }
);
export const stateLoading = (state) => state.timeline.loading;
