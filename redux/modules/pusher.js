import serverApi from '../../helpers/serverApi';
import { createAction, handleActions } from 'redux-actions';
import { push } from 'connected-react-router';

import { actions as notificationActions } from './notification';
import { actions as timelineActions } from './timeline';
import { actions as reservationsActions } from './reservations';
import { actions as activeTravelersActions } from './activeTravelers';
import i18nTools from '../../helpers/i18nTools';

import {
  PUSHER_UPDATE_STATION_ON_MAP,
  PUSHER_UPDATE_TRAVELER,
  PUSHER_UPDATE_TRAVELER_HELPEDBY,
  PUSHER_UPDATE_TRAVELER_CASE,
  PUSHER_UPDATE_TRAVELER_LOADING,
  PUSHER_HELP_TRAVELER,
  PUSHER_RELEASE_TRAVELER,
  PUSHER_CLOSE_TRAVELER,
  PUSHER_ERROR,
  TD_REQUEST_FOR_UPDATE_TRAVELER_CASE,
  HT_UPDATE_HELPED_TRAVELERS,
  PUSHER_UPDATE_ORGANIZATION
} from '../constants';

// ------------------------------------
// Actions
// ------------------------------------
export const updateTravelerLoading = (travelerId) => {
  return (dispatch) => {
    dispatch({ type: PUSHER_UPDATE_TRAVELER_LOADING, payload: travelerId });
  };
};

export const updateTravelerHelpedBy = (traveler) => {
  return (dispatch, getState) => {
    const user = getState().user;
    dispatch({
      type: PUSHER_UPDATE_TRAVELER_HELPEDBY,
      payload: {
        travelerId: traveler._id.$oid,
        helpedBy: traveler.helpedBy
      }
    });
    if (
      user._id.$oid === traveler.helpedBy._id.$oid ||
      traveler.helpedBy.status === 'released' ||
      traveler.helpedBy.status === 'closed'
    ) {
      dispatch({
        type: HT_UPDATE_HELPED_TRAVELERS,
        payload: traveler
      });
    }
  };
};

export const updateTravelerCase = createAction(PUSHER_UPDATE_TRAVELER_CASE, (caseItem) => caseItem);

export const addCaseAction = (traveler, actionId, subActionId = '', text = '') => {
  return (dispatch) => {
    dispatch({ type: TD_REQUEST_FOR_UPDATE_TRAVELER_CASE });
    serverApi.postAction(traveler._id.$oid, {
      action: actionId,
      subaction: subActionId,
      description: text,
      caseId: traveler.helpedBy.caseId
    }).then(function (result) {
      if (result.data.errorMessage) {
        throw result.data.errorMessage;
      } else {
        dispatch(updateTravelerHelpedBy(result.data.data.traveler));
        dispatch(updateTravelerCase(result.data.data.case));
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('Case Action added'),
          level: 'success'
        }));
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, PUSHER_ERROR));
  };
};

export const editCaseAction = (traveler, actionId, subActionId = '', text = '', caseActionId, eTag) => {
  return (dispatch) => {
    dispatch({ type: TD_REQUEST_FOR_UPDATE_TRAVELER_CASE });
    serverApi.editAction({
      subscriberId: traveler._id.$oid,
      'if-match': eTag
    }, {
      action: actionId,
      subaction: subActionId,
      description: text,
      caseActionId: caseActionId
    }).then(function (result) {
      if (!result.data.data) {
        throw new Error('Update case error');
      } else {
        dispatch(updateTravelerCase(result.data.data));
        dispatch(notificationActions.showNotification({
          message: i18nTools.l('Case Action edited'),
          level: 'success'
        }));
      }
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, PUSHER_ERROR));
  };
};

export const helpTraveler = (travelerId) => {
  return (dispatch, getState) => {
    dispatch({ type: PUSHER_HELP_TRAVELER, payload: travelerId });
    if (window.location.href.indexOf('traveler/' + travelerId) === -1) {
      dispatch(push('/traveler/' + travelerId));
    }
    dispatch(updateTravelerLoading(travelerId));
    serverApi.postAction(travelerId, {
      action: getState().appSettings.constants.caseActions.action_buttons.help.code
    }).then(function (result) {
      if (result.data.errorMessage) {
        throw result.data.errorMessage;
      }
      dispatch(updateTravelerHelpedBy(result.data.data.traveler));
      dispatch(updateTravelerCase(result.data.data.case));
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, PUSHER_ERROR));
  };
};

export const releaseTraveler = (travelerId, helpedBy) => {
  return (dispatch, getState) => {
    dispatch({ type: PUSHER_RELEASE_TRAVELER, payload: travelerId });
    dispatch(updateTravelerLoading(travelerId));
    const state = getState();
    serverApi.postAction(travelerId, {
      action: state.appSettings.constants.caseActions.action_buttons.release.code,
      caseId: helpedBy.caseId
    }).then(function (result) {
      if (result.data.errorMessage) {
        throw result.data.errorMessage;
      }
      dispatch(updateTravelerHelpedBy(result.data.data.traveler));
      dispatch(updateTravelerCase(result.data.data.case));
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, PUSHER_ERROR));
  };
};

export const closeTraveler = (travelerId, helpedBy) => {
  return (dispatch, getState) => {
    dispatch({ type: PUSHER_CLOSE_TRAVELER, payload: travelerId });
    dispatch(updateTravelerLoading(travelerId));
    const state = getState();
    serverApi.postAction(travelerId, {
      action: state.appSettings.constants.caseActions.action_buttons.close.code,
      caseId: helpedBy.caseId
    }).then(function (result) {
      if (result.data.errorMessage) {
        throw result.data.errorMessage;
      }
      dispatch(updateTravelerHelpedBy(result.data.data.traveler));
      dispatch(updateTravelerCase(result.data.data.case));
      return result;
    }).catch(serverApi.catchErrors.bind(this, dispatch, PUSHER_ERROR));
  };
};

export const updateStationOnMap = (station) => {
  return (dispatch) => {
    dispatch({
      type: PUSHER_UPDATE_STATION_ON_MAP,
      payload: station
    });
  };
};

export const updateOrganizationData = (payload) => {
  return (dispatch) => {
    dispatch({
      type: PUSHER_UPDATE_ORGANIZATION,
      payload: payload
    });
  };
};

export const updateTravelerData = (traveler) => {
  return (dispatch) => {
    dispatch({
      type: PUSHER_UPDATE_TRAVELER,
      payload: traveler
    });
  };
};

export const updateJourneyData = (journey) => {
  return (dispatch, getState) => {
    const state = getState();
    const { reservations, travelerDetails: { traveler }, timeline, activeTravelers: { travelers } } = state;
    if (traveler && traveler._id && traveler._id.$oid === journey.subscriberId) {
      // update timeline if update connected with opened traveler
      if (!timeline.loading) {
        dispatch(timelineActions.loadEvents(journey.subscriberId));
      }
      // update reservations if update connected with opened traveler
      if (Object.keys(reservations).length && !reservations.loading && !journey.byEvent) {
        dispatch(reservationsActions.loadReservations(journey.subscriberId));
      }
    }
    // update active travelers timeline
    if (journey.hasActiveJourney && travelers.length) {
      travelers.forEach((traveler) => {
        if (traveler._id.$oid === journey.subscriberId && traveler.productsData) {
          dispatch(activeTravelersActions.loadLatestProducts(journey.subscriberId));
        }
      });
    }
  };
};

export const actions = {
  updateTravelerHelpedBy,
  updateTravelerCase,
  addCaseAction,
  editCaseAction,
  helpTraveler,
  releaseTraveler,
  updateStationOnMap,
  updateTravelerData,
  updateJourneyData,
  closeTraveler,
  updateOrganizationData
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [PUSHER_ERROR]: (state, { payload }) => {
    return { error: payload };
  }
}, '');
