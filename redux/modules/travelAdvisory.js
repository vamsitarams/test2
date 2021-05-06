import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import serverApi from '../../helpers/serverApi';
import countriesCenter from '../../config/countries.center.json';

import {
  TA_LOAD_COUNTRIES,
  TA_SET_COUNTRIES_FILTER,
  TA_SET_COUNTRIES,
  TA_SET_COUNTRY_TRAVELERS,
  TA_SET_ACTIVE_COUNTRY,
  AT_REQUEST_ERROR
} from '../constants';

export const initialState = {
  countries: [],
  countryTravelers: {},
  filteredCountries: [],
  loading: false,
  activeCountry: {}
};

// ------------------------------------
// Actions
// ------------------------------------
export const loadCountries = () => {
  return (dispatch, getState) => {
    dispatch({ type: TA_LOAD_COUNTRIES });
    return serverApi
      .getTravelAdvisory()
      .then(({ data }) => {
        dispatch({
          type: TA_SET_COUNTRIES,
          payload: data.countryStatuses
        });
        dispatch({
          type: TA_SET_COUNTRY_TRAVELERS,
          payload: data.countryTravelers
        });
      })
      .catch(serverApi.catchErrors.bind(this, dispatch, AT_REQUEST_ERROR));
  };
};

export const filterCountries = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type: TA_SET_COUNTRIES_FILTER,
      payload
    });
  };
};

export const setActiveCountry = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type: TA_SET_ACTIVE_COUNTRY,
      payload
    });
  };
};

export const setCountryTravelers = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type: TA_SET_COUNTRY_TRAVELERS,
      payload
    });
  };
};

export const actions = {
  loadCountries,
  filterCountries,
  setActiveCountry
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(
  {
    [TA_SET_COUNTRIES]: (state, { payload }) => {
      return { ...state, countries: payload, loading: false };
    },
    [TA_SET_COUNTRIES_FILTER]: (state, { payload }) => {
      return { ...state, filteredCountries: payload };
    },
    [TA_LOAD_COUNTRIES]: (state, { payload }) => {
      return { ...state, loading: true };
    },
    [TA_SET_COUNTRY_TRAVELERS]: (state, { payload }) => {
      return { ...state, countryTravelers: payload };
    },
    [TA_SET_ACTIVE_COUNTRY]: (state, { payload }) => {
      return { ...state, activeCountry: payload };
    }
  },
  initialState
);

// ------------------------------------
// Selector
// ------------------------------------
export const stateCountries = createSelector(
  state => state.travelAdvisory.countries,
  state => state.travelAdvisory.countryTravelers,
  (countries, countryTravelers) => {
    if (countries && countries.length) {
      const countriesWithCenter = countries.map(c =>
        Object.assign({}, c, { center: countriesCenter.find(cc => cc.country === c.country) })
      );
      const countriesWithTravelers = countriesWithCenter.map(c => {
        if (countryTravelers && countryTravelers[c.shortCode]) {
          return Object.assign({}, c, { travelers: countryTravelers[c.shortCode] });
        }
        return Object.assign({}, c, { travelers: [] });
      });
      return countriesWithTravelers;
    }
    return [];
  }
);
export const stateFilteredCountries = state => state.travelAdvisory.filteredCountries;
export const stateLoading = state => state.travelAdvisory.loading;
export const stateActiveCountry = state => state.travelAdvisory.activeCountry;
export const stateCountryTravelers = state => state.travelAdvisory.countryTravelers || {};
