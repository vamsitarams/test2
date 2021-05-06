import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import findIndex from 'lodash/findIndex';

import {
  SET_USERS,
  OU_SET_ORGANIZATION,
  OU_LOAD_ACCOUNT_USERS,
  OU_SET_ACCOUNT_USERS_FILTER,
  OU_CLEAR_ACCOUNT_USERS_FILTER,
  OU_SWITCH_ACCOUNT_USERS_PAGE,
  OU_SET_ACCOUNT_USERS_META,
  OU_SET_ACCOUNT_USERS_SORTER,
  OU_REQUEST_ACCOUNT_USERS_ERROR,
  UM_USER_DATA_UPDATED,
  PUSHER_UPDATE_ORGANIZATION
} from '../constants';

const initialState = {
  organization: false,
  users: [],
  filter: {
    searchName: ''
  },
  associatedCompanies: [],
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
const organizationUsersRequest = (dispatch, organizationUsersState, organizationId) => {
  dispatch({ type: OU_LOAD_ACCOUNT_USERS });
  const sortByDirect = organizationUsersState.alphabetical ? '' : '-';
  const params = {
    organizationId: organizationId || organizationUsersState.organization._id.$oid,
    sort_by: sortByDirect + organizationUsersState.sortBy,
    pagesize: organizationUsersState.pagesize,
    page: organizationUsersState.page,
    search_name: organizationUsersState.filter.searchName
  };
  return serverApi.getOrganizationUsers(params).then(function (result) {
    if (result.data && result.data.data) {
      dispatch({
        type: SET_USERS,
        payload: result.data.data
      });
      dispatch(setOrganizationUsersMeta({ totalPages: result.data.meta._total_pages }));
    } else {
      throw new Error('Invalid data: users list');
    }
    return result;
  }).catch(serverApi.catchErrors.bind(this, dispatch, OU_REQUEST_ACCOUNT_USERS_ERROR));
};

export const loadOrganization = (organizationId) => {
  return (dispatch, getState) => {
    return serverApi.getOrganization({
      organizationId
    }).then(function (result) {
      if (result.data && result.data.data && result.data.embedded && result.data.data.length) {
        dispatch({
          type: OU_SET_ORGANIZATION,
          payload: { ...result.data.data[0], ...result.data.embedded }
        });
      } else {
        throw new Error('Invalid data: organization');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, OU_REQUEST_ACCOUNT_USERS_ERROR));
  };
};

export const loadOrganizationUsers = (organizationId) => {
  return (dispatch, getState) => {
    organizationUsersRequest(dispatch, getState().organizationUsers, organizationId);
  };
};

export const setOrganizationUsersMeta = createAction(OU_SET_ACCOUNT_USERS_META, (meta) => meta);
export const setOrganizationUsersSorter = (sortBy) => {
  return (dispatch, getState) => {
    const prevSortBy = getState().organizationUsers.sortBy;
    const alphabetical = prevSortBy === sortBy ? !getState().organizationUsers.alphabetical : true;
    dispatch({
      type: OU_SET_ACCOUNT_USERS_SORTER,
      payload: {
        alphabetical,
        sortBy
      }
    });
    organizationUsersRequest(dispatch, getState().organizationUsers);
  };
};

export const clearOrganizationUsersFilter = () => {
  return (dispatch, getState) => {
    dispatch({ type: OU_CLEAR_ACCOUNT_USERS_FILTER });
    dispatch({
      type: OU_SWITCH_ACCOUNT_USERS_PAGE,
      payload: 1
    });
    organizationUsersRequest(dispatch, getState().organizationUsers);
  };
};

export const setOrganizationUsersFilter = (filter) => {
  return (dispatch, getState) => {
    dispatch({
      type: OU_SWITCH_ACCOUNT_USERS_PAGE,
      payload: 1
    });
    dispatch({
      type: OU_SET_ACCOUNT_USERS_FILTER,
      payload: filter
    });
    organizationUsersRequest(dispatch, getState().organizationUsers);
  };
};

export const switchOrganizationUsersPage = (page) => {
  return (dispatch, getState) => {
    dispatch({
      type: OU_SWITCH_ACCOUNT_USERS_PAGE,
      payload: page
    });
    organizationUsersRequest(dispatch, getState().organizationUsers);
  };
};

export const actions = {
  loadOrganizationUsers,
  loadOrganization,
  setOrganizationUsersMeta,
  setOrganizationUsersSorter,
  clearOrganizationUsersFilter,
  setOrganizationUsersFilter,
  switchOrganizationUsersPage
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_USERS]: (state, { payload }) => {
    return { ...state, users: payload, loading: false };
  },
  [OU_SET_ORGANIZATION]: (state, { payload }) => {
    return { ...state, organization: payload };
  },
  [OU_LOAD_ACCOUNT_USERS]: (state) => {
    return { ...state, loading: true };
  },
  [OU_SET_ACCOUNT_USERS_FILTER]: (state, { payload }) => {
    return { ...state, filter: { ...payload } };
  },
  [OU_SWITCH_ACCOUNT_USERS_PAGE]: (state, { payload }) => {
    return { ...state, page: payload };
  },
  [OU_SET_ACCOUNT_USERS_SORTER]: (state, { payload }) => {
    return { ...state, alphabetical: payload.alphabetical, sortBy: payload.sortBy };
  },
  [OU_SET_ACCOUNT_USERS_META]: (state, { payload }) => {
    return { ...state, totalPages: payload.totalPages };
  },
  [OU_CLEAR_ACCOUNT_USERS_FILTER]: (state) => {
    return { ...state, filter: { ...initialState.filter } };
  },
  [OU_REQUEST_ACCOUNT_USERS_ERROR]: (state) => {
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
  },
  [PUSHER_UPDATE_ORGANIZATION]: (state, { payload }) => {
    if (
      state.organization &&
      state.organization._id &&
      state.organization._id.$oid &&
      state.organization._id.$oid === payload._id.$oid
    ) {
      return {
        ...state,
        organization: Object.assign({}, state.organization, payload)
      };
    } else {
      return { ...state };
    }
  }
}, initialState);
// ------------------------------------
// Selector
// ------------------------------------
export const stateOrganizationUsers = (state) => state.organizationUsers.users;
export const stateOrganization = (state) => state.organizationUsers.organization;
export const stateOrganizationUsersFilter = (state) => state.organizationUsers.filter;
export const stateOrganizationUsersLoading = (state) => state.organizationUsers.loading;
export const stateOrganizationUsersPage = (state) => state.organizationUsers.page;
export const stateOrganizationUsersTotalPages = (state) => state.organizationUsers.totalPages;
export const stateOrganizationUsersSortBy = (state) => state.organizationUsers.sortBy;
export const stateOrganizationUsersSortByDirect = (state) => state.organizationUsers.alphabetical;
