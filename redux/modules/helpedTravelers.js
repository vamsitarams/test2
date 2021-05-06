import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { createSelector } from 'reselect';
import findIndex from 'lodash/findIndex';

import {
  HT_SET_HELPED_TRAVELERS,
  HT_REQUEST_HELPED_TRAVELERS,
  HT_UPDATE_HELPED_TRAVELERS,
  HT_HELPED_TRAVELERS_ERROR,
  PUSHER_UPDATE_TRAVELER
} from '../constants';

const initialState = {
  travelers: [],
  loading: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const requestHelpedTravelers = () => {
  return (dispatch, getState) => {
    dispatch({ type: HT_REQUEST_HELPED_TRAVELERS });
    return serverApi.getHelpedTravelers().then(function (result) {
      if (result.data && result.data.data) {
        dispatch({
          type: HT_SET_HELPED_TRAVELERS,
          payload: result.data.data
        });
      } else {
        throw new Error('Invalid data: helped travelers');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, HT_HELPED_TRAVELERS_ERROR));
  };
};

export const actions = {
  requestHelpedTravelers
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [HT_REQUEST_HELPED_TRAVELERS]: (state) => {
    return { ...state, loading: true };
  },
  [HT_SET_HELPED_TRAVELERS]: (state, { payload }) => {
    return { ...state, travelers: payload, loading: false };
  },
  [HT_UPDATE_HELPED_TRAVELERS]: (state, { payload }) => {
    const index = findIndex(state.travelers, { _id: payload._id });
    // remove if presented
    if (index >= 0 && payload.helpedBy.status !== 'opened') {
      return {
        ...state,
        travelers: [
          ...state.travelers.slice(0, index),
          ...state.travelers.slice(index + 1)
        ]
      };
    } else if (index === -1 && payload.helpedBy.status === 'opened') {
      // add traveler if opened
      return { ...state, travelers: [...state.travelers, payload] };
    } else {
      return { ...state };
    }
  },
  [HT_HELPED_TRAVELERS_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [PUSHER_UPDATE_TRAVELER]: (state, { payload }) => {
    const id = payload._id.$oid;
    const index = findIndex(state.travelers, { _id: { $oid: id } });
    if (index !== -1) {
      const updatedTraveler = {
        ...state.travelers[index],
        ...payload
      };
      return {
        ...state,
        travelers: [
          ...state.travelers.slice(0, index),
          updatedTraveler,
          ...state.travelers.slice(index + 1)
        ]
      };
    } else {
      return { ...state };
    }
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateHelpedTravelers = createSelector(
  (state) => state.helpedTravelers.travelers,
  (state) => state.helpedTravelers.loading,
  (travelers, loading) => {
    return ({
      travelers,
      loading
    });
  }
);
