import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { isCompanyAdminOrUser } from '../../helpers/user';
import findIndex from 'lodash/findIndex';
import {
  PUSHER_UPDATE_TRAVELER_HELPEDBY,
  PUSHER_UPDATE_TRAVELER_LOADING,
  TL_SET_TRAVELERS_LIST,
  TL_LOAD_TRAVELERS_LIST,
  TL_SET_TRAVELERS_LIST_FILTER,
  TL_CLEAR_TRAVELERS_LIST_FILTER,
  TL_SWITCH_TRAVELERS_LIST_PAGE,
  TL_SET_TRAVELERS_LIST_META,
  TL_SET_TRAVELERS_LIST_EMBED_DATA,
  TL_SET_TRAVELERS_LIST_SORTER,
  TL_SET_TRAVELERS_LIST_ERROR,
  PUSHER_UPDATE_TRAVELER
} from '../constants';

const initialState = {
  travelers: [],
  filter: {
    status: {
      alarm: false,
      warning: false,
      ok: false
    },
    vip: false,
    nonHelped: false,
    company: [],
    costcenter_id: []
  },
  companies: [],
  costCenters: [],
  loading: false,
  page: 1,
  pagesize: 8,
  metaData: {
    _size: 0,
    _total_size: 0,
    _total_pages: 1
  },
  sortBy: '',
  alphabetical: true
};

// ------------------------------------
// Actions
// ------------------------------------
const travelersListRequest = (dispatch, user, tlParams) => {
  const isCompanyAdminOrUserState = isCompanyAdminOrUser(user.roleName);
  dispatch({ type: TL_LOAD_TRAVELERS_LIST });
  return serverApi.webTravelersGet(tlParams, isCompanyAdminOrUserState).then(function (result) {
    if (result.data && result.data.data && result.data.embedded && result.data.meta) {
      dispatch({
        type: TL_SET_TRAVELERS_LIST,
        payload: result.data.data
      });
      dispatch(setTravelersListEmbedData(result.data.embedded));
      dispatch(setTravelersListMeta(result.data.meta));
    } else {
      throw new Error('Invalid data: travelers list');
    }
    return result;
  }).catch(serverApi.catchErrors.bind(this, dispatch, TL_SET_TRAVELERS_LIST_ERROR));
};

export const setTravelersListMeta = createAction(TL_SET_TRAVELERS_LIST_META, (meta) => meta);
export const setTravelersListEmbedData = createAction(TL_SET_TRAVELERS_LIST_EMBED_DATA, (embed) => embed);

export const setTravelersListSorter = (sortBy) => {
  return (dispatch, getState) => {
    const prevSortBy = getState().travelersList.sortBy;
    const alphabetical = prevSortBy === sortBy ? !getState().travelersList.alphabetical : true;
    dispatch({
      type: TL_SET_TRAVELERS_LIST_SORTER,
      payload: {
        alphabetical,
        sortBy
      }
    });
    const state = getState();
    travelersListRequest(dispatch, state.user, state.travelersList);
  };
};

export const loadTravelersList = () => {
  return (dispatch, getState) => {
    const state = getState();
    return travelersListRequest(dispatch, state.user, state.travelersList);
  };
};
export const clearTravelersListFilter = () => {
  return (dispatch, getState) => {
    dispatch({ type: TL_CLEAR_TRAVELERS_LIST_FILTER });
    dispatch({
      type: TL_SWITCH_TRAVELERS_LIST_PAGE,
      payload: 1
    });
    const state = getState();
    travelersListRequest(dispatch, state.user, state.travelersList);
  };
};
export const setTravelersListFilter = (filter) => {
  return (dispatch, getState) => {
    dispatch({
      type: TL_SWITCH_TRAVELERS_LIST_PAGE,
      payload: 1
    });
    dispatch({
      type: TL_SET_TRAVELERS_LIST_FILTER,
      payload: filter
    });
    const state = getState();
    travelersListRequest(dispatch, state.user, state.travelersList);
  };
};
export const switchTravelersListPage = (page) => {
  return (dispatch, getState) => {
    dispatch({
      type: TL_SWITCH_TRAVELERS_LIST_PAGE,
      payload: page
    });
    const state = getState();
    travelersListRequest(dispatch, state.user, state.travelersList);
  };
};

export const actions = {
  loadTravelersList,
  clearTravelersListFilter,
  setTravelersListFilter,
  switchTravelersListPage,
  setTravelersListSorter
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TL_SET_TRAVELERS_LIST]: (state, { payload }) => {
    return { ...state, travelers: payload, loading: false };
  },
  [TL_SET_TRAVELERS_LIST_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [TL_LOAD_TRAVELERS_LIST]: (state) => {
    return { ...state, loading: true };
  },
  [TL_SET_TRAVELERS_LIST_FILTER]: (state, { payload }) => {
    return {
      ...state,
      filter: {
        ...payload
      }
    };
  },
  [TL_SWITCH_TRAVELERS_LIST_PAGE]: (state, { payload }) => {
    return { ...state, page: payload };
  },
  [TL_SET_TRAVELERS_LIST_SORTER]: (state, { payload }) => {
    return { ...state, alphabetical: payload.alphabetical, sortBy: payload.sortBy };
  },
  [TL_SET_TRAVELERS_LIST_META]: (state, { payload }) => {
    return { ...state, metaData: payload };
  },
  [TL_SET_TRAVELERS_LIST_EMBED_DATA]: (state, { payload }) => {
    return {
      ...state,
      companies: payload.companies || [],
      costCenters: payload.costCenters || []
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
  [TL_CLEAR_TRAVELERS_LIST_FILTER]: (state) => {
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
      return {
        ...state,
        travelers: [
          ...state.travelers.slice(0, index),
          updatedTraveler,
          ...state.travelers.slice(index + 1)
        ]
      };
    } else {
      const updatedTraveler = {
        ...payload
      };

      return {
        ...state,
        travelers: [
          updatedTraveler,
          ...state.travelers.slice(0, state.travelers.length)
        ]
      };
    }
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateTravelersList = (state) => state.travelersList.travelers;
export const stateTravelersListFilter = (state) => state.travelersList.filter;
export const stateTravelersListLoading = (state) => state.travelersList.loading;
export const stateTravelersListPage = (state) => state.travelersList.page;
export const stateTravelersListMetaData = (state) => state.travelersList.metaData;
export const stateTravelersListCompanies = (state) => state.travelersList.companies;
export const stateTravelersListCostCenters = (state) => state.travelersList.costCenters;
export const stateTravelersListSortBy = (state) => state.travelersList.sortBy;
export const stateTravelersListSortByDirect = (state) => state.travelersList.alphabetical;
