import { handleActions } from 'redux-actions';
import serverApi from '../../helpers/serverApi';
import { createSelector } from 'reselect';
import { actions as notificationActions } from '../../redux/modules/notification';
import i18nTools from '../../helpers/i18nTools';
import { push } from 'connected-react-router';
import util from 'util';

import {
  IT_RESET_STATE,
  IT_SET_STATE_IMPORT_FILE_START,
  IT_SET_STATE_IMPORT_FILE_PROCESS,
  IT_SET_STATE_IMPORT_FILE_PREVIEW,
  IT_SET_STATE_IMPORT_FILE_ERROR,
  IT_SET_STATE_IMPORT_PROCESS_START,
  IT_SET_STATE_IMPORT_PROCESS_SUCCESS,
  IT_SET_STATE_IMPORT_PROCESS_ERROR,
  IT_SERVER_IMPORTING_START,
  IT_SERVER_IMPORTING_ERROR
} from '../constants';

export const STEP_1 = 1; // state: init
export const STEP_2 = 2; // state: loading file
export const STEP_3 = 3; // state: preview file
export const STEP_4 = 4; // state: process start
export const STEP_5 = 5; // state: process finished
export const STEP_6 = 6; // state: process error

const initialState = {
  importingState: {
    fileName: null,
    content: null,
    step: STEP_1
  },
  importStatusModal: {
    isOpen: false,
    title: null,
    message: null,
    isReUploadButton: false
  },
  serverLoading: false,
  importingErrors: null
};

// ------------------------------------
// Actions
// ------------------------------------
export const resetState = () => {
  return (dispatch, getState) => {
    dispatch({ type: IT_RESET_STATE });
  };
};

export const setStateImportProcessStart = (payload) => {
  return (dispatch, getState) => {
    dispatch({ type: IT_SET_STATE_IMPORT_PROCESS_START });
    const currState = getState().importTravelers;
    return serverApi.webTravelersImportProcessPost({}, {
      name: payload.fileName,
      content: payload.content,
      size: payload.size,
      type: payload.type
    }).then(function (result) {
      if (result.data && result.data.errorMessage) {
        dispatch({
          type: IT_SET_STATE_IMPORT_FILE_ERROR,
          payload: result.data.errorMessage.toString().replace(/Bad Request:\s?/, '')
        });
      } else if (result.data && result.data.data && result.data.meta) {
        const util = require('util');

        if (result.data.meta.fail && parseInt(result.data.meta.fail) > 0) {
          dispatch({
            type: IT_SET_STATE_IMPORT_PROCESS_ERROR,
            payload: result.data
          });

          if (currState.importingState.step !== STEP_6) {
            dispatch(push('/travelers-list'));
          }
        } else {
          dispatch({
            type: IT_SET_STATE_IMPORT_PROCESS_SUCCESS,
            payload: result.data
          });
          if (currState.importingState.step !== STEP_6) {
            let message = '';
            if (result.data.meta.success && parseInt(result.data.meta.success) > 0) {
              message += util.format(
                i18nTools.ngettext('%d traveler added', '%d travelers added', result.data.meta.success),
                result.data.meta.success
              );
            }
            if (result.data.meta.updated && parseInt(result.data.meta.updated) > 0) {
              message += util.format(
                (message.length > 0 ? ', ' : '') +
                i18nTools.ngettext('%d traveler updated', '%d traveler updated', result.data.meta.updated),
                result.data.meta.updated
              );
            }
            if (result.data.meta.duplicates && parseInt(result.data.meta.duplicates) > 0) {
              message += util.format(
                (message.length > 0 ? ', ' : '') +
                i18nTools.ngettext('%d duplicate skipped', '%d duplicates skipped', result.data.meta.duplicates),
                result.data.meta.duplicates
              );
            }

            dispatch(notificationActions.showNotification({
              message: message,
              autoDismiss: 5,
              level: (result.data.meta.fail && parseInt(result.data.meta.fail) > 0 ? 'error' : 'success')
            }));

            dispatch(push('/travelers-list'));
          }
        }
      } else {
        dispatch({
          type: IT_SET_STATE_IMPORT_FILE_ERROR,
          payload: 'Incorrect server response'
        });
      }
      return result;
    }).catch(function (result) {
      dispatch({
        type: IT_SET_STATE_IMPORT_FILE_ERROR,
        payload: (
          result.data && result.data.errorMessage
            ? result.data.errorMessage.toString().replace(/Bad Request:\s?/, '')
            : result
        )
      });
    });
  };
};

export const setStateImportFileError = (payload) => {
  return (dispatch, getState) => {
    return dispatch({ type: IT_SET_STATE_IMPORT_FILE_ERROR, payload: payload });
  };
};

export const setStateImportFileStart = (payload) => {
  return (dispatch, getState) => {
    return dispatch({ type: IT_SET_STATE_IMPORT_FILE_START, payload: payload });
  };
};

export const setStateImportFileProcess = (payload) => {
  return (dispatch, getState) => {
    return dispatch({ type: IT_SET_STATE_IMPORT_FILE_PROCESS, payload: payload });
  };
};

export const setStateImportFilePreview = (payload) => {
  return (dispatch, getState) => {
    dispatch({ type: IT_SERVER_IMPORTING_START });
    if (payload.content) {
      payload.content = Buffer.from(payload.content).toString('base64');
    } else {
      payload.content = null;
    }
    return serverApi.webTravelersImportPost({}, payload).then(function (result) {
      if (result.data && result.data.errorMessage) {
        dispatch({
          type: IT_SET_STATE_IMPORT_FILE_ERROR,
          payload: result.data.errorMessage.toString().replace(/Bad Request:\s?/, '')
        });
      } else if (result.data && result.data.data) {
        dispatch({
          type: IT_SET_STATE_IMPORT_FILE_PREVIEW,
          payload: result.data,
          content: payload.content
        });
      } else {
        dispatch({
          type: IT_SET_STATE_IMPORT_FILE_ERROR,
          payload: 'Incorrect server response'
        });
      }
      return result;
    }).catch(function (result) {
      dispatch({
        type: IT_SET_STATE_IMPORT_FILE_ERROR,
        payload: (result.data && result.data.errorMessage
          ? result.data.errorMessage.toString().replace(/Bad Request:\s?/, '')
          : result
        )
      });
    });
  };
};

export const actions = {
  // file upload actions
  resetState,
  setStateImportFileStart,
  setStateImportFileProcess,
  setStateImportFilePreview,
  setStateImportFileError,
  setStateImportProcessStart
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [IT_RESET_STATE]: (state) => {
    return { ...initialState };
  },
  [IT_SET_STATE_IMPORT_FILE_ERROR]: (state, { payload }) => {
    return {
      ...state,
      importingState: {
        ...state.importingState,
        fileName: (payload.name ? payload.name : state.importingState.fileName),
        result: null,
        step: STEP_2
      },
      importingErrors: (payload && typeof payload === 'object' ? payload.error : payload.toString()),
      serverLoading: false
    };
  },
  [IT_SET_STATE_IMPORT_PROCESS_START]: (state) => {
    return {
      ...state,
      importingState: {
        ...state.importingState,
        result: null,
        step: (state.importingState.step === STEP_6 ? STEP_6 : STEP_4)
      },
      // importStatusModal: initialState.importStatusModal,
      importingErrors: null,
      serverLoading: true
    };
  },
  [IT_SERVER_IMPORTING_START]: (state) => {
    return { ...state, importingState: { ...state.importingState, result: null }, serverLoading: true };
  },
  [IT_SERVER_IMPORTING_ERROR]: (state) => {
    return { ...state, serverLoading: false };
  },
  [IT_SET_STATE_IMPORT_FILE_START]: (state, { payload }) => {
    return {
      ...state,
      importingState: {
        fileName: payload.name,
        type: payload.type,
        size: payload.size,
        content: null,
        fileProcess: 0,
        step: STEP_2,
        result: null
      },
      importingErrors: null,
      serverLoading: true
    };
  },
  [IT_SET_STATE_IMPORT_FILE_PROCESS]: (state, { payload }) => {
    return {
      ...state,
      importingState: { ...state.importingState, fileProcess: getLoadedPercentages(payload.loaded, payload.total) }
    };
  },
  [IT_SET_STATE_IMPORT_FILE_PREVIEW]: (state, { payload, content }) => {
    const importResult = {
      meta: (payload.meta ? payload.meta : { total: 0, success: 0, fail: 0 }),
      data: (payload.data ? payload.data : [])
    };
    return {
      ...state,
      importingState: { ...state.importingState, result: importResult, step: STEP_3, content: content },
      serverLoading: false
    };
  },
  [IT_SET_STATE_IMPORT_PROCESS_SUCCESS]: (state, { payload }) => {
    if (state.importingState.step === STEP_6) {
      const importResult = {
        meta: (payload.meta ? payload.meta : { total: 0, success: 0, fail: 0 }),
        data: (payload.data ? payload.data : [])
      };

      let message = '';
      if (importResult.meta.success && parseInt(importResult.meta.success) > 0) {
        message += util.format(
          i18nTools.l('%d travelers added'),
          importResult.meta.success
        );
      }

      if (importResult.meta.updated && parseInt(importResult.meta.updated) > 0) {
        message += util.format(
          (message.length > 0 ? ', ' : '') + i18nTools.l('%d travelers updated'),
          importResult.meta.updated
        );
      }

      if (importResult.meta.duplicates && parseInt(importResult.meta.duplicates) > 0) {
        message += util.format(
          (message.length > 0 ? ', ' : '') + i18nTools.l('%d duplicates skipped'),
          importResult.meta.duplicates
        );
      }

      return {
        ...state,
        importingState: { ...initialState.importingState, step: STEP_6 },
        importStatusModal: {
          isOpen: true,
          title: i18nTools.l('Import Success!'),
          message: message,
          isReUploadButton: false
        },
        serverLoading: false
      };
    } else {
      return { ...initialState };
    }
  },
  [IT_SET_STATE_IMPORT_PROCESS_ERROR]: (state, { payload }) => {
    const importResult = {
      meta: (payload.meta ? payload.meta : { total: 0, success: 0, fail: 0 }),
      data: (payload.data ? payload.data : [])
    };
    return {
      ...state,
      importingState: { ...state.importingState, result: importResult, step: STEP_6 },
      importStatusModal: {
        isOpen: true,
        title: i18nTools.l('Partial Import!'),
        message: util.format(
          i18nTools.l('%d out of %d contacts haven\'t been imported due to server error. ' +
            'Please retry importing CSV file.'),
          importResult.meta.fail,
          importResult.meta.total
        ),
        isReUploadButton: true
      },
      serverLoading: false
    };
  }
}, initialState);

function getLoadedPercentages (loaded, total) {
  const percent = Math.round((loaded / total) * 100);
  return (percent >= 98 ? 90 : percent);
}

// ------------------------------------
// Selector
// ------------------------------------
export const stateImportTravelers = createSelector(
  (state) => state.importTravelers.serverLoading,
  (state) => state.importTravelers.importingState,
  (state) => state.importTravelers.importStatusModal,
  (state) => state.importTravelers.importingErrors,
  (serverLoading, importingState, importStatusModal, importingErrors) => {
    return ({
      serverLoading,
      importingState,
      importStatusModal,
      importingErrors
    });
  }
);
