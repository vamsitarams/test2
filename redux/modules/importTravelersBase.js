import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { createSelector } from 'reselect';

import {
  IT_BASE_REQUEST_GET,
  IT_BASE_REQUEST_SET,
  IT_BASE_REQUEST_ERROR
} from '../constants';

const initialState = {
  baseFile: {},
  loading: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const requestImportTravelersBase = () => {
  return (dispatch, getState) => {
    dispatch({ type: IT_BASE_REQUEST_GET });
    return serverApi.getTravelersImportBase().then(function (result) {
      if (result.status === 200 && result.data && result.data.success) {
        if (result.data.success === true) {
          dispatch({
            type: IT_BASE_REQUEST_SET,
            payload: { content: result.data.content }
          });
        } else {
          // throw new Error(result.data.message);
        }
      } else {
        // throw new Error('Invalid data: Import Travelers Base File');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, IT_BASE_REQUEST_ERROR));
  };
};

export const actions = {
  requestImportTravelersBase
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [IT_BASE_REQUEST_GET]: (state) => {
    return { ...state, loading: true };
  },
  [IT_BASE_REQUEST_SET]: (state, { payload }) => {
    return { ...state, baseFile: payload, loading: false };
  },
  [IT_BASE_REQUEST_ERROR]: (state) => {
    return { ...state, loading: false };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateImportTravelersBase = createSelector(
  (state) => state.importTravelersBase.baseFile,
  (state) => state.importTravelersBase.loading,
  (baseFile, loading) => {
    return ({
      baseFile,
      loading
    });
  }
);
