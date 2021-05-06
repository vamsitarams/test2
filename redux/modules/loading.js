import { createAction, handleActions } from 'redux-actions';
import {
  START_LOADING,
  STOP_LOADING,
  LOG_IN_FAILED
} from '../constants';

// ------------------------------------
// Actions
// ------------------------------------
export const showLoading = createAction(START_LOADING, () => true);
export const hideLoading = createAction(STOP_LOADING, () => false);

export const actions = {
  showLoading,
  hideLoading
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [START_LOADING]: () => {
    return true;
  },
  [STOP_LOADING]: () => {
    return false;
  },
  [LOG_IN_FAILED]: () => {
    return false;
  }
}, false);
