import { createAction, handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import PusherService from '../../helpers/pusher';
import getDeviceId from '../../helpers/getDeviceId';
import { localStorage, sessionStorage } from '../../helpers/localStorage';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';
import { messageBroadcast } from '../../helpers/tabCommunication';
import i18nTools from '../../helpers/i18nTools';

import { actions as notificationActions } from './notification';
import { actions as loadingActions } from './loading';

import {
  LOG_IN_USER,
  SET_TOKENS,
  LOG_OUT_USER,
  LOGGED_IN_USER,
  LOG_IN_FAILED,
  REFRESH_TOKENS,
  REQUEST_HASH_CODE,
  SAVE_NEW_PASSWORD,
  UM_USER_DATA_UPDATED,
  ERROR_STATUS,
  TOGGLE_ERROR_FLAG
} from '../constants';

let tokenRefreshTimeout;
// let pingRefreshTimeout;

// ------------------------------------
// Actions
// ------------------------------------
export const logInFailed = createAction(LOG_IN_FAILED);

export const loggedInUser = (user = {}, refresh) => {
  return (dispatch, getState) => {
    localStorage.set('user', user);
    const dashboardPath = sessionStorage.get('dashboardPath') ? sessionStorage.get('dashboardPath') : '/';
    if (refresh && dashboardPath) {
      const roleName = sessionStorage.get('dashboardRole');
      sessionStorage.remove('dashboardPath');
      sessionStorage.remove('dashboardRole');
      if (!roleName || roleName === user.roleName) {
        window.location = dashboardPath;
      } else {
        window.location.reload();
      }
      return;
    }

    const currentDate = new Date();
    const expiredDate = new Date(user.sessionExpiration);
    const askTokensTime = expiredDate - currentDate - 30000;
    //    let askPingTime = 5 * 60000; // 5 min
    const userId = user._id.$oid;

    const deviceToken = user.deviceToken;

    serverApi.setTokensParams({
      identityId: user.identityId,
      token: deviceToken,
      deviceAccessKey: user.deviceAccessKey,
      deviceSecretKey: user.deviceSecretKey,
      deviceSessionToken: user.deviceSessionToken
    });
    serverApi.setAuthToken(user.authToken);

    dispatch({
      type: LOGGED_IN_USER,
      payload: user
    });

    if (!PusherService.isActive) {
      PusherService.init(
        user.pusherKey,
        user.pusherCluster
      );
    }

    messageBroadcast({ type: 'login' });

    if (tokenRefreshTimeout) clearTimeout(tokenRefreshTimeout);

    tokenRefreshTimeout = setTimeout(() => {
      serverApi.refreshTokens({
        subscriberId: userId,
        token: deviceToken,
        identityId: user.identityId
      }).then(function (result) {
        if (result.data && result.data.deviceAccessKey) {
          const updatedUser = Object.assign({}, user, result.data);
          dispatch({ type: REFRESH_TOKENS });
          dispatch(loggedInUser(updatedUser));
        } else {
          dispatch(logOutUser());
        }
      }).catch(function (result) {
        dispatch(logOutUser());
      });
    }, askTokensTime);

    //    // refresh user session
    //    if (pingRefreshTimeout) clearInterval(pingRefreshTimeout);
    //    pingRefreshTimeout = setInterval(() => {
    //      serverApi.webPingPost();
    //    }, askPingTime);
    //    serverApi.webPingPost();
  };
};

export const logOutUser = () => {
  return (dispatch, getState) => {
    let pathname = (
      getState().router.location && getState().router.location.pathname || '/'
    );
    if (pathname === '/login') {
      pathname = '/';
    }
    sessionStorage.set('dashboardPath', pathname);
    sessionStorage.set('dashboardRole', getState().user.roleName);
    dispatch({
      type: LOG_OUT_USER
    });
    messageBroadcast({ type: 'logout' });
    //    if (pingRefreshTimeout) clearInterval(pingRefreshTimeout);
    localStorage.remove('user');
    dispatch(push('/login'));
    dispatch({ type: 'RESET' });
  };
};

export const logInUser = (email, password) => {
  return (dispatch, getState) => {
    dispatch({
      type: LOG_IN_USER
    });
    dispatch(loadingActions.showLoading());
    const deviceId = getDeviceId();
    serverApi.login({
      userName: email,
      password: password,
      deviceId: deviceId,
      applicationName: 'dashboard'
    }).then(function (result) {
      dispatch(loadingActions.hideLoading());
      const users = result.data.subscribers;
      if (result.data.errorType === 'Error') {
        throw result.data.errorMessage;
      }

      if (users.length) {
        const user = users[0];
        dispatch(loggedInUser(user, true));
      }
      return result;
    }).catch(error => dispatch({ type: ERROR_STATUS, payload: error.response.data.errorMessage }));
  };
};

export const requestHashCode = (l, email, resetLink) => {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_HASH_CODE });
    serverApi.webPasswordResetPost(email, resetLink).then(function (result) {
      if (result.data && result.data._id && result.data._etag) {
        dispatch(notificationActions.showNotification({
          message: l('Check your email'),
          level: 'success'
        }));
        localStorage.set('passRequestEmail', email);
      } else {
        throw new Error(i18nTools.l(
          (
            result.data && result.data.errorMessage
              ? result.data.errorMessage
              : 'It is not possible to complete this operation due to server error, please try again letter'
          )
        ));
      }
    }).catch(error => dispatch({ type: ERROR_STATUS, payload: error.response.data.errorMessage }));
  };
};

export const saveNewPassword = (l, password, code) => {
  return (dispatch, getState) => {
    dispatch({ type: SAVE_NEW_PASSWORD });
    const email = localStorage.get('passRequestEmail');
    serverApi.saveNewPassword(password, code, email).then(function (result) {
      if (result.data.errors) {
        throw result;
      }
      if (result) {
        dispatch(notificationActions.showNotification({
          message: l('Please login with new password'),
          level: 'success'
        }));
        localStorage.remove('passRequestEmail');
        dispatch(push('/login'));
      }
    }).catch(error => dispatch({ type: ERROR_STATUS, payload: error.response.data.errorMessage }));
  };
};
export const toggleError = () => {
  console.log('ToggleError');
  return {
    type: TOGGLE_ERROR_FLAG,
    payLoad: false
  };
};
export const getGuestTokens = () => {
  return (dispatch, getState) => {
    serverApi.getGuestToken().then(function (result) {
      const tokens = result.data;
      if (tokens.identityId) {
        dispatch({
          type: SET_TOKENS,
          payload: tokens.identityId
        });
        serverApi.setTokensParams(tokens);
      }
      return result;
    }).catch(function (result) {
      console.error(result);
    });
  };
};

export const actions = {
  logInUser,
  logOutUser,
  loggedInUser,
  logInFailed,
  getGuestTokens,
  requestHashCode,
  saveNewPassword,
  toggleError
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_TOKENS]: (state, { payload }) => {
    return { ...state, identityId: payload };
  },
  [ERROR_STATUS]: (state, { payload }) => {
    return { ...state, errorMessage: payload, errorFlag: true };
  },
  [TOGGLE_ERROR_FLAG]: (state, { payload }) => {
    console.log('Flag');
    return { ...state, errorMessage: undefined, errorFlag: payload };
  },
  [LOG_IN_USER]: (state, { payload }) => {
    return { ...state, isAuthenticated: false, logIn: true };
  },
  [LOG_OUT_USER]: () => {
    return { isAuthenticated: false, logIn: false };
  },
  [LOGGED_IN_USER]: (state, { payload }) => {
    return { ...payload, isAuthenticated: true, logIn: false };
  },
  [LOG_IN_FAILED]: (state) => {
    return { ...state, isAuthenticated: false, logIn: false };
  },
  [UM_USER_DATA_UPDATED]: (state, { payload }) => {
    const id = payload._id.$oid;
    if (state._id && state._id.$oid && state._id.$oid === id) {
      return {
        ...state,
        ...payload
      };
    } else {
      return { ...state };
    }
  }
}, { isAuthenticated: false, logIn: false });

// ------------------------------------
// Selector
// ------------------------------------
export const stateUser = createSelector(
  (state) => state.user._id && state.user._id.$oid ? state.user._id.$oid : '',
  (state) => state.user.identityId,
  (state) => state.user.firstName,
  (state) => state.user.lastName,
  (state) => state.user.emails,
  (state) => state.user.worldHubUrl,
  (state) => state.user.organization,
  (state) => state.user.agencies,
  (state) => state.user.status,
  (state) => state.user.userName,
  (state) => state.user.phoneNumbers,
  (state) => state.user.logIn,
  (state) => state.user.isAuthenticated,
  (state) => state.user.roleName,
  (state) => state.user.organizations,
  (_id, identityId, firstName, lastName, emails, worldHubUrl, organization, agencies,
    status, userName, phoneNumbers, logIn, isAuthenticated, roleName, organizations) => {
    return ({
      _id,
      identityId,
      firstName,
      lastName,
      emails,
      worldHubUrl,
      organization,
      agencies,
      status,
      userName,
      phoneNumbers,
      logIn,
      isAuthenticated,
      roleName,
      organizations
    });
  }
);

export const stateUserRole = (state) => state.user.roleName;
