import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { createSelector } from 'reselect';

import {
  REQUEST_SEARCH,
  SEARCH_ERROR,
  SHOW_SEARCH_RESULT,
  CLEAN_SEARCH
} from '../constants';

// ------------------------------------
// Actions
// ------------------------------------
export const searchTraveler = (searchText) => {
  return (dispatch, getState) => {
    dispatch({
      type: REQUEST_SEARCH,
      payload: searchText
    });
    const searchPromise = serverApi.search(searchText).then(function (result) {
      const searchResult = result.data.data;
      if (searchResult) {
        dispatch({
          type: SHOW_SEARCH_RESULT,
          payload: searchResult
        });
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, SEARCH_ERROR));
    return searchPromise;
  };
};

export const cleanSearch = createAction(CLEAN_SEARCH);

export const actions = {
  searchTraveler,
  cleanSearch
};

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  searchText: '',
  searchResults: [],
  loading: false
};

export default handleActions({
  [REQUEST_SEARCH]: (state, { payload }) => {
    return { ...state, searchText: payload, loading: true };
  },
  [SEARCH_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [SHOW_SEARCH_RESULT]: (state, { payload }) => {
    return { ...state, searchResults: payload, loading: false };
  },
  [CLEAN_SEARCH]: () => {
    return { ...initialState };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateSearch = createSelector(
  (state) => state.search.searchText,
  (state) => state.search.searchResults,
  (state) => state.search.loading,
  (searchText, searchResults, loading) => {
    return ({
      searchText,
      searchResults,
      loading
    });
  }
);
