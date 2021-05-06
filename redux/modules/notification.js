import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
} from '../constants';

// ------------------------------------
// Actions
// ------------------------------------
export const showNotification = createAction(SHOW_NOTIFICATION, (options) => options);
export const hideNotification = createAction(HIDE_NOTIFICATION);

export const actions = {
  showNotification,
  hideNotification
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  uid: '',
  title: '',
  message: '',
  position: 'tc',
  autoDismiss: 4,
  level: 'error'
};

export default handleActions({
  [SHOW_NOTIFICATION]: (state, { payload }) => {
    return { ...state, ...payload, uid: new Date().valueOf() };
  },
  [HIDE_NOTIFICATION]: () => {
    return { ...initialState };
  }
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateNotification = createSelector(
  (state) => state.notification.uid,
  (state) => state.notification.title,
  (state) => state.notification.message,
  (state) => state.notification.position,
  (state) => state.notification.autoDismiss,
  (state) => state.notification.level,
  (uid, title, message, position, autoDismiss, level) => {
    return { uid, title, message, position, autoDismiss, level };
  }
);
