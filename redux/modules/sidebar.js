import {
    SET_IS_PINNED_FALSE,
    SET_IS_PINNED_TRUE,
    SET_SIDEBAR_OPEN,
    SET_SIDEBAR_CLOSE
} from '../constants';
import { createSelector } from 'reselect';

const initialState = {
    isOpened: false,
    isSidebarPinned: false
}

export default function sidebar(state = initialState, action) {
    switch (action.type) {
        case SET_SIDEBAR_OPEN:
            return Object.assign({}, state, {
                isOpened: true
            })
        case SET_SIDEBAR_CLOSE:
            return Object.assign({}, state, {
                isOpened: false
            })
        case SET_IS_PINNED_TRUE:
            return Object.assign({}, state, {
                isSidebarPinned: true, isOpened: true
            })
        case SET_IS_PINNED_FALSE:
            return Object.assign({}, state, {
                isSidebarPinned: false, isOpened: false
            })
        default: return state
    }
}

export const sidebarState = createSelector(
    (state) => state.sidebar.isOpened,
    (state) => state.sidebar.isSidebarPinned,
    (isOpened, isSidebarPinned) => {
        return {
            isOpened,
            isSidebarPinned
        };
    }
);

export const stateSidebar = (state) => state.sidebar;