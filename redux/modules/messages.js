import serverApi from '../../helpers/serverApi';
import moment from 'moment';
import findIndex from 'lodash/findIndex';
import { createAction, handleActions } from 'redux-actions';
import { actions as travelerDetailsActions } from './travelerDetails';

import {
  REQUEST_LAST_MESSAGES,
  SET_LAST_MESSAGES,
  SET_VIEWED_MESSAGES,
  UPDATE_VIEWED_MESSAGES,
  ADD_NEW_LAST_MESSAGE,
  REMOVE_LAST_MESSAGE,
  LAST_MESSAGES_ERROR,
  PUSHER_UPDATE_TRAVELER,
  PUSHER_UPDATE_TRAVELER_HELPEDBY
} from '../constants';

const initialState = {
  lastMessages: [],
  loading: false,
  viewedMessages: []
};

// ------------------------------------
// Actions
// ------------------------------------
export const getViewedMessages = () => {
  return (dispatch, getState) => {
    dispatch({ type: SET_VIEWED_MESSAGES });
  };
};

export const updateViewedMessages = (messageId) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_VIEWED_MESSAGES, payload: messageId });
    serverApi.markMessageAsRead(messageId);
  };
};

export const requestLastMessages = () => {
  return (dispatch) => {
    dispatch({ type: REQUEST_LAST_MESSAGES });
    serverApi.getLastMessages().then((result) => {
      if (result.data && result.data.data) {
        dispatch({
          type: SET_LAST_MESSAGES,
          payload: result.data.data
        });
      } else {
        throw new Error('Invalid data: last messages');
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, LAST_MESSAGES_ERROR));
  };
};

export const setLastMessages = createAction(SET_LAST_MESSAGES, (messages) => messages);
export const removeLastMessage = createAction(REMOVE_LAST_MESSAGE, (traveler) => traveler);
export const addNewLastMessage = (traveler) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(travelerDetailsActions.travelerUpdateLastMessage(traveler));
    if (
      window.location.pathname.indexOf('/traveler/') !== -1 &&
      state.travelerDetails.traveler._id.$oid === traveler._id.$oid
    ) {
      dispatch(updateViewedMessages(traveler.lastMessage._id.$oid));
    } else {
      dispatch({ type: ADD_NEW_LAST_MESSAGE, payload: traveler });
    }
  };
};
// this.props.updateViewedMessages(this.props.travelerId, this.props.messageId);
export const actions = {
  requestLastMessages,
  getViewedMessages,
  updateViewedMessages,
  setLastMessages,
  addNewLastMessage,
  removeLastMessage
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_LAST_MESSAGES]: (state) => {
    return { ...state, loading: true };
  },
  [SET_LAST_MESSAGES]: (state, { payload }) => {
    return { ...state, lastMessages: payload, loading: false };
  },
  [ADD_NEW_LAST_MESSAGE]: (state, { payload }) => {
    const travelerIndex = findIndex(state.lastMessages, ['_id.$oid', payload._id.$oid]);
    if (travelerIndex < 0) {
      return {
        ...state,
        lastMessages: [
          ...state.lastMessages,
          payload
        ]
      };
    } else {
      return {
        ...state,
        lastMessages: [
          ...state.lastMessages.slice(0, travelerIndex),
          payload,
          ...state.lastMessages.slice(travelerIndex + 1)
        ]
      };
    }
  },
  [SET_VIEWED_MESSAGES]: (state, { payload }) => {
    return { ...state, viewedMessages: payload };
  },
  [REMOVE_LAST_MESSAGE]: (state, { payload }) => {
    const travelerIndex = findIndex(state.lastMessages, ['_id.$oid', payload._id.$oid]);
    if (travelerIndex >= 0) {
      return {
        ...state,
        lastMessages: [
          ...state.lastMessages.slice(0, travelerIndex),
          ...state.lastMessages.slice(travelerIndex + 1)
        ]
      };
    } else {
      return { ...state };
    }
  },
  [UPDATE_VIEWED_MESSAGES]: (state, { payload }) => {
    const viewedTravelerIndex = findIndex(state.viewedMessages, { id: payload });
    if (viewedTravelerIndex < 0) {
      return {
        ...state,
        viewedMessages: [
          ...state.viewedMessages,
          {
            id: payload,
            timeUTC: moment.utc().valueOf()
          }
        ]
      };
    } else {
      return {
        ...state,
        viewedMessages: [
          ...state.viewedMessages.slice(0, viewedTravelerIndex),
          {
            id: payload,
            timeUTC: moment.utc().valueOf()
          },
          ...state.viewedMessages.slice(viewedTravelerIndex + 1)
        ]
      };
    }
  },
  [PUSHER_UPDATE_TRAVELER_HELPEDBY]: (state, { payload }) => {
    const travelerIndex = findIndex(state.lastMessages, ['_id.$oid', payload.travelerId]);
    if (travelerIndex >= 0 && payload.helpedBy) {
      return {
        ...state,
        lastMessages: [
          ...state.lastMessages.slice(0, travelerIndex),
          {
            ...state.lastMessages[travelerIndex],
            helpedBy: payload.helpedBy
          },
          ...state.lastMessages.slice(travelerIndex + 1)
        ]
      };
    } else {
      return { ...state };
    }
  },
  [PUSHER_UPDATE_TRAVELER]: (state, { payload }) => {
    const travelerIndex = findIndex(state.lastMessages, ['_id.$oid', payload._id.$oid]);
    if (travelerIndex >= 0) {
      return {
        ...state,
        lastMessages: [
          ...state.lastMessages.slice(0, travelerIndex),
          {
            ...state.lastMessages[travelerIndex],
            ...payload
          },
          ...state.lastMessages.slice(travelerIndex + 1)
        ]
      };
    } else {
      return { ...state };
    }
  },
  [LAST_MESSAGES_ERROR]: (state) => {
    return { ...state, loading: false };
  }
}, initialState);

export const stateLastMessages = (state) => state.messages.lastMessages;
export const stateViewedMessages = (state) => state.messages.viewedMessages;
export const stateMessagesLoading = (state) => state.messages.loading;
