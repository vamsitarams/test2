import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import findIndex from 'lodash/findIndex';

import {
  SET_USERS,
  LOAD_USERS,
  SET_USERS_FILTER,
  CLEAR_USERS_FILTER,
  SWITCH_USERS_PAGE,
  SET_USERS_META,
  SET_USERS_SORTER,
  REQUEST_USERS_ERROR,
  UM_USER_DATA_UPDATED
} from '../constants';

const initialState = {
  users: [],
  filter: {
    searchName: ''
  },
  associatedCompanies: [],
  loading: false,
  page: 1,
  pagesize: 10,
  totalPages: 1,
  sortBy: '',
  alphabetical: true
};
let orgId;

// ------------------------------------
// Actions
// ------------------------------------
const usersRequest = (dispatch, usersState, organizationId) => {
  dispatch({ type: LOAD_USERS });
  if (organizationId) {
    orgId = organizationId;
  }
  const sortByDirect = usersState.alphabetical ? '' : '-';
  const params = {
    organizationId: orgId,
    sort_by: sortByDirect + usersState.sortBy,
    pagesize: usersState.pagesize,
    page: usersState.page,
    search_name: usersState.filter.searchName
  };
  return serverApi.getOrganizationUsers(params).then(function (result) {
    if (result.data && result.data.data) {
      dispatch({
        type: SET_USERS,
        payload: result.data.data
      });
      dispatch(setUsersMeta({ totalPages: result.data.meta._total_pages }));
    } else {
      throw new Error('Invalid data: users list');
    }
    return result;
  }).catch(serverApi.catchErrors.bind(this, dispatch, REQUEST_USERS_ERROR));
};

export const loadUsers = (organizationId) => {
  return (dispatch, getState) => {
    usersRequest(dispatch, getState().users, organizationId);
  };
};

export const setUsersMeta = createAction(SET_USERS_META, (meta) => meta);
export const setUsersSorter = (sortBy) => {
  return (dispatch, getState) => {
    const prevSortBy = getState().users.sortBy;
    const alphabetical = prevSortBy === sortBy ? !getState().users.alphabetical : true;
    dispatch({
      type: SET_USERS_SORTER,
      payload: {
        alphabetical,
        sortBy
      }
    });
    usersRequest(dispatch, getState().users);
  };
};

export const clearUsersFilter = () => {
  return (dispatch, getState) => {
    dispatch({ type: CLEAR_USERS_FILTER });
    dispatch({
      type: SWITCH_USERS_PAGE,
      payload: 1
    });
    usersRequest(dispatch, getState().users);
  };
};

export const setUsersFilter = (filter) => {
  return (dispatch, getState) => {
    dispatch({
      type: SWITCH_USERS_PAGE,
      payload: 1
    });
    dispatch({
      type: SET_USERS_FILTER,
      payload: filter
    });
    usersRequest(dispatch, getState().users);
  };
};

export const switchUsersPage = (page) => {
  return (dispatch, getState) => {
    dispatch({
      type: SWITCH_USERS_PAGE,
      payload: page
    });
    usersRequest(dispatch, getState().users);
  };
};

export const actions = {
  loadUsers,
  setUsersMeta,
  setUsersSorter,
  clearUsersFilter,
  setUsersFilter,
  switchUsersPage
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_USERS]: (state, { payload }) => {
    return {
      ...state,
      users: payload,
      loading: false
    };
  },
  [LOAD_USERS]: (state) => {
    return { ...state, loading: true };
  },
  [SET_USERS_FILTER]: (state, { payload }) => {
    return { ...state, filter: { ...payload } };
  },
  [SWITCH_USERS_PAGE]: (state, { payload }) => {
    return { ...state, page: payload };
  },
  [SET_USERS_SORTER]: (state, { payload }) => {
    return { ...state, alphabetical: payload.alphabetical, sortBy: payload.sortBy };
  },
  [SET_USERS_META]: (state, { payload }) => {
    return { ...state, totalPages: payload.totalPages };
  },
  [CLEAR_USERS_FILTER]: (state) => {
    return { ...state, filter: { ...initialState.filter } };
  },
  [REQUEST_USERS_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [UM_USER_DATA_UPDATED]: (state, { payload }) => {
    const id = payload._id.$oid;
    const index = findIndex(state.users, { _id: { $oid: id } });
    if (index !== -1) {
      const updatedUser = {
        ...state.users[index],
        ...payload
      };
      return {
        ...state,
        users: [
          ...state.users.slice(0, index),
          updatedUser,
          ...state.users.slice(index + 1)
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
export const stateUsers = (state) => state.users.users;
export const stateUsersFilter = (state) => state.users.filter;
export const stateUsersLoading = (state) => state.users.loading;
export const stateUsersPage = (state) => state.users.page;
export const stateUsersTotalPages = (state) => state.users.totalPages;
export const stateUsersSortBy = (state) => state.users.sortBy;
export const stateUsersSortByDirect = (state) => state.users.alphabetical;
