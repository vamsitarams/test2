import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import i18nTools from '../../helpers/i18nTools';
import userSettings from '../../helpers/userSettings';

import { actions as notificationActions } from '../../redux/modules/notification';

import {
  US_PENDING_REQUEST,
  US_RECEIVE_USER,
  US_UPDATE_COMPLETED,
  US_ERROR_LODING_USER,
  US_APPLY_SETTINGS
} from '../constants';

export const initialState = {
  loadingSettings: false,
  settings: userSettings
};

// ------------------------------------
// Actions
// ------------------------------------
const loadUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: US_PENDING_REQUEST });
    serverApi.getUser(getState().user._id.$oid)
      .then((result) => {
        if (result.data && result.data.data && result.data.data[0]) {
          dispatch({
            type: US_RECEIVE_USER,
            payload: result.data.data[0]
          });
        } else {
          throw new Error(i18nTools.l('Invalid data: load user'));
        }
        return result;
      })
      .catch(serverApi.catchErrors.bind(this, dispatch, US_ERROR_LODING_USER));
  };
};

const saveSettings = (settings) => {
  return (dispatch, getState) => {
    dispatch({ type: US_APPLY_SETTINGS, payload: { settings } });
    dispatch({ type: US_PENDING_REQUEST });

    serverApi.editUser(
      settings,
      getState().user.organization._id.$oid,
      getState().user._id.$oid,
      null
    ).then((res) => {
      dispatch({ type: US_UPDATE_COMPLETED });
      dispatch(notificationActions.showNotification({
        message: i18nTools.l('Successfully saved'),
        level: 'success'
      }));
    }).catch((err) => {
      dispatch(notificationActions.showNotification({
        message: err || i18nTools.l('Error while saving'),
        level: 'error'
      }));
    });
  };
};

export const actions = {
  loadUser,
  saveSettings
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [US_PENDING_REQUEST]: (state) => ({
    ...state,
    loadingSettings: true
  }),
  [US_UPDATE_COMPLETED]: (state) => ({
    ...state,
    loadingSettings: false
  }),
  [US_ERROR_LODING_USER]: (state) => ({
    ...state,
    loadingSettings: false
  }),
  [US_APPLY_SETTINGS]: (state, { payload }) => ({
    ...state,
    ...payload
  }),
  [US_RECEIVE_USER]: (state, { payload }) => ({
    ...state,
    settings: {
      ...state.settings,
      ...payload.notificationSettings,
      ...payload.filters
    },
    loadingSettings: false
  })
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateUserSettings = (state) => state.userSettings.settings;
export const stateLoadingSettings = (state) => state.userSettings.loadingSettings;
