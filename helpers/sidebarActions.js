import {
    SET_IS_PINNED_FALSE,
    SET_IS_PINNED_TRUE,
    SET_SIDEBAR_CLOSE,
    SET_SIDEBAR_OPEN
} from '../redux/constants';

export const setSidebarOpen = () => dispatch => {
    return dispatch({ type: SET_SIDEBAR_OPEN })
}
export const setSidebarClose = () => dispatch => {
    return dispatch({ type: SET_SIDEBAR_CLOSE })
}
export const pinSidebar = () => dispatch => {
    return dispatch({ type: SET_IS_PINNED_TRUE })
}
export const unpinSidebar = () => dispatch => {
    return dispatch({ type: SET_IS_PINNED_FALSE })
}