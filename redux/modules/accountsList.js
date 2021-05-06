import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { createSelector } from 'reselect';
import { TYPE_AGENCY, TYPE_COMPANY } from '../../helpers/organization';
import findIndex from 'lodash/findIndex';

import {
  AL_SET_ACCOUNTS,
  AL_LOAD_ACCOUNTS,
  AL_SET_ACCOUNTS_FILTER,
  AL_CLEAR_ACCOUNTS_FILTER,
  AL_SWITCH_ACCOUNTS_PAGE,
  AL_SET_ACCOUNTS_EMBEDDED,
  AL_SET_ACCOUNTS_META,
  AL_SET_ACCOUNTS_SORTER,
  AL_REQUEST_ACCOUNTS_ERROR,
  PUSHER_UPDATE_ORGANIZATION
} from '../constants';

const initialState = {
  accounts: [],
  filter: {
    type: '',
    associatedAgency: '',
    searchName: ''
  },
  types: [TYPE_AGENCY, TYPE_COMPANY],
  associatedAgencies: [],
  loading: false,
  page: 1,
  pagesize: 20,
  totalPages: 1,
  sortBy: '',
  alphabetical: true
};

// ------------------------------------
// Actions
// ------------------------------------
const accountsListRequest = (dispatch, accountsListState) => {
  dispatch({ type: AL_LOAD_ACCOUNTS });
  const sortByDirect = accountsListState.alphabetical ? '' : '-';
  const accountsParams = {
    filter_type: accountsListState.filter.type, // for all types
    sort_by: sortByDirect + accountsListState.sortBy,
    filter_agency: accountsListState.filter.associatedAgency,
    pagesize: accountsListState.pagesize,
    page: accountsListState.page,
    search_name: (accountsListState.filter.searchName ? accountsListState.filter.searchName.trim() : ''),
    with_parents: true,
    with_costCenters: false
  };
  return serverApi.getOrganizations(accountsParams).then(function (result) {
    if (result.data && result.data.data) {
      dispatch({
        type: AL_SET_ACCOUNTS,
        payload: result.data.data
      });
      dispatch(setAccountsEmbedded(result.data.embedded));
      dispatch(setAccountsMeta({ totalPages: result.data.meta._total_pages }));
    } else {
      throw new Error('Invalid data: accounts list');
    }
    return result;
  }).catch(serverApi.catchErrors.bind(this, dispatch, AL_REQUEST_ACCOUNTS_ERROR));
};

export const loadAccounts = () => {
  return (dispatch, getState) => {
    return accountsListRequest(dispatch, getState().accountsList);
  };
};

export const setAccountsEmbedded = createAction(AL_SET_ACCOUNTS_EMBEDDED, (embedded) => embedded);
export const setAccountsMeta = createAction(AL_SET_ACCOUNTS_META, (meta) => meta);
export const setAccountsSorter = (sortBy) => {
  return (dispatch, getState) => {
    const prevSortBy = getState().accountsList.sortBy;
    const alphabetical = prevSortBy === sortBy ? !getState().accountsList.alphabetical : true;
    dispatch({
      type: AL_SET_ACCOUNTS_SORTER,
      payload: {
        alphabetical,
        sortBy
      }
    });
    accountsListRequest(dispatch, getState().accountsList);
  };
};

export const clearAccountsFilter = () => {
  return (dispatch, getState) => {
    dispatch({ type: AL_CLEAR_ACCOUNTS_FILTER });
    dispatch({
      type: AL_SWITCH_ACCOUNTS_PAGE,
      payload: 1
    });
    accountsListRequest(dispatch, getState().accountsList);
  };
};

export const setAccountsFilter = (filter) => {
  return (dispatch, getState) => {
    dispatch({
      type: AL_SWITCH_ACCOUNTS_PAGE,
      payload: 1
    });
    dispatch({
      type: AL_SET_ACCOUNTS_FILTER,
      payload: filter
    });
    accountsListRequest(dispatch, getState().accountsList);
  };
};

export const switchAccountsPage = (page) => {
  return (dispatch, getState) => {
    dispatch({
      type: AL_SWITCH_ACCOUNTS_PAGE,
      payload: page
    });
    accountsListRequest(dispatch, getState().accountsList);
  };
};

export const actions = {
  loadAccounts,
  setAccountsEmbedded,
  setAccountsMeta,
  setAccountsSorter,
  clearAccountsFilter,
  setAccountsFilter,
  switchAccountsPage
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [AL_SET_ACCOUNTS]: (state, { payload }) => {
    return { ...state, accounts: payload, loading: false };
  },
  [AL_LOAD_ACCOUNTS]: (state) => {
    return { ...state, loading: true };
  },
  [AL_SET_ACCOUNTS_FILTER]: (state, { payload }) => {
    return { ...state, filter: { ...state.filter, ...payload } };
  },
  [AL_SWITCH_ACCOUNTS_PAGE]: (state, { payload }) => {
    return { ...state, page: payload };
  },
  [AL_SET_ACCOUNTS_SORTER]: (state, { payload }) => {
    return { ...state, alphabetical: payload.alphabetical, sortBy: payload.sortBy };
  },
  [AL_SET_ACCOUNTS_META]: (state, { payload }) => {
    return { ...state, totalPages: payload.totalPages };
  },
  [AL_SET_ACCOUNTS_EMBEDDED]: (state, { payload }) => {
    return {
      ...state,
      associatedAgencies: payload.parentOrganizations
    };
  },
  [AL_CLEAR_ACCOUNTS_FILTER]: (state) => {
    return { ...state, filter: { ...initialState.filter } };
  },
  [AL_REQUEST_ACCOUNTS_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [PUSHER_UPDATE_ORGANIZATION]: (state, { payload }) => {
    const id = payload._id.$oid;
    const index = findIndex(state.accounts, { _id: { $oid: id } });
    if (index !== -1) {
      const updatedAccount = {
        ...state.accounts[index],
        ...payload
      };
      return {
        ...state,
        accounts: [
          ...state.accounts.slice(0, index),
          updatedAccount,
          ...state.accounts.slice(index + 1)
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
export const stateAccounts = (state) => state.accountsList.accounts;
export const stateAccountsFilter = (state) => state.accountsList.filter;
export const stateAccountsLoading = (state) => state.accountsList.loading;
export const stateAccountsPage = (state) => state.accountsList.page;
export const stateAccountsTotalPages = (state) => state.accountsList.totalPages;
export const stateAccountsEmbedded = createSelector(
  (state) => state.accountsList.types,
  (state) => state.accountsList.associatedAgencies,
  (types, associatedAgencies) => {
    return {
      types,
      associatedAgencies
    };
  }
);
export const stateAccountsSortBy = (state) => state.accountsList.sortBy;
export const stateAccountsSortByDirect = (state) => state.accountsList.alphabetical;
