import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import findIndex from 'lodash/findIndex';
import getSpotBelonging from '../../helpers/getSpotBelonging';
import ACTIVE_DATA from '../../config/Activedata';
import LATEST_PRODUCT from '../../config/LatestProduct';
import HOTEL_DATA from '../../config/HotelsData';
import { CAR_DATA } from '../../config/CarData';

import {
  PUSHER_UPDATE_TRAVELER_HELPEDBY,
  PUSHER_UPDATE_TRAVELER_LOADING,
  PUSHER_UPDATE_TRAVELER,
  AT_SET_ACTIVE_TRAVELERS,
  AT_LOAD_ACTIVE_TRAVELERS,
  AT_SET_FILTER,
  AT_CLEAR_FILTER,
  AT_REQUEST_ERROR,
  AT_SET_LATEST_PRODUCTS,
  AT_LATEST_PRODUCTS_ERROR,
  AT_COMPUTE_CONTINENTS_BELONGING
} from '../constants';

export const initialState = {
  travelers: [],
  filter: {
    status: {
      alarm: false,
      warning: false,
      ok: false
    },
    vip: false,
    nonHelped: false,
    areaShown: false,
    company: [],
    costcenter_id: [],
    onTheMap: []
  },
  loading: false,
  byContNumbers: {
    namerica: 0,
    samerica: 0,
    europe: 0,
    asia: 0,
    oceania: 0,
    africa: 0
  }
};

// ------------------------------------
// Actions
// ------------------------------------
export const loadActiveTravelers = () => {
  return (dispatch, getState) => {
    dispatch({ type: AT_LOAD_ACTIVE_TRAVELERS });
    serverApi.getActiveTravelers()
      .then(function getActiveTravelers (result) {
        if (result.data && result.data.data) {
          dispatch({
            type: AT_SET_ACTIVE_TRAVELERS,
            payload: ACTIVE_DATA.data
          });
        } else {
          throw new Error('Invalid data: active travelers');
        }
        return result;
      })
      .then(res => {
        dispatch({
          type: AT_COMPUTE_CONTINENTS_BELONGING,
          payload: res.data.data
        });
        return res;
      })
      .catch(serverApi.catchErrors.bind(this, dispatch, AT_REQUEST_ERROR));
  };
};
export const clearActiveTravelersFilter = createAction(AT_CLEAR_FILTER);
export const setActiveTravelersFilter = createAction(AT_SET_FILTER, (filter) => filter);
export const loadLatestProducts = (id) => {
  return (dispatch, getState) => {
    return serverApi.getLatestProducts(id).then(function getActiveTravelers (result) {
      if (result.data && result.data.data) {
        const payload = {
          productsData:  LATEST_PRODUCT.data,
          hotelsData: HOTEL_DATA.data,
          carData: CAR_DATA.data,
          travelerId: id
        };
        console.log('there', payload);
        dispatch({
          type: AT_SET_LATEST_PRODUCTS,
          payload: payload
        });
      } else {
        dispatch({
          type: AT_LATEST_PRODUCTS_ERROR
        });
      }
      return result;
    }).catch(() => {
      const payload1 = {
        productsData:  LATEST_PRODUCT.data,
        hotelsData: HOTEL_DATA.data,
        carData: CAR_DATA.data,
        travelerId: id
      };
      console.log('here', payload1);
      dispatch({
        type: AT_SET_LATEST_PRODUCTS,
        payload: payload1
      });
    });
  };
};
// .catch(serverApi.catchErrors.bind(this, dispatch, AT_LATEST_PRODUCTS_ERROR));

export const actions = {
  loadActiveTravelers,
  clearActiveTravelersFilter,
  setActiveTravelersFilter,
  loadLatestProducts
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [AT_SET_ACTIVE_TRAVELERS]: (state, { payload }) => {
    return { ...state, travelers: payload, loading: false };
  },
  [AT_LOAD_ACTIVE_TRAVELERS]: (state, { payload }) => {
    return { ...state, loading: true };
  },
  [AT_COMPUTE_CONTINENTS_BELONGING]: (state, { payload }) => {
    return {
      ...state,
      byContNumbers: getSpotBelonging(payload)
    };
  },
  [AT_REQUEST_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [AT_SET_FILTER]: (state, { payload }) => {
    return {
      ...state,
      filter: {
        ...payload
      }
    };
  },
  [PUSHER_UPDATE_TRAVELER_HELPEDBY]: (state, { payload }) => {
    const index = findIndex(state.travelers, { _id: { $oid: payload.travelerId } });
    if (index >= 0) {
      const traveler = { ...state.travelers[index], helpedBy: payload.helpedBy };
      return {
        ...state,
        travelers: [
          ...state.travelers.slice(0, index),
          traveler,
          ...state.travelers.slice(index + 1)
        ]
      };
    } else {
      return { ...state };
    }
  },
  [PUSHER_UPDATE_TRAVELER_LOADING]: (state, { payload }) => {
    const index = findIndex(state.travelers, { _id: { $oid: payload } });
    if (index >= 0) {
      const traveler = {
        ...state.travelers[index],
        helpedBy: {
          ...state.travelers[index].helpedBy,
          loading: true
        }
      };
      return {
        ...state,
        travelers: [
          ...state.travelers.slice(0, index),
          traveler,
          ...state.travelers.slice(index + 1)
        ]
      };
    } else {
      return { ...state };
    }
  },
  [AT_CLEAR_FILTER]: (state) => {
    return { ...state, filter: { ...initialState.filter } };
  },
  [PUSHER_UPDATE_TRAVELER]: (state, { payload }) => {
    const id = payload._id.$oid;
    const index = findIndex(state.travelers, { _id: { $oid: id } });
    if (index !== -1) {
      const updatedTraveler = {
        ...state.travelers[index],
        ...payload
      };
      if (updatedTraveler.hasActiveJourney) {
        // update active traveler
        return {
          ...state,
          travelers: [
            ...state.travelers.slice(0, index),
            updatedTraveler,
            ...state.travelers.slice(index + 1)
          ]
        };
      } else {
        // remove traveler if journey is not active
        return {
          ...state,
          travelers: [
            ...state.travelers.slice(0, index),
            ...state.travelers.slice(index + 1)
          ]
        };
      }
    } else if (payload.hasActiveJourney) {
      // add traveler to active if journey is active
      return {
        ...state,
        travelers: [
          ...state.travelers,
          payload
        ]
      };
    } else {
      return { ...state };
    }
  },
  [AT_SET_LATEST_PRODUCTS]: (state, { payload }) => {
    const index = findIndex(state.travelers, { _id: { $oid: payload.travelerId } });
    console.log('reachreducer', payload);
    if (index !== -1) {
      const traveler = {
        ...state.travelers[index], productsData: payload.productsData, hotelsData: payload.hotelsData, carData: payload.carData
      };
      return {
        ...state,
        travelers: [
          ...state.travelers.slice(0, index),
          traveler,
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
export const stateActiveTravelers = (state) => state.activeTravelers.travelers;
export const stateFilter = (state) => state.activeTravelers.filter;
export const stateLoading = (state) => state.activeTravelers.loading;
export const stateByContNumbers = (state) => state.activeTravelers.byContNumbers;
