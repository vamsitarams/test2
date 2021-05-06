import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';

import {
  TDR_SET_RESERVATIONS,
  TDR_REQUEST_RESERVATIONS,
  TDR_RESERVATIONS_CHANGE_VIEW,
  TDR_RESERVATIONS_ERROR,
  TDR_RESET_RESERVATIONS
} from '../constants';
import Data from '../../helpers/dummydata';

const initialState = {
  reservations: {},
  loading: false,
  pastView: false,
  travelerId: ''
};

// ------------------------------------
// Actions
// ------------------------------------
export const setReservations = createAction(TDR_SET_RESERVATIONS, (reservations, travelerId) => {
  return {
    reservations,
    travelerId
  };
});
export const reservationsChangeView = createAction(TDR_RESERVATIONS_CHANGE_VIEW);

export const loadReservations = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TDR_REQUEST_RESERVATIONS });
    //   serverApi.getReservations(id).then(function (result) {
    //     if (result.data && result.data.data) {
    //       dispatch(setReservations(result.data.data, id));
    //     }
    //     return result;
    //   }).catch(serverApi.catchErrors.bind(this, dispatch, TDR_RESERVATIONS_ERROR));
    // };

    //change and uncomment after api works
    dispatch(setReservations(Data['reservations'].data, id));
    return Data['reservations'].data;
  }
};

export const resetReservations = () => {
  return (dispatch, getState) => {
    dispatch({
      type: TDR_RESET_RESERVATIONS
    });
  };
};

export const actions = {
  loadReservations,
  reservationsChangeView,
  setReservations,
  resetReservations
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TDR_REQUEST_RESERVATIONS]: (state) => {
    return { ...state, loading: true };
  },
  [TDR_SET_RESERVATIONS]: (state, { payload }) => {
    return {
      ...state,
      reservations: payload.reservations,
      travelerId: payload.travelerId,
      loading: false
    };
  },
  [TDR_RESERVATIONS_CHANGE_VIEW]: (state) => {
    return { ...state, pastView: !state.pastView };
  },
  [TDR_RESERVATIONS_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [TDR_RESET_RESERVATIONS]: () => {
    return { ...initialState };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateReservations = (state) => state.reservations.reservations;
export const stateLoading = (state) => state.reservations.loading;
export const statePastView = (state) => state.reservations.pastView;
export const stateTravelerId = (state) => state.reservations.travelerId;
