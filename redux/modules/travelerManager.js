import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import i18nTools from '../../helpers/i18nTools';
import { push } from 'connected-react-router';
import { createSelector } from 'reselect';

import { actions as notificationActions } from '../../redux/modules/notification';

import {
  TM_FORM_SET_COMPANIES,
  TM_FORM_SHOW_SAVE_LOADING,
  TM_FORM_HIDE_SAVE_LOADING,
  TM_FORM_SAVE_TRAVELER_ERROR,
  TM_FORM_ADDED_TRAVELER_SAVED,
  TM_FORM_SET_TRAVELER,
  TM_FORM_LOAD_TRAVELER,
  TM_FORM_LOAD_TRAVELER_ERROR,
  TM_TRAVELER_UPDATED,
  TM_SHOW_SEND_INVITATION_LOADING,
  TM_SEND_INVITATION_ERROR,
  TM_INVITATION_SENT,
  TM_SHOW_BLOCK_USER_LOADING,
  TM_BLOCK_USER_ERROR,
  TM_USER_STATUS_CHANGED,
  PUSHER_UPDATE_TRAVELER,
  TM_RESET_FORM
} from '../constants';

const initialState = {
  traveler: {
    isVIP: true
  },
  blockLoading: false,
  sendInvitationLoading: false,
  travelerLoading: true,
  companies: [],
  sortLevelIds: [],
  formLoading: false,
  errorMessage: ''
};

// ------------------------------------
// Actions
// ------------------------------------
export const loadTraveler = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TM_FORM_LOAD_TRAVELER });
    serverApi.getTraveler({ subscriberId: id }).then(function (result) {
      if (result.data && result.data.data) {
        dispatch({
          type: TM_FORM_SET_TRAVELER,
          payload: result.data.data[0]
        });
      } else {
        throw new Error('Invalid data: edit traveler from, load traveler');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TM_FORM_LOAD_TRAVELER_ERROR));
  };
};

export const saveTraveler = (params, id, etag) => {
  return (dispatch, getState) => {
    dispatch({ type: TM_FORM_SHOW_SAVE_LOADING });
    if (id) {
      // Save existing user
      serverApi.editTraveler(params, id, etag).then(function (result) {
        if (result.data && result.data._id && result.data._etag) {
          dispatch(notificationActions.showNotification({
            message: i18nTools.l('Traveler Updated'),
            level: 'success'
          }));
          dispatch({
            type: TM_TRAVELER_UPDATED,
            payload: result.data._etag
          });
        } else {
          dispatch({ type: TM_FORM_HIDE_SAVE_LOADING });
          throw new Error('Invalid data: add traveler from, save traveler');
        }
        return result;
      }).catch((error) => {
        if (error.status === 400) {
          dispatch({
            type: TM_FORM_SAVE_TRAVELER_ERROR,
            payload: error.data.errorMessage
          });
        } else {
          serverApi.catchErrors.bind(this, dispatch, TM_FORM_HIDE_SAVE_LOADING);
        }
      });
    } else {
      // Add new user
      serverApi.addTraveler(params).then(function (result) {
        if (result.data && result.data._id) {
          dispatch(notificationActions.showNotification({
            message: i18nTools.l('Traveler Added'),
            level: 'success'
          }));
          dispatch({ type: TM_FORM_ADDED_TRAVELER_SAVED });
          dispatch(push('/travelers-list'));
        } else {
          throw new Error('Invalid data: add traveler from, save traveler');
        }
        return result;
      }).catch((error) => {
        if (error.status === 400) {
          dispatch({
            type: TM_FORM_SAVE_TRAVELER_ERROR,
            payload: error.data.errorMessage
          });
        } else {
          serverApi.catchErrors.bind(this, dispatch, TM_FORM_HIDE_SAVE_LOADING);
        }
      });
    }
  };
};

export const loadCompanies = () => {
  return (dispatch, getState) => {
    serverApi.getOrganizations({
      sort_by: 'name'
    }).then((result) => {
      if (result.data && result.data.data) {
        dispatch({
          type: TM_FORM_SET_COMPANIES,
          payload: result.data
        });
      } else {
        throw new Error('Invalid data: add traveler from, load companies');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch));
  };
};

export const sendInvitation = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TM_SHOW_SEND_INVITATION_LOADING });
    serverApi.sendInvitationToTraveler(id).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('Invitation sent'),
          level: 'success'
        }));
        dispatch({
          type: TM_INVITATION_SENT,
          payload: {
            _etag: result.data._etag,
            sendInvitationLoading: false
          }
        });
      } else {
        throw new Error('Invalid data: send invitation');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TM_SEND_INVITATION_ERROR));
  };
};

export const blockTravelerRequest = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TM_SHOW_BLOCK_USER_LOADING, payload: true });
    serverApi.blockTraveler(id).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch({ type: TM_USER_STATUS_CHANGED, status: 'blocked' });
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('Traveler blocked'),
          level: 'success'
        }));
      } else {
        throw new Error('Invalid data: block user');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TM_BLOCK_USER_ERROR));
  };
};

export const unblockTravelerRequest = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TM_SHOW_BLOCK_USER_LOADING });
    serverApi.unblockTraveler(id).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch({ type: TM_USER_STATUS_CHANGED, status: 'active' });
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('Traveler unblocked'),
          level: 'success'
        }));
      } else {
        throw new Error('Invalid data: unblock user');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, TM_BLOCK_USER_ERROR));
  };
};

export const cancelForm = (url) => {
  return (dispatch, getState) => {
    dispatch(push(url));
  };
};

export const resetForm = () => {
  return (dispatch, getState) => {
    dispatch({
      type: TM_RESET_FORM
    });
  };
};

export const actions = {
  saveTraveler,
  loadCompanies,
  loadTraveler,
  sendInvitation,
  blockTravelerRequest,
  unblockTravelerRequest,
  cancelForm,
  resetForm
};
// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TM_FORM_SHOW_SAVE_LOADING]: (state) => {
    return { ...state, formLoading: true, errorMessage: '' };
  },
  [TM_FORM_HIDE_SAVE_LOADING]: (state) => {
    return { ...state, formLoading: false };
  },
  [TM_FORM_SAVE_TRAVELER_ERROR]: (state, { payload }) => {
    let message = payload;
    const errorPrefix = 'Bad Request: ';
    const splitIndex = message.indexOf(errorPrefix);
    if (splitIndex !== -1) {
      message = message.substr(splitIndex + errorPrefix.length);
    }
    return {
      ...state,
      formLoading: false,
      errorMessage: message
    };
  },
  [TM_FORM_SET_COMPANIES]: (state, { payload }) => {
    return {
      ...state,
      companies: payload.data,
      sortLevelIds: payload.embedded.costCenters
    };
  },
  [TM_FORM_ADDED_TRAVELER_SAVED]: (state) => {
    return { ...state, initialState };
  },
  [TM_FORM_SET_TRAVELER]: (state, { payload }) => {
    return {
      ...state,
      traveler: payload,
      travelerLoading: false,
      errorMessage: ''
    };
  },
  [TM_FORM_LOAD_TRAVELER]: (state) => {
    return {
      ...state,
      travelerLoading: true
    };
  },
  [TM_FORM_LOAD_TRAVELER_ERROR]: (state) => {
    return {
      ...state,
      travelerLoading: false
    };
  },
  [TM_TRAVELER_UPDATED]: (state, { payload }) => {
    return {
      ...state,
      traveler: {
        ...state.traveler,
        _etag: {
          $oid: payload
        }
      },
      errorMessage: '',
      formLoading: false
    };
  },
  [TM_SHOW_BLOCK_USER_LOADING]: (state) => {
    return {
      ...state,
      blockLoading: true
    };
  },
  [TM_BLOCK_USER_ERROR]: (state) => {
    return {
      ...state,
      blockLoading: false
    };
  },
  [TM_USER_STATUS_CHANGED]: (state, { status }) => {
    return {
      ...state,
      blockLoading: false,
      traveler: {
        ...state.traveler,
        status: status
      }
    };
  },
  [TM_SHOW_SEND_INVITATION_LOADING]: (state) => {
    return {
      ...state,
      sendInvitationLoading: true
    };
  },
  [TM_SEND_INVITATION_ERROR]: (state) => {
    return {
      ...state,
      sendInvitationLoading: false
    };
  },
  [TM_INVITATION_SENT]: (state, { payload }) => {
    return {
      ...state,
      traveler: {
        ...state.traveler,
        _etag: {
          $oid: payload._etag
        }
      },
      sendInvitationLoading: false
    };
  },
  [PUSHER_UPDATE_TRAVELER]: (state, { payload }) => {
    const newTraveler = payload;
    const currentTraveler = state.traveler;
    const id = newTraveler._id.$oid;
    if (currentTraveler._id && currentTraveler._id.$oid && currentTraveler._id.$oid === id) {
      let newState;
      if (currentTraveler.status !== newTraveler.status) {
        newState = {
          ...state,
          traveler: {
            ...currentTraveler,
            ...newTraveler
          },
          blockLoading: false
        };
      } else {
        newState = {
          ...state,
          traveler: {
            ...currentTraveler,
            ...newTraveler
          }
        };
      }
      return newState;
    } else {
      return { ...state };
    }
  },
  [TM_RESET_FORM]: () => {
    return { ...initialState };
  }
}, initialState);
export const stateTraveler = (state) => state.travelerManager.traveler;
export const stateErrorMessage = (state) => state.travelerManager.errorMessage;
export const stateFormLoading = (state) => state.travelerManager.formLoading;
export const stateTravelerLoading = (state) => state.travelerManager.travelerLoading;
export const stateCompaniesAndCostCenters = createSelector(
  (state) => state.travelerManager.companies,
  (state) => state.travelerManager.sortLevelIds,
  (companies, sortLevelIds) => {
    return {
      companies,
      sortLevelIds
    };
  }
);
export const stateBlockLoading = (state) => state.travelerManager.blockLoading;
export const stateSendInvitationLoading = (state) => state.travelerManager.sendInvitationLoading;
