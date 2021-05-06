import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import i18nTools from '../../helpers/i18nTools';
import { push } from 'connected-react-router';
import { TYPE_AGENCY } from '../../helpers/organization';

import { actions as notificationActions } from '../../redux/modules/notification';

import {
  OM_FORM_LOAD_ORGANIZATION,
  OM_FORM_SET_ORGANIZATION,
  OM_FORM_SET_COST_CENTERS,
  OM_FORM_LOAD_ORGANIZATION_ERROR,
  OM_SHOW_SAVE_ORGANIZATION_LOADING,
  OM_SAVE_ORGANIZATION_ERROR,
  OM_ORGANIZATION_UPDATED,
  OM_ADDED_ORGANIZATION_SAVED,
  OM_HIDE_SAVE_ORGANIZATION_LOADING,
  OM_BLOCK_ORGANIZATION_LOADING,
  OM_BLOCK_ORGANIZATION_ERROR,
  OM_ORGANIZATION_BLOCKED_STATUS_CHANGED,
  OM_RESET_ORGANIZATION_FORM,
  PUSHER_UPDATE_ORGANIZATION
} from '../constants';

const initialState = {
  blockLoading: false,
  organizationLoading: true,
  organization: {},
  costCenters: [],
  formLoading: false,
  errorMessage: ''
};

// ------------------------------------
// Actions
// ------------------------------------
export const loadOrganization = (organizationId) => {
  return (dispatch) => {
    dispatch({ type: OM_FORM_LOAD_ORGANIZATION });
    return serverApi.getOrganization({ organizationId }).then((result) => {
      if (result.data && result.data.data && result.data.data[0]) {
        dispatch({
          type: OM_FORM_SET_ORGANIZATION,
          payload: result.data.data[0]
        });
      } else {
        throw new Error('Invalid data: load Organization');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, OM_FORM_LOAD_ORGANIZATION_ERROR));
  };
};

export const loadCostCenters = (organizationId) => {
  return (dispatch) => {
    return serverApi.getOrganizationCostCenters(organizationId).then(function (result) {
      if (result.data && result.data.data) {
        dispatch({
          type: OM_FORM_SET_COST_CENTERS,
          payload: result.data.data
        });
      } else {
        throw new Error('Invalid data: load Sort Level IDs');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, OM_FORM_LOAD_ORGANIZATION_ERROR));
  };
};

export const saveOrganization = (params, organizationId, etag, backLink) => {
  return (dispatch) => {
    dispatch({ type: OM_SHOW_SAVE_ORGANIZATION_LOADING });
    if (organizationId) {
      // Save existing organization
      return serverApi.patchOrganization(params, organizationId, etag).then(function (result) {
        if (result.data && result.data._id && result.data._etag) {
          dispatch(notificationActions.showNotification({
            message: i18nTools.l(
              params.type && params.type === TYPE_AGENCY
                ? 'Agency has been successfully updated'
                : 'Company has been successfully updated'
            ),
            level: 'success'
          }));
          dispatch({
            type: OM_ORGANIZATION_UPDATED,
            payload: result.data
          });
          return result;
        } else {
          throw new Error('Server Error: Unable to process data, please try again later');
        }
      }).catch((error) => {
        if (error.status === 400) {
          dispatch({
            type: OM_SAVE_ORGANIZATION_ERROR,
            payload: error.data.errorMessage
          });
        } else {
          serverApi.catchErrors.bind(this, dispatch, OM_HIDE_SAVE_ORGANIZATION_LOADING);
        }
      });
    } else {
      // Add new organization
      return serverApi.postOrganization(params).then(function (result) {
        if (result.data && result.data._id) {
          dispatch(notificationActions.showNotification({
            message: i18nTools.l(
              params.type && params.type === TYPE_AGENCY
                ? 'Agency has been successfully added'
                : 'Company has been successfully added'
            ),
            level: 'success'
          }));
          dispatch({ type: OM_ADDED_ORGANIZATION_SAVED });
          dispatch(push(backLink));
          return result;
        } else {
          throw new Error('Server Error: Unable to process data, please try again later');
        }
      }).catch((error) => {
        if (error.status === 400) {
          dispatch({
            type: OM_SAVE_ORGANIZATION_ERROR,
            payload: error.data.errorMessage
          });
        } else {
          serverApi.catchErrors.bind(this, dispatch, OM_HIDE_SAVE_ORGANIZATION_LOADING);
        }
      });
    }
  };
};

export const resetForm = () => {
  return (dispatch) => {
    dispatch({
      type: OM_RESET_ORGANIZATION_FORM
    });
  };
};

export const blockOrganizationRequest = (organization) => {
  return (dispatch) => {
    dispatch({ type: OM_BLOCK_ORGANIZATION_LOADING });
    serverApi.blockOrganization(organization._id.$oid).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch(notificationActions.showNotification({
          message: i18nTools.l(
            organization.type && organization.type === TYPE_AGENCY
              ? 'Agency has been successfully blocked'
              : 'Company has been successfully blocked'
          ),
          level: 'success'
        }));
      } else {
        throw new Error(
          i18nTools.l(
            organization.type && organization.type === TYPE_AGENCY
              ? 'It is not possible to block this agency, please try again letter'
              : 'It is not possible to block this company, please try again letter'
          )
        );
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, OM_BLOCK_ORGANIZATION_ERROR));
  };
};

export const unblockOrganizationRequest = (organization) => {
  return (dispatch) => {
    dispatch({ type: OM_BLOCK_ORGANIZATION_LOADING });
    serverApi.unblockOrganization(organization._id.$oid).then((result) => {
      if (result.data && result.data._id && result.data._etag) {
        dispatch(notificationActions.showNotification({
          message: i18nTools.l(
            organization.type && organization.type === TYPE_AGENCY
              ? 'Agency has been successfully unblocked'
              : 'Company has been successfully unblocked'
          ),
          level: 'success'
        }));
      } else {
        throw new Error(
          i18nTools.l(
            organization.type && organization.type === TYPE_AGENCY
              ? 'It is not possible to unblock this agency, please try again letter'
              : 'It is not possible to unblock this company, please try again letter'
          )
        );
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, OM_BLOCK_ORGANIZATION_ERROR));
  };
};

export const cancelForm = (url) => {
  return (dispatch) => {
    dispatch(push(url));
  };
};

export const actions = {
  loadOrganization,
  resetForm,
  saveOrganization,
  loadCostCenters,
  blockOrganizationRequest,
  unblockOrganizationRequest,
  cancelForm
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [OM_FORM_LOAD_ORGANIZATION]: (state) => {
    return {
      ...state,
      organizationLoading: true
    };
  },
  [OM_FORM_SET_COST_CENTERS]: (state, { payload }) => {
    return {
      ...state,
      costCenters: payload
    };
  },
  [OM_FORM_SET_ORGANIZATION]: (state, { payload }) => {
    return {
      ...state,
      organization: payload,
      organizationLoading: false,
      errorMessage: ''
    };
  },
  [OM_ORGANIZATION_UPDATED]: (state, { payload }) => {
    return {
      ...state,
      organization: {
        ...state.organization,
        _etag: {
          $oid: payload._etag
        }
      },
      formLoading: false,
      errorMessage: ''
    };
  },
  [OM_ADDED_ORGANIZATION_SAVED]: (state) => {
    return { ...state, initialState };
  },
  [OM_SHOW_SAVE_ORGANIZATION_LOADING]: (state) => {
    return { ...state, formLoading: true, errorMessage: '' };
  },
  [OM_HIDE_SAVE_ORGANIZATION_LOADING]: (state) => {
    return { ...state, formLoading: false };
  },
  [OM_SAVE_ORGANIZATION_ERROR]: (state, { payload }) => {
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
  [OM_BLOCK_ORGANIZATION_LOADING]: (state) => {
    return {
      ...state,
      blockLoading: true
    };
  },
  [OM_BLOCK_ORGANIZATION_ERROR]: (state) => {
    return {
      ...state,
      blockLoading: false
    };
  },
  [OM_ORGANIZATION_BLOCKED_STATUS_CHANGED]: (state, { payload }) => {
    return {
      ...state,
      organization: {
        ...state.organization,
        _etag: {
          $oid: payload._etag
        },
        status: payload.status
      }
    };
  },
  [OM_RESET_ORGANIZATION_FORM]: () => {
    return { ...initialState };
  },
  [PUSHER_UPDATE_ORGANIZATION]: (state, { payload }) => {
    const newOrganization = payload;
    const currentOrganization = state.organization;
    const id = newOrganization._id.$oid;
    if (currentOrganization._id && currentOrganization._id.$oid && currentOrganization._id.$oid === id) {
      let newState;
      if (currentOrganization.status !== newOrganization.status) {
        // Change organization blocked status by pusher update in order to avoid extra checking
        newState = {
          ...state,
          organization: {
            ...currentOrganization,
            ...newOrganization
          },
          blockLoading: false
        };
      } else {
        newState = {
          ...state,
          organization: {
            ...currentOrganization,
            ...newOrganization
          }
        };
      }
      return newState;
    } else {
      return { ...state };
    }
  }
}, initialState);

export const stateOrganization = (state) => state.organizationManager.organization;
export const stateCostCenters = (state) => state.organizationManager.costCenters;
export const stateOrganizationLoading = (state) => state.organizationManager.organizationLoading;
export const stateFormLoading = (state) => state.organizationManager.formLoading;
export const stateErrorMessage = (state) => state.organizationManager.errorMessage;
export const stateBlockLoading = (state) => state.organizationManager.blockLoading;
