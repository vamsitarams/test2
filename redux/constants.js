// ------------------------------------
// pusher
// ------------------------------------
export const PUSHER_UPDATE_STATION_ON_MAP = '@pusher/UPDATE_STATION_ON_MAP';
export const PUSHER_UPDATE_TRAVELER = '@pusher/UPDATE_TRAVELER';
export const PUSHER_UPDATE_TRAVELER_HELPEDBY = '@pusher/UPDATE_TRAVELER_HELPEDBY';
export const PUSHER_UPDATE_TRAVELER_LAST_MESSAGE = '@pusher/UPDATE_TRAVELER_LAST_MESSAGE';
export const PUSHER_UPDATE_TRAVELER_CASE = '@pusher/UPDATE_TRAVELER_CASE';
export const PUSHER_UPDATE_TRAVELER_LOADING = '@pusher/UPDATE_TRAVELER_LOADING';
export const PUSHER_HELP_TRAVELER = '@pusher/HELP_TRAVELER';
export const PUSHER_RELEASE_TRAVELER = '@pusher/RELEASE_TRAVELER';
export const PUSHER_CLOSE_TRAVELER = '@pusher/CLOSE_TRAVELER';
export const PUSHER_ERROR = '@pusher/ERROR';
export const PUSHER_UPDATE_ORGANIZATION = '@pusher/UPDATE_ORGANIZATION';

// ------------------------------------
// messages
// ------------------------------------
export const REQUEST_LAST_MESSAGES = '@messages/REQUEST_LAST_MESSAGES';
export const SET_LAST_MESSAGES = '@messages/SET_LAST_MESSAGES';
export const ADD_NEW_LAST_MESSAGE = '@messages/ADD_NEW_LAST_MESSAGE';
export const REMOVE_LAST_MESSAGE = '@messages/REMOVE_LAST_MESSAGE';
export const SET_VIEWED_MESSAGES = '@messages/SET_VIEWED_MESSAGES';
export const UPDATE_VIEWED_MESSAGES = '@messages/UPDATE_VIEWED_MESSAGES';
export const LAST_MESSAGES_ERROR = '@messages/LAST_MESSAGES_ERROR';

// ------------------------------------
// activeTravelers
// ------------------------------------
export const AT_SET_ACTIVE_TRAVELERS = '@activeTravelers/SET_ACTIVE_TRAVELERS';
export const AT_LOAD_ACTIVE_TRAVELERS = '@activeTravelers/LOAD_ACTIVE_TRAVELERS';
export const AT_REQUEST_ERROR = '@activeTravelers/REQUEST_ERROR';
export const AT_SET_FILTER = '@activeTravelers/SET_FILTER';
export const AT_CLEAR_FILTER = '@activeTravelers/CLEAR_FILTER';
export const AT_SET_LATEST_PRODUCTS = '@activeTravelers/SET_LATEST_PRODUCTS';
export const AT_LATEST_PRODUCTS_ERROR = '@activeTravelers/LATEST_PRODUCTS_ERROR';
export const AT_COMPUTE_CONTINENTS_BELONGING = '@activeTravelers/COMPUTE_CONTINENTS_BELONGING';

// ------------------------------------
// airportStatuses
// ------------------------------------
export const AS_SET_AIRPORT_STATUSES = '@airportStatuses/SET_AIRPORT_STATUSES';
export const AS_AIRPORT_STATUSES_ERROR = '@airportStatuses/AIRPORT_STATUSES_ERROR';
export const AS_LOAD_AIRPORT_STATUSES = '@airportStatuses/LOAD_AIRPORT_STATUSES';
export const AS_CHANGE_AIRPORT_STATUS_FILTER = '@airportStatuses/CHANGE_AIRPORT_STATUS_FILTER';
export const AS_CHANGE_TD_AIRPORT_STATUS_FILTER = '@airportStatuses/CHANGE_TD_AIRPORT_STATUS_FILTER';
export const AS_CHANGE_TIMEFRAME_FILTER = '@airportStatuses/CHANGE_TIMEFRAME_FILTER';
export const AS_CHANGE_TD_TIMEFRAME_FILTER = '@airportStatuses/CHANGE_TD_TIMEFRAME_FILTER';

// ------------------------------------
// appSettings
// ------------------------------------
export const APS_REQUEST_APP_SETTINGS = '@appSettings/REQUEST_APP_SETTINGS';
export const APS_APP_SETTINGS_ERROR = '@appSettings/APP_SETTINGS_ERROR';
export const APS_SET_APP_SETTINGS = '@appSettings/SET_APP_SETTINGS';
export const APS_CHANGE_DIMENSIONS_APP_SETTINGS = '@appSettings/CHANGE_DIMENSIONS_APP_SETTINGS';
export const APS_TOGGLE_SIDE_NAV = '@appSettings/APS_TOGGLE_SIDE_NAV';

// ------------------------------------
// atMap
// ------------------------------------
export const ATM_SWITCH_MAP_VIEW = '@atMap/SWITCH_MAP_VIEW';
export const ATM_CHANGE_ON_THE_MAP_STATUS = '@atMap/CHANGE_ON_THE_MAP_STATUS';
export const ATM_CHANGE_MARKERS_ON_MAP = '@atMap/CHANGE_MARKERS_ON_MAP';
export const ATM_CHANGE_AREA_SHOWN = '@atMap/CHANGE_AREA_SHOWN';

// ------------------------------------
// flightsStatus
// ------------------------------------
export const FS_SET_TRAVELERS_FLIGHTS_LIST = '@flightsStatus/SET_TRAVELERS_FLIGHTS_LIST';
export const FS_LOAD_TRAVELERS_FLIGHTS_LIST = '@flightsStatus/LOAD_TRAVELERS_FLIGHTS_LIST';
export const FS_SET_TRAVELERS_FLIGHTS_FILTER = '@flightsStatus/SET_TRAVELERS_FLIGHTS_FILTER';
export const FS_CLEAR_TRAVELERS_FLIGHTS_FILTER = '@flightsStatus/CLEAR_TRAVELERS_FLIGHTS_FILTER';
export const FS_SWITCH_TRAVELERS_FLIGHTS_PAGE = '@flightsStatus/SWITCH_TRAVELERS_FLIGHTS_PAGE';
export const FS_SET_TRAVELERS_FLIGHTS_META = '@flightsStatus/SET_TRAVELERS_FLIGHTS_META';
export const FS_SET_TRAVELERS_FLIGHTS_FILTER_EMBEDDED = '@flightsStatus/SET_TRAVELERS_FLIGHTS_FILTER_EMBEDDED';
export const FS_SET_TRAVELERS_FLIGHTS_SORTER = '@flightsStatus/SET_TRAVELERS_FLIGHTS_SORTER';
export const FS_REQUEST_TRAVELERS_FLIGHTS_LIST_ERROR = '@flightsStatus/REQUEST_TRAVELERS_FLIGHTS_LIST_ERROR';

// ------------------------------------
// accountsList
// ------------------------------------
export const AL_SET_ACCOUNTS = '@accountsList/SET_ACCOUNTS';
export const AL_LOAD_ACCOUNTS = '@accountsList/LOAD_ACCOUNTS';
export const AL_SET_ACCOUNTS_FILTER = '@accountsList/SET_ACCOUNTS_FILTER';
export const AL_CLEAR_ACCOUNTS_FILTER = '@accountsList/CLEAR_ACCOUNTS_FILTER';
export const AL_SWITCH_ACCOUNTS_PAGE = '@accountsList/SWITCH_ACCOUNTS_PAGE';
export const AL_SET_ACCOUNTS_META = '@accountsList/SET_ACCOUNTS_META';
export const AL_SET_ACCOUNTS_EMBEDDED = '@accountsList/SET_ACCOUNTS_EMBEDDED';
export const AL_SET_ACCOUNTS_SORTER = '@accountsList/SET_ACCOUNTS_SORTER';
export const AL_REQUEST_ACCOUNTS_ERROR = '@accountsList/REQUEST_ACCOUNTS_ERROR';

// ------------------------------------
// organizationUsers
// ------------------------------------
export const OU_SET_ACCOUNT_USERS = '@organizationUsers/SET_ACCOUNT_USERS';
export const OU_SET_ORGANIZATION = '@organizationUsers/SET_ORGANIZATION';
export const OU_LOAD_ACCOUNT_USERS = '@organizationUsers/LOAD_ACCOUNT_USERS';
export const OU_SET_ACCOUNT_USERS_FILTER = '@organizationUsers/SET_ACCOUNT_USERS_FILTER';
export const OU_CLEAR_ACCOUNT_USERS_FILTER = '@organizationUsers/CLEAR_ACCOUNT_USERS_FILTER';
export const OU_SWITCH_ACCOUNT_USERS_PAGE = '@organizationUsers/SWITCH_ACCOUNT_USERS_PAGE';
export const OU_SET_ACCOUNT_USERS_META = '@organizationUsers/SET_ACCOUNT_USERS_META';
export const OU_SET_ACCOUNT_USERS_SORTER = '@organizationUsers/SET_ACCOUNT_USERS_SORTER';
export const OU_REQUEST_ACCOUNT_USERS_ERROR = '@organizationUsers/REQUEST_ACCOUNT_USERS_ERROR';

// ------------------------------------
// users
// ------------------------------------
export const SET_USERS = '@users/SET_USERS';
export const LOAD_USERS = '@users/LOAD_USERS';
export const SET_USERS_FILTER = '@users/SET_USERS_FILTER';
export const CLEAR_USERS_FILTER = '@users/CLEAR_USERS_FILTER';
export const SWITCH_USERS_PAGE = '@users/SWITCH_USERS_PAGE';
export const SET_USERS_META = '@users/SET_USERS_META';
export const SET_USERS_SORTER = '@users/SET_USERS_SORTER';
export const REQUEST_USERS_ERROR = '@users/REQUEST_USERS_ERROR';

// ------------------------------------
// companiesList
// ------------------------------------
export const CL_SET_COMPANIES = '@companiesList/SET_COMPANIES';
export const CL_LOAD_COMPANIES = '@companiesList/LOAD_COMPANIES';
export const CL_SET_COMPANIES_FILTER = '@companiesList/SET_COMPANIES_FILTER';
export const CL_CLEAR_COMPANIES_FILTER = '@companiesList/CLEAR_COMPANIES_FILTER';
export const CL_SWITCH_COMPANIES_PAGE = '@companiesList/SWITCH_COMPANIES_PAGE';
export const CL_SET_COMPANIES_META = '@companiesList/SET_COMPANIES_META';
export const CL_SET_COMPANIES_SORTER = '@companiesList/SET_COMPANIES_SORTER';
export const CL_REQUEST_COMPANIES_ERROR = '@companiesList/REQUEST_COMPANIES_ERROR';

// ------------------------------------
// helpedTravelers
// ------------------------------------
export const HT_SET_HELPED_TRAVELERS = '@helpedTravelers/SET_HELPED_TRAVELERS';
export const HT_REQUEST_HELPED_TRAVELERS = '@helpedTravelers/REQUEST_HELPED_TRAVELERS';
export const HT_UPDATE_HELPED_TRAVELERS = '@helpedTravelers/UPDATE_HELPED_TRAVELERS';
export const HT_HELPED_TRAVELERS_ERROR = '@helpedTravelers/HELPED_TRAVELERS_ERROR';

// ------------------------------------
// loading
// ------------------------------------
export const START_LOADING = '@loading/START_LOADING';
export const STOP_LOADING = '@loading/STOP_LOADING';

// ------------------------------------
// notification
// ------------------------------------
export const SHOW_NOTIFICATION = '@notification/SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = '@notification/HIDE_NOTIFICATION';

// ------------------------------------
// search
// ------------------------------------
export const REQUEST_SEARCH = '@search/REQUEST_SEARCH';
export const SEARCH_ERROR = '@search/SEARCH_ERROR';
export const SHOW_SEARCH_RESULT = '@search/SHOW_SEARCH_RESULT';
export const CLEAN_SEARCH = '@search/CLEAN_SEARCH';

// ------------------------------------
// travelerDetails
// ------------------------------------
export const TD_REQUEST_TRAVELER = '@travelerDetails/REQUEST_TRAVELER';
export const TD_SET_TRAVELER = '@travelerDetails/SET_TRAVELER';
export const TD_CHANGE_TRAVELER_ONLINE_STATUS = '@travelerDetails/CHANGE_TRAVELER_ONLINE_STATUS';
export const TD_REQUEST_TRAVELER_ERROR = '@travelerDetails/REQUEST_TRAVELER_ERROR';
export const TD_TRAVELER_SWITCH_MAP_VIEW = '@travelerDetails/TRAVELER_SWITCH_MAP_VIEW';
export const TD_REQUEST_TRAVELER_CASE_HISTORY = '@travelerDetails/REQUEST_TRAVELER_CASE_HISTORY';
export const TD_SET_TRAVELER_CASE_HISTORY = '@travelerDetails/SET_TRAVELER_CASE_HISTORY';
export const TD_TRAVELER_CASE_HISTORY_ERROR = '@travelerDetails/TRAVELER_CASE_HISTORY_ERROR';
export const TD_REQUEST_FOR_UPDATE_TRAVELER_CASE = '@travelerDetails/REQUEST_FOR_UPDATE_TRAVELER_CASE';
export const TD_SET_TRAVELER_FLIGHTS = '@travelerDetails/SET_TRAVELER_FLIGHTS';
export const TD_SET_TRAVELER_FLIGHTS_SORTER = '@travelerDetails/SET_TRAVELER_FLIGHTS_SORTER';
export const TD_REQUEST_TRAVELER_FLIGHTS = '@travelerDetails/REQUEST_TRAVELER_FLIGHTS';
export const TD_REQUEST_TRAVELER_FLIGHTS_ERROR = '@travelerDetails/REQUEST_TRAVELER_FLIGHTS_ERROR';
export const TD_REQUEST_TRAVELER_ADVISORY = '@travelerDetails/REQUEST_TRAVELER_ADVISORY';
export const TD_SET_TRAVELER_ADVISORY = '@travelerDetails/SET_TRAVELER_ADVISORY';
export const TD_TRAVELER_ADVISORY_ERROR = '@travelerDetails/TRAVELER_ADVISORY_ERROR';
// ------------------------------------
// timeline
// ------------------------------------
export const TLN_REQUEST_TIMALINE_DATA = '@timeline/REQUEST_TIMALINE_DATA';
export const TLN_SET_TIMALINE_DATA = '@timeline/SET_TIMALINE_DATA';
export const TLN_REQUEST_TIMALINE_DATA_ERROR = '@timeline/REQUEST_TIMALINE_DATA_ERROR';
export const TLN_RESET_TIMELINE = '@timeline/RESET_TIMELINE';
// ------------------------------------
// travelersList
// ------------------------------------
export const TL_SET_TRAVELERS_LIST = '@travelersList/SET_TRAVELERS_LIST';
export const TL_LOAD_TRAVELERS_LIST = '@travelersList/LOAD_TRAVELERS_LIST';
export const TL_SET_TRAVELERS_LIST_FILTER = '@travelersList/SET_TRAVELERS_LIST_FILTER';
export const TL_CLEAR_TRAVELERS_LIST_FILTER = '@travelersList/CLEAR_TRAVELERS_LIST_FILTER';
export const TL_SWITCH_TRAVELERS_LIST_PAGE = '@travelersList/SWITCH_TRAVELERS_LIST_PAGE';
export const TL_SET_TRAVELERS_LIST_META = '@travelersList/SET_TRAVELERS_LIST_META';
export const TL_SET_TRAVELERS_LIST_EMBED_DATA = '@travelersList/SET_TRAVELERS_LIST_EMBED_DATA';
export const TL_SET_TRAVELERS_LIST_SORTER = '@travelersList/SET_TRAVELERS_LIST_SORTER';
export const TL_SET_TRAVELERS_LIST_ERROR = '@travelersList/SET_TRAVELERS_LIST_ERROR';

// ------------------------------------
// user
// ------------------------------------
export const LOG_IN_USER = '@user/LOG_IN_USER';
export const SET_TOKENS = '@user/SET_TOKENS';
export const LOG_OUT_USER = '@user/LOG_OUT_USER';
export const LOGGED_IN_USER = '@user/LOGGED_IN_USER';
export const LOG_IN_FAILED = '@user/LOG_IN_FAILED';
export const REFRESH_TOKENS = '@user/REFRESH_TOKENS';
export const REQUEST_HASH_CODE = '@user/REQUEST_HASH_CODE';
export const SAVE_NEW_PASSWORD = '@user/SAVE_NEW_PASSWORD';
export const ERROR_STATUS = '@user/ERROR_STATUS';
export const TOGGLE_ERROR_FLAG = '@user/TOGGLE_ERROR_FLAG';
// ------------------------------------
// flightsStatusMap
// ------------------------------------
export const FSM_UPDATE_FLIGHT_STATUS = '@flightStatusMap/UPDATE_FLIGHT_STATUS';
export const FSM_SET_FLIGHT_STATUS = '@flightStatusMap/SET_FLIGHT_STATUS';
export const FSM_LOAD_FLIGHT_STATUS = '@flightStatusMap/LOAD_FLIGHT_STATUS';
export const FSM_FLIGHT_STATUS_ERROR = '@flightStatusMap/FLIGHT_STATUS_ERROR';
export const FSM_CHANGE_FLIGHT_STATUS_FILTER = '@flightStatusMap/CHANGE_FLIGHT_STATUS_FILTER';
export const FSM_CHANGE_TD_TIMEFRAME_FILTER = '@flightStatusMap/CHANGE_TD_TIMEFRAME_FILTER';
export const FSM_CHANGE_TIMEFRAME_FILTER = '@flightStatusMap/CHANGE_TIMEFRAME_FILTER';

// ------------------------------------
// reservations
// ------------------------------------
export const TDR_SET_RESERVATIONS = '@reservations/SET_RESERVATIONS';
export const TDR_REQUEST_RESERVATIONS = '@reservations/REQUEST_RESERVATIONS';
export const TDR_RESERVATIONS_ERROR = '@reservations/RESERVATIONS_ERROR';
export const TDR_RESERVATIONS_CHANGE_VIEW = '@reservations/RESERVATIONS_CHANGE_VIEW';
export const TDR_RESET_RESERVATIONS = '@reservations/RESET_RESERVATIONS';

// ------------------------------------
// travelerManager
// ------------------------------------
export const TM_FORM_SET_COMPANIES = '@travelerManager/TM_FORM_SET_COMPANIES';
export const TM_FORM_SHOW_SAVE_LOADING = '@travelerManager/TM_FORM_SHOW_SAVE_LOADING';
export const TM_FORM_HIDE_SAVE_LOADING = '@travelerManager/TM_FORM_HIDE_SAVE_LOADING';
export const TM_FORM_SAVE_TRAVELER_ERROR = '@travelerManager/TM_FORM_SAVE_TRAVELER_ERROR';
export const TM_FORM_ADDED_TRAVELER_SAVED = '@travelerManager/TM_FORM_ADDED_TRAVELER_SAVED';
export const TM_FORM_SET_TRAVELER = '@travelerManager/TM_FORM_SET_TRAVELER';
export const TM_FORM_LOAD_TRAVELER = '@travelerManager/TM_FORM_LOAD_TRAVELER';
export const TM_FORM_LOAD_TRAVELER_ERROR = '@travelerManager/TM_FORM_LOAD_TRAVELER_ERROR';
export const TM_TRAVELER_UPDATED = '@travelerManager/TM_TRAVELER_UPDATED';
export const TM_SHOW_SEND_INVITATION_LOADING = '@travelerManager/TM_SHOW_SEND_INVITATION_LOADING';
export const TM_SEND_INVITATION_ERROR = '@travelerManager/TM_SEND_INVITATION_ERROR';
export const TM_INVITATION_SENT = '@travelerManager/TM_INVITATION_SENT';
export const TM_SHOW_BLOCK_USER_LOADING = '@travelerManager/TM_SHOW_BLOCK_USER_LOADING';
export const TM_BLOCK_USER_ERROR = '@travelerManager/TM_BLOCK_USER_ERROR';
export const TM_USER_STATUS_CHANGED = '@travelerManager/TM_USER_STATUS_CHANGED';
export const TD_SEND_INVITATION = '@travelerManager/TD_SEND_INVITATION';
export const TM_RESET_FORM = '@travelerManager/TM_RESET_FORM';

// ------------------------------------
// userManager
// ------------------------------------
export const UM_FORM_LOAD_USER = '@userManager/FORM_LOAD_USER';
export const UM_FORM_SET_USER = '@userManager/FORM_FORM_SET_USER';
export const UM_FORM_LOAD_USER_ERROR = '@userManager/FORM_LOAD_USER_ERROR';
export const UM_FORM_SET_SORT_LEVEL_IDS = '@userManager/FORM_SET_SORT_LEVEL_IDS';
export const UM_FORM_SET_ORGANIZATION = '@userManager/FORM_SET_ORGANIZATION';
export const UM_SHOW_SAVE_USER_LOADING = '@userManager/SHOW_SAVE_USER_LOADING';
export const UM_SAVE_USER_ERROR = '@userManager/SAVE_USER_ERROR';
export const UM_USER_UPDATED = '@userManager/USER_UPDATED';
export const UM_ADDED_USER_SAVED = '@userManager/ADDED_USER_SAVED';
export const UM_HIDE_SAVE_LOADING = '@userManager/HIDE_SAVE_LOADING';
export const UM_BLOCK_USER_LOADING = '@userManager/BLOCK_USER_LOADING';
export const UM_USER_BLOCKED_STATUS_CHANGED = '@userManager/USER_BLOCKED_STATUS_CHANGED';
export const UM_BLOCK_USER_ERROR = '@userManager/BLOCK_USER_ERROR';
export const UM_RESET_FORM = '@userManager/RESET_FORM';
export const UM_RESET_PASSWORD_LOADING = '@userManager/RESET_PASSWORD_LOADING';
export const UM_PASSWORD_CHANGED = '@userManager/PASSWORD_CHANGED';
export const UM_RESET_PASSWORD_ERROR = '@userManager/RESET_PASSWORD_ERROR';
export const UM_USER_DATA_UPDATED = '@userManager/USER_DATA_UPDATED';

// ------------------------------------
// organizationManager
// ------------------------------------
export const OM_FORM_LOAD_ORGANIZATION = '@organizationManager/FORM_LOAD_ORGANIZATION';
export const OM_FORM_SET_ORGANIZATION = '@organizationManager/FORM_SET_ORGANIZATION';
export const OM_FORM_LOAD_ORGANIZATION_ERROR = '@organizationManager/FORM_LOAD_ORGANIZATION_ERROR';
export const OM_SHOW_SAVE_ORGANIZATION_LOADING = '@organizationManager/SHOW_SAVE_ORGANIZATION_LOADING';
export const OM_SAVE_ORGANIZATION_ERROR = '@organizationManager/SAVE_ORGANIZATION_ERROR';
export const OM_ORGANIZATION_UPDATED = '@organizationManager/ORGANIZATION_UPDATED';
export const OM_ADDED_ORGANIZATION_SAVED = '@organizationManager/ADDED_ORGANIZATION_SAVED';
export const OM_HIDE_SAVE_ORGANIZATION_LOADING = '@organizationManager/HIDE_SAVE_ORGANIZATION_LOADING';
export const OM_BLOCK_ORGANIZATION_LOADING = '@organizationManager/BLOCK_ORGANIZATION_LOADING';
export const OM_ORGANIZATION_BLOCKED_STATUS_CHANGED = '@organizationManager/ORGANIZATION_BLOCKED_STATUS_CHANGED';
export const OM_BLOCK_ORGANIZATION_ERROR = '@organizationManager/BLOCK_ORGANIZATION_ERROR';
export const OM_RESET_ORGANIZATION_FORM = '@organizationManager/RESET_ORGANIZATION_FORM';
export const OM_ORGANIZATION_DATA_UPDATED = '@organizationManager/ORGANIZATION_DATA_UPDATED';
export const OM_FORM_SET_COST_CENTERS = '@organizationManager/FORM_SET_COST_CENTERS';

// ------------------------------------
// importTravelers
// ------------------------------------
export const IT_RESET_STATE = '@importTravelersBase/IT_RESET_STATE';
export const IT_BASE_REQUEST_GET = '@importTravelersBase/IT_BASE_REQUEST_GET';
export const IT_BASE_REQUEST_SET = '@importTravelersBase/IT_BASE_REQUEST_SET';
export const IT_BASE_REQUEST_ERROR = '@importTravelersBase/IT_BASE_REQUEST_ERROR';
export const IT_SET_IMPORT_FILENAME = '@importTravelers/SET_IMPORT_FILENAME';
export const IT_SET_STATE_IMPORT_FILE_START = '@importTravelers/SET_STATE_IMPORT_FILE_START';
export const IT_SET_STATE_IMPORT_FILE_PROCESS = '@importTravelers/SET_STATE_IMPORT_FILE_PROCESS';
export const IT_SET_STATE_IMPORT_FILE_PREVIEW = '@importTravelers/SET_STATE_IMPORT_FILE_PREVIEW';
export const IT_SET_STATE_IMPORT_FILE_ERROR = '@importTravelers/SET_STATE_IMPORT_FILE_ERROR';
export const IT_SERVER_IMPORTING_START = '@importTravelers/SERVER_IMPORTING_START';
export const IT_SERVER_IMPORTING_ERROR = '@importTravelers/SERVER_IMPORTING_ERROR';
export const IT_SET_STATE_IMPORT_PROCESS_START = '@importTravelers/SET_STATE_IMPORT_PROCESS_START';
export const IT_SET_STATE_IMPORT_PROCESS_ERROR = '@importTravelers/SET_STATE_IMPORT_PROCESS_ERROR';
export const IT_SET_STATE_IMPORT_PROCESS_SUCCESS = '@importTravelers/SET_STATE_IMPORT_PROCESS_SUCCESS';

// ------------------------------------
// user settings
// ------------------------------------
export const US_PENDING_REQUEST = '@userSettings/PENDING_REQUEST';
export const US_RECEIVE_USER = '@userSettings/RECEIVE_USER';
export const US_ERROR_LODING_USER = '@userSettings/ERROR_LODING_USER';
export const US_UPDATE_COMPLETED = '@userSettings/UPDATE_COMPLETED';
export const US_APPLY_SETTINGS = '@userSettings/APPLY_SETTINGS';

// ------------------------------------
// travel advisory
// ------------------------------------
export const TA_LOAD_COUNTRIES = '@travelAdvisory/TA_LOAD_COUNTRIES';
export const TA_SET_COUNTRIES_FILTER = '@travelAdvisory/TA_SET_COUNTRIES_FILTER';
export const TA_SET_COUNTRIES = '@travelAdvisory/TA_SET_COUNTRIES';
export const TA_SET_ACTIVE_COUNTRY = '@travelAdvisory/TA_SET_ACTIVE_COUNTRY';
export const TA_SET_COUNTRY_TRAVELERS = '@travelAdvisory/TA_SET_COUNTRY_TRAVELERS';

// ------------------------------------
// sidebar
// ------------------------------------
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const SET_SIDEBAR_CLOSE = 'SET_SIDEBAR_CLOSE';
export const SET_IS_PINNED_TRUE = 'SET_IS_PINNED_TRUE';
export const SET_IS_PINNED_FALSE = 'SET_IS_PINNED_FALSE';
