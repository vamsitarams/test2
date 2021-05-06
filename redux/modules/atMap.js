import { createAction, handleActions } from 'redux-actions';
import config from '../../config';
import { push } from 'connected-react-router';

import {
  ATM_SWITCH_MAP_VIEW,
  ATM_CHANGE_ON_THE_MAP_STATUS,
  ATM_CHANGE_MARKERS_ON_MAP,
  ATM_CHANGE_AREA_SHOWN
} from '../constants';

const initialState = {
  zoom: config.map.minZoom,
  lat: 0,
  lng: 0,
  mapView: 'locations',
  onTheMap: true,
  areaShown: false,
  markersOnTheMap: []
};

// ------------------------------------
// Actions
// ------------------------------------

export const atSwitchMapView = (mapView = 'locations') => {
  return dispatch => {
    dispatch({
      type: ATM_SWITCH_MAP_VIEW,
      payload: mapView
    });
    dispatch(push(`${location.pathname}?mapView=${mapView}`));
    return mapView;
  };
};
export const atChangeOnTheMapStatus = createAction(
  ATM_CHANGE_ON_THE_MAP_STATUS,
  (status = false) => status
);
export const atChangeMarkersOnMap = createAction(
  ATM_CHANGE_MARKERS_ON_MAP,
  (markers = {}) => markers
);
export const atChangeAreaShown = createAction(
  ATM_CHANGE_AREA_SHOWN,
  (area = false) => area
);

export const actions = {
  atSwitchMapView,
  atChangeOnTheMapStatus,
  atChangeMarkersOnMap,
  atChangeAreaShown
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [ATM_SWITCH_MAP_VIEW]: (state, { payload }) => {
    return { ...state, mapView: payload };
  },
  [ATM_CHANGE_ON_THE_MAP_STATUS]: (state, { payload }) => {
    return { ...state, onTheMap: payload };
  },
  [ATM_CHANGE_MARKERS_ON_MAP]: (state, { payload }) => {
    return { ...state, markersOnTheMap: payload };
  },
  [ATM_CHANGE_AREA_SHOWN]: (state, { payload }) => (
    { ...state, areaShown: payload }
  )
}, initialState);

// ------------------------------------
// Selector
// ------------------------------------
export const stateAtMapView = (state) => state.atMap.mapView;
export const stateOnTheMap = (state) => state.atMap.onTheMap;
export const stateMarkersOnTheMap = (state) => {
  let markers = state.atMap.onTheMap ? state.atMap.markersOnTheMap : [];
  markers = markers.length && state.atMap.onTheMap ? markers : ['no'];
  return markers;
};
export const stateAreaShown = (state) => state.atMap.areaShown;
