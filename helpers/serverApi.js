// export default window.apigClientFactory.newClient();

import axios from 'axios';
import queryString from 'query-string';
import Promise from 'bluebird';
import apigClient from './apigClient';
import config from '../config';
import lodashMap from 'lodash/map';
import i18nTools from './i18nTools';
import assign from 'lodash/assign';
import { actions as notificationActions } from '../redux/modules/notification';
import Data from './dummydata'
class ServerApi {
  constructor () {
    this.api = apigClient.newClient();
    this.authToken = false;
  }

  getGuestToken () {
    return this.api.subscribersTokensGuestGet(this.addXApiKey(), null);
  }

  login (body = {}) {
    return this.awsIamApi.webLoginPost(this.addXApiKey(), body);
  }

  webPasswordResetPost (email, resetLink) {
    return this.awsIamApi.webPasswordResetPost(this.addXApiKey(), {
      userName: email,
      resetLink: resetLink
    });
  }

  saveNewPassword (password, code, userName) {
    return this.awsIamApi.webPasswordResetVerifyPost(this.addXApiKey(), {
      userName: userName,
      subscriberId: '',
      etag: '',
      passCode: code,
      password: password
    });
  }

  refreshTokens (params = {}) {
    return this.awsIamApi.subscribersTokensRefreshGet(this.addXApiKey(params), null);
  }

  search (searchText) {
    return this.awsIamApi.webTravelersSearchPost(this.addXApiKey(), {
      searchQuery: searchText
    });
  }

  getActiveTravelers (params) {
    return this.awsIamApi.webActivetravelersGet(this.addXApiKey(params), null);
  }

  getHelpedTravelers () {
    return this.awsIamApi.webTravelersHelpedGet(this.addXApiKey(), null);
  }

  postAction (id, body) {
    return this.awsIamApi.webTravelersSubscriberIdCasesActionsPost(this.addXApiKey({
      subscriberId: id
    }), body);
  }

  editAction (params, body) {
    return this.awsIamApi.webTravelersSubscriberIdCasesActionsPatch(this.addXApiKey(params), body);
  }

  getSettings () {
    return this.awsIamApi.webConstantsGet(this.addXApiKey(), null);
  }

  webTravelersGet (appParams, isCompanyAdminOrUserState) {
    let sortBy = appParams.sortBy;
    if (sortBy && !appParams.alphabetical) {
      sortBy = '-' + sortBy;
    }
    const filterCostcenterId = appParams.filter.costcenter_id !== 'all' ? appParams.filter.costcenter_id : null;
    const filterOrganizationId = appParams.filter.company !== 'all' ? appParams.filter.company : null;
    const params = {
      page: appParams.page,
      pagesize: appParams.pagesize,
      filter_costcenter_id: filterCostcenterId,
      filter_jstatus_ok: appParams.filter.status.ok,
      filter_jstatus_alarm: appParams.filter.status.alarm,
      filter_jstatus_warning: appParams.filter.status.warning,
      filter_isVIP: appParams.filter.vip,
      filter_nonHelped: appParams.filter.nonHelped,
      filter_organization_id: filterOrganizationId,
      sort_by: sortBy,
      withCostCenters: isCompanyAdminOrUserState,
      withCompanies: true
    };
    return this.awsIamApi.webTravelersGet(this.addXApiKey(params), null);
  }

  getStations (params = { active_from: '', active_to: '' }) {
    return this.awsIamApi.webStationsGet(this.addXApiKey(params), null);
  }

  getTraveler (params = {}) {
    // return this.awsIamApi.webTravelersSubscriberIdGet(this.addXApiKey(params), null);
    return Data['traveler']
  };

  getTravelersFlights (appParams, isCompanyAdminOrUserState) {
    let sortBy = appParams.sortBy;
    if (sortBy && !appParams.alphabetical) {
      sortBy = '-' + sortBy;
    }
    const statusArr = [];
    for (const key in appParams.filter.status) {
      if (appParams.filter.status[key]) {
        statusArr.push(key);
      }
    };
    const language = '';
    const subscriberIdAll = 'all';
    const filterOrganizationId = appParams.filter.company !== 'all' ? appParams.filter.company : '';
    const filterCostCenterId = appParams.filter.costcenter_id !== 'all' ? appParams.filter.costcenter_id : '';
    const params = {
      needs_assistance: appParams.filter.nonHelped ? 1 : '',
      is_vip: appParams.filter.vip ? 1 : '',
      airport: appParams.filter.airport !== 'all' ? appParams.filter.airport : '',
      carrier: appParams.filter.carrier !== 'all' ? appParams.filter.carrier : '',
      company: filterOrganizationId,
      datestart: appParams.filter.dateRangeStart ? appParams.filter.dateRangeStart : '',
      dateend: appParams.filter.dateRangeEnd ? appParams.filter.dateRangeEnd : '',
      filter_costcenter_id: filterCostCenterId,
      status: statusArr,
      fstatus: appParams.filter.fstatus,
      page: appParams.page,
      pagesize: appParams.pagesize,
      sort_by: sortBy,
      language: language,
      subscriberId: subscriberIdAll,
      withCostCenters: isCompanyAdminOrUserState
    };
    return this.awsIamApi.webFlightsSubscriberIdGet(this.addXApiKey(params), null);
  }

  getSingleTravelerFlights (id, appParams, isCompanyAdminOrUserState) {
    const language = '';

    let sortBy = appParams.sortBy;
    if (sortBy && !appParams.alphabetical) {
      sortBy = '-' + sortBy;
    }

    const params = {
      subscriberId: id,
      sort_by: sortBy,
      pagesize: '',
      page: '',
      carrier: '',
      company: '',
      airport: '',
      fstatus: '',
      datestart: '',
      dateend: '',
      filter_costcenter_id: '',
      needs_assistance: '',
      language: language,
      status: '',
      is_vip: '',
      withCostCenters: isCompanyAdminOrUserState
    };
    return this.awsIamApi.webFlightsSubscriberIdGet(this.addXApiKey(params), null);
  }

  getFlightsMap (params = {}) {
    return this.awsIamApi.webFlightsMapGet(this.addXApiKey(params), null);
  }

  getTravelerCaseHistory (travelerId) {
    const params = {
      subscriberId: travelerId,
      caseActionId: 'all'
    };
    return this.awsIamApi.webTravelersSubscriberIdCasesActionsCaseActionIdGet(this.addXApiKey(params), null);
  }

  getOrganizations (params = {}) {
    const defParams = {
      filter_type: 'organization',
      sort_by: '',
      filter_agency: '',
      pagesize: null,
      page: null,
      search_name: '',
      with_parents: false,
      with_costCenters: true
    };

    if (params && Object.prototype.hasOwnProperty.call(params, 'search_name') && params.search_name.length > 0) {
      params.search_name = encodeURIComponent(params.search_name);
    }

    return this.awsIamApi.webOrganizationsGet(this.addXApiKey(assign({}, defParams, params)), null);
  }

  getOrganization (params = {}) {
    return this.awsIamApi.webOrganizationsOrganizationIdGet(this.addXApiKey(params), null);
  }

  getOrganizationUsers (params = {}) {
    if (params && Object.prototype.hasOwnProperty.call(params, 'search_name') && params.search_name.length > 0) {
      params.search_name = encodeURIComponent(params.search_name);
    }
    return this.awsIamApi.webOrganizationsOrganizationIdUsersGet(this.addXApiKey(params), null);
  }

  addTraveler (params) {
    return this.awsIamApi.webTravelersPost(this.addXApiKey(), params);
  }

  editTraveler (params, id, etag) {
    const reqParams = {
      subscriberId: id,
      'if-match': etag
    };
    return this.awsIamApi.webTravelersSubscriberIdPatch(this.addXApiKey(reqParams), params);
  }

  sendInvitationToTraveler (id) {
    const params = {
      subscriberId: id
    };
    return this.awsIamApi.webTravelersSubscriberIdInviteGet(this.addXApiKey(params), null);
  }

  blockTraveler (id) {
    const params = {
      subscriberId: id
    };
    return this.awsIamApi.webTravelersSubscriberIdBlockGet(this.addXApiKey(params), null);
  }

  unblockTraveler (id) {
    const params = {
      subscriberId: id
    };
    return this.awsIamApi.webTravelersSubscriberIdUnblockGet(this.addXApiKey(params), null);
  }

  getTimalineEvents (id) {
    const params = {
      subscriberId: id,
      language: ''
    };
    return this.awsIamApi.webTravelersSubscriberIdTimelineGet(this.addXApiKey(params), null);
  }

  getReservations (id) {
    const params = {
      subscriberId: id,
      language: ''
    };

    return this.awsIamApi.webTravelersSubscriberIdReservationsGet(this.addXApiKey(params), null);
  }

  getUser (id) {
    const params = {
      subscriberId: id,
      withPermissions: true
    };
    return this.awsIamApi.webUserSubscriberIdGet(this.addXApiKey(params), null);
  }

  getUserSortLevelIdList (id) {
    const params = {
      organizationId: id
    };
    return this.awsIamApi.webOrganizationsOrganizationIdPermissionsGet(this.addXApiKey(params), null);
  }

  getOrganizationCostCenters (organizationId) {
    const params = {
      filter_organization: organizationId,
      sort_by: null,
      search_name: null,
      page: 1,
      pagesize: 500
    };
    return this.awsIamApi.webCostcentersGet(this.addXApiKey(params), null);
  }

  editUser (params, companyId, id, etag) {
    const reqParams = {
      subscriberId: id,
      'if-match': etag,
      organizationId: companyId
    };
    return this.awsIamApi.webOrganizationsOrganizationIdUsersSubscriberIdPatch(this.addXApiKey(reqParams), params);
  }

  addUser (params, companyId) {
    const reqParams = {
      organizationId: companyId
    };
    return this.awsIamApi.webOrganizationsOrganizationIdUsersPost(this.addXApiKey(reqParams), params);
  }

  blockUser (id) {
    const params = {
      subscriberId: id
    };
    return this.awsIamApi.webUserSubscriberIdBlockGet(this.addXApiKey(params), null);
  }

  unblockUser (id) {
    const params = {
      subscriberId: id
    };
    return this.awsIamApi.webUserSubscriberIdUnlockGet(this.addXApiKey(params), null);
  }

  resetPasswordRequest (id) {
    const reqParams = {
      subscriberId: id
    };
    const params = {
      resetLink: ''
    };
    return this.awsIamApi.webUserSubscriberIdPasswordResetPost(this.addXApiKey(reqParams), params);
  }

  getLastMessages () {
    return this.awsIamApi.webLastmessagesGet(this.addXApiKey(), null);
  }

  markMessageAsRead (messageId) {
    return this.awsIamApi.webLastmessagesMessageIdViewGet(this.addXApiKey({ messageId }), null);
  }

  getLatestProducts (id) {
    const params = {
      subscriberId: id
    };
    return this.awsIamApi.webTravelersSubscriberIdLatestproductsGet(this.addXApiKey(params), null);
  }

  postOrganization (params) {
    return this.awsIamApi.webOrganizationsPost(this.addXApiKey({}), params);
  }

  patchOrganization (params, organizationId, etag) {
    const reqParams = {
      'if-match': etag,
      organizationId: organizationId
    };
    return this.awsIamApi.webOrganizationsOrganizationIdPatch(this.addXApiKey(reqParams), params);
  }

  blockOrganization (organizationId) {
    return this.awsIamApi.webOrganizationsOrganizationIdBlockPatch(
      this.addXApiKey({ organizationId: organizationId }),
      null
    );
  }

  unblockOrganization (organizationId) {
    return this.awsIamApi.webOrganizationsOrganizationIdUnblockPatch(
      this.addXApiKey({ organizationId: organizationId }),
      null
    );
  }

  get (requestUrl, params = {}) {
    return this.request({
      url: requestUrl,
      headers: this.headers,
      method: 'get',
      params
    });
  }

  post (requestUrl, payload = {}, params = {}) {
    return this.request({
      url: requestUrl,
      headers: this.headers,
      method: 'post',
      body: payload,
      params
    });
  }

  request ({ url, method, params = {}, body = {} }) {
    const init = {
      method,
      headers: this.headers
    };
    if (method !== 'get' && method !== 'head') {
      init.body = JSON.stringify(body);
    }
    const urlWithQuery = `${url}?${queryString.stringify(params)}`;
    const requestGateway = axios({
      ...init,
      url: `${this.endpoint}/${urlWithQuery}`
    });

    return requestGateway.then((res) => {
      if (res.status >= 400) {
        throw new Error('Bad response from server');
      }

      return res.json();
    }).then((data) => {
      if (data && !data.error) {
        return data;
      }

      return Promise.reject(data.error);
    });
  }

  addXApiKey (params = {}) {
    params['x-api-key'] = config.api.xApiKey;
    if (this.authToken) {
      params['x-api-auth-token'] = this.authToken;
    }
    return params;
  }

  setAuthToken (authToken) {
    this.authToken = authToken;
  }

  setTokensParams (tokensParams) {
    this.tokensParams = tokensParams;
    this.awsIamApi = apigClient.newClient({
      accessKey: tokensParams.deviceAccessKey,
      secretKey: tokensParams.deviceSecretKey,
      sessionToken: tokensParams.deviceSessionToken
    });
  }

  getTravelersImportBase (params = {}) {
    return this.awsIamApi.webTravelersImportBaseGet(this.addXApiKey(params), null);
  }

  webTravelersImportPost (params, body) {
    return this.awsIamApi.webTravelersImportPost(this.addXApiKey(params), body);
  }

  webTravelersImportProcessPost (params, body) {
    return this.awsIamApi.webTravelersImportProcessPost(this.addXApiKey(params), body);
  }

  globalFilterPost (params, body) {
    return this.awsIamApi.globalFilterPost(this.addXApiKey(params), body);
  }

  // travel advisory
  getTravelAdvisory (params) {
    if (!params) {
      return this.awsIamApi.webTravelAdvisoryGet(this.addXApiKey(params), null);
    }
    return this.awsIamApi.webTravelAdvisorySubscriberIdGet(this.addXApiKey(params), null);
  }

  //  webPingPost (params = {}) {
  //    return this.awsIamApi.webPingPost(this.addXApiKey(params), null);
  //  }

  catchErrors (dispatch, ACTION, error) {
    let errorMessage;

    if (error instanceof Error) {
      errorMessage = error.message;
      const errorPrefix = 'Bad Request:';
      const splitIndex = errorMessage.indexOf(errorPrefix);
      if (splitIndex !== -1) {
        errorMessage = errorMessage.substr(splitIndex + errorPrefix.length);
      }
    } else if (error && error.data && error.data.errorMessage) {
      // process server errors
      errorMessage = error.data.errorMessage;
      const errorPrefix = 'Bad Request:';
      const splitIndex = errorMessage.indexOf(errorPrefix);
      if (splitIndex !== -1) {
        errorMessage = errorMessage.substr(splitIndex + errorPrefix.length);
      }
    } else if (error && error.data && error.data.errors && error.data.errors.length && !error.data.errorMessage) {
      errorMessage = lodashMap(error.data.errors, 'message').join('\n');
    } else {
      errorMessage = error && error.message
        ? error.message
        : i18nTools.l('Unable to process your request due to server error, please try again later');
    }
    if (dispatch) {
      dispatch(notificationActions.showNotification({
        message: errorMessage,
        level: 'error'
      }));
      if (ACTION) {
        dispatch({ type: ACTION });
      }
    }
    if (error) {
      throw error;
    }
  }
}
const API = new ServerApi();
window.API = API;
export default API;
