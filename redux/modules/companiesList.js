import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import findIndex from 'lodash/findIndex';

import {
  CL_SET_COMPANIES,
  CL_LOAD_COMPANIES,
  CL_SET_COMPANIES_FILTER,
  CL_CLEAR_COMPANIES_FILTER,
  CL_SWITCH_COMPANIES_PAGE,
  CL_SET_COMPANIES_META,
  CL_SET_COMPANIES_SORTER,
  CL_REQUEST_COMPANIES_ERROR,
  PUSHER_UPDATE_ORGANIZATION
} from '../constants';

const initialState = {
  companies: [],
  filter: {
    searchName: ''
  },
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
const companiesListRequest = (dispatch, companiesListState) => {
  dispatch({ type: CL_LOAD_COMPANIES });
  const sortByDirect = companiesListState.alphabetical ? '' : '-';
  const companiesParams = {
    filter_type: 'organization', // for all types
    sort_by: sortByDirect + companiesListState.sortBy,
    filter_agency: '',
    pagesize: companiesListState.pagesize,
    page: companiesListState.page,
    search_name: companiesListState.filter.searchName,
    with_parents: true,
    with_costCenters: false
  };
  return serverApi.getOrganizations(companiesParams).then(function (result) {
    if (result.data && result.data.data) {
      dispatch({
        type: CL_SET_COMPANIES,
        payload: result.data.data
      });
      dispatch(setCompaniesMeta({ totalPages: result.data.meta._total_pages }));
    } else {
      throw new Error('Invalid data: companies list');
    }
    return result;
  }).catch(serverApi.catchErrors.bind(this, dispatch, CL_REQUEST_COMPANIES_ERROR));
};

export const loadCompanies = () => {
  return (dispatch, getState) => {
    return companiesListRequest(dispatch, getState().companiesList);
  };
};

export const setCompaniesMeta = createAction(CL_SET_COMPANIES_META, (meta) => meta);
export const setCompaniesSorter = (sortBy) => {
  return (dispatch, getState) => {
    const prevSortBy = getState().companiesList.sortBy;
    const alphabetical = prevSortBy === sortBy ? !getState().companiesList.alphabetical : true;
    dispatch({
      type: CL_SET_COMPANIES_SORTER,
      payload: {
        alphabetical,
        sortBy
      }
    });
    companiesListRequest(dispatch, getState().companiesList);
  };
};

export const clearCompaniesFilter = () => {
  return (dispatch, getState) => {
    dispatch({ type: CL_CLEAR_COMPANIES_FILTER });
    dispatch({
      type: CL_SWITCH_COMPANIES_PAGE,
      payload: 1
    });
    companiesListRequest(dispatch, getState().companiesList);
  };
};

export const setCompaniesFilter = (filter) => {
  return (dispatch, getState) => {
    dispatch({
      type: CL_SWITCH_COMPANIES_PAGE,
      payload: 1
    });
    dispatch({
      type: CL_SET_COMPANIES_FILTER,
      payload: filter
    });
    companiesListRequest(dispatch, getState().companiesList);
  };
};

export const switchCompaniesPage = (page) => {
  return (dispatch, getState) => {
    dispatch({
      type: CL_SWITCH_COMPANIES_PAGE,
      payload: page
    });
    companiesListRequest(dispatch, getState().companiesList);
  };
};

export const actions = {
  loadCompanies,
  setCompaniesMeta,
  setCompaniesSorter,
  clearCompaniesFilter,
  setCompaniesFilter,
  switchCompaniesPage
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [CL_SET_COMPANIES]: (state, { payload }) => {
    return { ...state, companies: payload, loading: false };
  },
  [CL_LOAD_COMPANIES]: (state) => {
    return { ...state, loading: true };
  },
  [CL_SET_COMPANIES_FILTER]: (state, { payload }) => {
    return { ...state, filter: { ...payload } };
  },
  [CL_SWITCH_COMPANIES_PAGE]: (state, { payload }) => {
    return { ...state, page: payload };
  },
  [CL_SET_COMPANIES_SORTER]: (state, { payload }) => {
    return { ...state, alphabetical: payload.alphabetical, sortBy: payload.sortBy };
  },
  [CL_SET_COMPANIES_META]: (state, { payload }) => {
    return { ...state, totalPages: payload.totalPages };
  },
  [CL_CLEAR_COMPANIES_FILTER]: (state) => {
    return { ...state, filter: { ...initialState.filter } };
  },
  [CL_REQUEST_COMPANIES_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [PUSHER_UPDATE_ORGANIZATION]: (state, { payload }) => {
    const id = payload._id.$oid;
    const index = findIndex(state.companies, { _id: { $oid: id } });
    if (index !== -1) {
      const updatedAccount = {
        ...state.companies[index],
        ...payload
      };
      return {
        ...state,
        companies: [
          ...state.companies.slice(0, index),
          updatedAccount,
          ...state.companies.slice(index + 1)
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
export const stateCompanies = (state) => state.companiesList.companies;
export const stateCompaniesFilter = (state) => state.companiesList.filter;
export const stateCompaniesLoading = (state) => state.companiesList.loading;
export const stateCompaniesPage = (state) => state.companiesList.page;
export const stateCompaniesTotalPages = (state) => state.companiesList.totalPages;
export const stateCompaniesSortBy = (state) => state.companiesList.sortBy;
export const stateCompaniesSortByDirect = (state) => state.companiesList.alphabetical;
