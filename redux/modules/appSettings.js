import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { createSelector } from 'reselect';
import $ from 'jquery';
import { localStorage } from '../../helpers/localStorage';
import { push } from 'connected-react-router';

import {
  APS_REQUEST_APP_SETTINGS,
  APS_APP_SETTINGS_ERROR,
  APS_SET_APP_SETTINGS,
  APS_CHANGE_DIMENSIONS_APP_SETTINGS,
  APS_TOGGLE_SIDE_NAV
} from '../constants';

const initialState = {
  constants: null,
  dimensions: {
    width: 0,
    height: 0
  },
  loading: false,
  layoutSettings: {
    sideMenuOpened: true
  }
};

// ------------------------------------
// Actions
// ------------------------------------
export const navigateTo = (path) => {
  return dispath => {
    dispath(push(path));
  };
};

export const requestAppSettings = () => {
  return (dispatch, getState) => {
    dispatch({
      type: APS_REQUEST_APP_SETTINGS
    });
    serverApi.getSettings().then(function (result) {
      const constants = result.data;
      if (constants && constants.caseActions) {
        dispatch({
          type: APS_SET_APP_SETTINGS,
          payload: constants
        });
        localStorage.set('appSettings', getState().appSettings);
      } else {
        throw new Error('Invalid data: app settings');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, APS_APP_SETTINGS_ERROR));
  };
};

export const changeDimensions = (dimensions) => {
  return (dispatch, getState) => {
    dispatch({
      type: APS_CHANGE_DIMENSIONS_APP_SETTINGS,
      payload: dimensions
    });
    localStorage.set('appSettings', getState().appSettings);
  };
};
export const toggleSidebar = (sideNavState) => {
  return (dispatch, getState) => {
    dispatch({
      type: APS_TOGGLE_SIDE_NAV,
      payload: sideNavState
    });
    localStorage.set('appSettings', getState().appSettings);
    $(window).trigger('layout-changes');
    setTimeout(window.dispatchEvent(new Event('resize')), 50);
  };
};

export const actions = {
  requestAppSettings,
  changeDimensions,
  toggleSidebar,
  navigateTo
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [APS_REQUEST_APP_SETTINGS]: (state) => {
    return { ...state, loading: true };
  },
  [APS_APP_SETTINGS_ERROR]: (state) => {
    return { ...state, loading: false };
  },
  [APS_SET_APP_SETTINGS]: (state, { payload }) => {
    return { ...state, constants: payload, loading: false };
  },
  [APS_CHANGE_DIMENSIONS_APP_SETTINGS]: (state, { payload }) => {
    return { ...state, dimensions: payload };
  },
  [APS_TOGGLE_SIDE_NAV]: (state) => {
    return {
      ...state,
      layoutSettings: {
        sideMenuOpened: !state.layoutSettings.sideMenuOpened
      }
    };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateAppSettings = createSelector(
  (state) => state.appSettings.constants,
  (state) => state.appSettings.dimensions.width,
  (state) => state.appSettings.dimensions.height,
  (state) => state.appSettings.loading,
  (constants, width, height, loading) => {
    return ({
      constants,
      dimensions: {
        width,
        height
      },
      loading
    });
  }
);

export const stateAppSettingsDimensions = createSelector(
  (state) => state.appSettings.dimensions.width,
  (state) => state.appSettings.dimensions.height,
  (width, height) => {
    return {
      width,
      height
    };
  }
);

export const stateAppSettingsConstants = (state) => state.appSettings.constants;
export const stateSideMenuOpened = (state) => state.appSettings.layoutSettings.sideMenuOpened;
