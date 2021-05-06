import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import i18nTools from '../../helpers/i18nTools';
import { push } from 'connected-react-router';

import { actions as notificationActions } from '../../redux/modules/notification';
import { actions as userActions } from '../../redux/modules/user';

import {
  UM_FORM_LOAD_USER,
  UM_FORM_LOAD_USER_ERROR,
  UM_FORM_SET_USER,
  UM_FORM_SET_ORGANIZATION,
  UM_FORM_SET_SORT_LEVEL_IDS,
  UM_SHOW_SAVE_USER_LOADING,
  UM_SAVE_USER_ERROR,
  UM_USER_UPDATED,
  UM_ADDED_USER_SAVED,
  UM_HIDE_SAVE_LOADING,
  UM_BLOCK_USER_LOADING,
  UM_BLOCK_USER_ERROR,
  UM_USER_BLOCKED_STATUS_CHANGED,
  UM_RESET_FORM,
  UM_RESET_PASSWORD_LOADING,
  UM_PASSWORD_CHANGED,
  UM_RESET_PASSWORD_ERROR,
  UM_USER_DATA_UPDATED
} from '../constants';

const initialState = {
  user: {},
  blockLoading: false,
  resetPasswordLoading: false,
  userLoading: true,
  organization: {},
  sortLevelIds: [],
  formLoading: false,
  errorMessage: ''
};

// ------------------------------------
// Actions
// ------------------------------------
export const loadUser = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: UM_FORM_LOAD_USER });
    serverApi.getUser(id).then(function (result) {
      if (result.data && result.data.data && result.data.data[0]) {
        dispatch({
          type: UM_FORM_SET_USER,
          payload: result.data.data[0]
        });
      } else {
        throw new Error('Invalid data: edit user from, load user');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, UM_FORM_LOAD_USER_ERROR));
  };
};

export const loadSortLevelIds = (id) => {
  return (dispatch, getState) => {
    return serverApi.getUserSortLevelIdList(id).then(function (result) {
      if (result.data && result.data.data) {
        dispatch({
          type: UM_FORM_SET_SORT_LEVEL_IDS,
          payload: result.data.data
        });
      } else {
        throw new Error('Invalid data: add/edit user from, load organisations list');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch));
  };
};

export const loadOrganization = (organizationId) => {
  return (dispatch, getState) => {
    serverApi.getOrganization({ organizationId }).then((result) => {
      if (result.data && result.data.data && result.data.data[0]) {
        dispatch({
          type: UM_FORM_SET_ORGANIZATION,
          payload: result.data.data[0]
        });
      } else {
        throw new Error('Invalid data: add/edit user from, load organization');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch));
  };
};

export const saveUser = (params, companyId, id, etag, backLink) => {
  return (dispatch, getState) => {
    dispatch({ type: UM_SHOW_SAVE_USER_LOADING });
    if (id) {
      // Save existing user
      serverApi.editUser(params, companyId, id, etag).then(function (result) {
        if (result.data && result.data._id && result.data._etag) {
          dispatch(notificationActions.showNotification({
            message: i18nTools.l('User Updated'),
            level: 'success'
          }));
          console.log(result.data);
          dispatch({
            type: UM_USER_UPDATED,
            payload: result.data
          });
        } else {
          dispatch({ type: UM_HIDE_SAVE_LOADING });
          throw new Error('Invalid data: edit user form, save user');
        }
        return result;
      }).catch((error) => {
        if (error.status === 400) {
          dispatch({
            type: UM_SAVE_USER_ERROR,
            payload: error.data.errorMessage
          });
        } else {
          serverApi.catchErrors.bind(this, dispatch, UM_HIDE_SAVE_LOADING);
        }
      });
    } else {
      // Add new user
      serverApi.addUser(params, companyId).then(function (result) {
        console.log(result);
        if (result.data && result.data._id) {
          dispatch(notificationActions.showNotification({
            message: i18nTools.l('User Added'),
            level: 'success'
          }));
          dispatch({ type: UM_ADDED_USER_SAVED });
          dispatch(push(backLink));
        } else {
          throw new Error('Invalid data: add user form, add user');
        }
        return result;
      }).catch((error) => {
        if (error.status === 400) {
          dispatch({
            type: UM_SAVE_USER_ERROR,
            payload: error.data.errorMessage
          });
        } else {
          serverApi.catchErrors.bind(this, dispatch, UM_HIDE_SAVE_LOADING);
        }
      });
    }
  };
};

export const resetForm = () => {
  return (dispatch, getState) => {
    dispatch({
      type: UM_RESET_FORM
    });
  };
};

export const blockUserRequest = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: UM_BLOCK_USER_LOADING });
    serverApi.blockUser(id).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch({ type: UM_USER_BLOCKED_STATUS_CHANGED, status: 'blocked' });
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('User blocked'),
          level: 'success'
        }));
      } else {
        throw new Error('Invalid data: block user');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, UM_BLOCK_USER_ERROR));
  };
};

export const unblockUserRequest = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: UM_BLOCK_USER_LOADING });
    serverApi.unblockUser(id).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch({ type: UM_USER_BLOCKED_STATUS_CHANGED, status: 'active' });
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('User unblocked'),
          level: 'success'
        }));
      } else {
        throw new Error('Invalid data: unblock user');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, UM_BLOCK_USER_ERROR));
  };
};

export const cancelForm = (url) => {
  return (dispatch, getState) => {
    dispatch(push(url));
  };
};

export const resetPassword = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: UM_RESET_PASSWORD_LOADING });
    serverApi.resetPasswordRequest(id).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('Email with reset password link has been sent'),
          level: 'success'
        }));
        dispatch({
          type: UM_PASSWORD_CHANGED,
          payload: { ...result.data, status: 'active' }
        });
      } else {
        throw new Error('Server error, please try again later');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, UM_RESET_PASSWORD_ERROR));
  };
};

export const updateUserData = (user) => {
  return (dispatch, getState) => {
    const currentUserRole = getState().user;
    if (currentUserRole && currentUserRole._id &&
      user._id.$oid === currentUserRole._id.$oid &&
      user.roleName !== currentUserRole.roleName
    ) {
      dispatch(notificationActions.showNotification({
        message: i18nTools.l('Your role has been changed'),
        level: 'warning'
      }));
      dispatch(userActions.logOutUser());
      return;
    }

    dispatch({
      type: UM_USER_DATA_UPDATED,
      payload: user
    });
  };
};

export const actions = {
  loadUser,
  loadSortLevelIds,
  loadOrganization,
  resetForm,
  saveUser,
  blockUserRequest,
  unblockUserRequest,
  cancelForm,
  resetPassword,
  updateUserData
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [UM_FORM_LOAD_USER]: (state) => {
    return {
      ...state,
      userLoading: true
    };
  },
  [UM_FORM_SET_USER]: (state, { payload }) => {
    return {
      ...state,
      user: payload,
      userLoading: false,
      errorMessage: ''
    };
  },
  [UM_FORM_SET_SORT_LEVEL_IDS]: (state, { payload }) => {
    return {
      ...state,
      sortLevelIds: payload
    };
  },
  [UM_FORM_SET_ORGANIZATION]: (state, { payload }) => {
    return {
      ...state,
      organization: payload
    };
  },
  [UM_USER_UPDATED]: (state, { payload }) => {
    return {
      ...state,
      user: {
        ...state.user,
        _etag: {
          $oid: payload._etag
        }
      },
      formLoading: false
    };
  },
  [UM_ADDED_USER_SAVED]: (state) => {
    return { ...state, initialState };
  },
  [UM_SHOW_SAVE_USER_LOADING]: (state) => {
    return { ...state, errorMessage: '', formLoading: true };
  },
  [UM_HIDE_SAVE_LOADING]: (state) => {
    return { ...state, formLoading: false };
  },
  [UM_SAVE_USER_ERROR]: (state, { payload }) => {
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
  [UM_BLOCK_USER_LOADING]: (state) => {
    return {
      ...state,
      blockLoading: true
    };
  },
  [UM_BLOCK_USER_ERROR]: (state) => {
    return {
      ...state,
      blockLoading: false
    };
  },
  [UM_USER_BLOCKED_STATUS_CHANGED]: (state, { status }) => {
    return {
      ...state,
      blockLoading: false,
      user: {
        ...state.user,
        status: status
      }
    };
  },
  [UM_RESET_FORM]: () => {
    return { ...initialState };
  },
  [UM_RESET_PASSWORD_LOADING]: (state) => {
    return {
      ...state,
      resetPasswordLoading: true
    };
  },
  [UM_PASSWORD_CHANGED]: (state, { payload }) => {
    return {
      ...state,
      user: {
        ...state.user,
        _etag: {
          $oid: payload._etag
        }
      },
      resetPasswordLoading: false
    };
  },
  [UM_RESET_PASSWORD_ERROR]: (state) => {
    return {
      ...state,
      resetPasswordLoading: false
    };
  },
  [UM_USER_DATA_UPDATED]: (state, { payload }) => {
    const newUser = payload;
    const currentUser = state.user;
    const id = newUser._id.$oid;
    if (currentUser._id && currentUser._id.$oid && currentUser._id.$oid === id) {
      let newState;
      if (currentUser.status !== newUser.status) {
        // Change user blocked status by pusher update in order to avoid extra checking
        newState = {
          ...state,
          user: {
            ...currentUser,
            ...newUser
          },
          blockLoading: false
        };
      } else {
        newState = {
          ...state,
          user: {
            ...currentUser,
            ...newUser
          }
        };
      }
      return newState;
    } else {
      return { ...state };
    }
  }
}, initialState);

export const stateUser = (state) => state.userManager.user;
export const stateUserLoading = (state) => state.userManager.userLoading;
export const stateSortLevelIds = (state) => state.userManager.sortLevelIds;
export const stateFormLoading = (state) => state.userManager.formLoading;
export const stateOrganization = (state) => state.userManager.organization;
export const stateErrorMessage = (state) => state.userManager.errorMessage;
export const stateBlockLoading = (state) => state.userManager.blockLoading;
export const stateResetPasswordLoading = (state) => state.userManager.resetPasswordLoading;
