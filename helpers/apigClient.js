import appConfig from '../config';
/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import apiGateway from '../sdk/lib/apiGatewayCore';
import uritemplate from '../sdk/lib/url-template/url-template';
import Data from "./dummydata";
const apigClientFactory = {};
apigClientFactory.newClient = function (config) {
  const apigClient = { };
  if (config === undefined) {
    config = {
      accessKey: '',
      secretKey: '',
      sessionToken: '',
      region: '',
      apiKey: undefined,
      defaultContentType: 'application/json',
      defaultAcceptType: 'application/json'
    };
  }
  if (config.accessKey === undefined) {
    config.accessKey = '';
  }
  if (config.secretKey === undefined) {
    config.secretKey = '';
  }
  if (config.apiKey === undefined) {
    config.apiKey = '';
  }
  if (config.sessionToken === undefined) {
    config.sessionToken = '';
  }
  if (config.region === undefined) {
    config.region = 'us-east-1';
  }
  // If defaultContentType is not defined then default to application/json
  if (config.defaultContentType === undefined) {
    config.defaultContentType = 'application/json';
  }
  // If defaultAcceptType is not defined then default to application/json
  if (config.defaultAcceptType === undefined) {
    config.defaultAcceptType = 'application/json';
  }

  // extract endpoint and path from url
  const invokeUrl = appConfig.api.endpoint;
  const endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
  const pathComponent = invokeUrl.substring(endpoint.length);

  const sigV4ClientConfig = {
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    sessionToken: config.sessionToken,
    serviceName: 'execute-api',
    region: config.region,
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType
  };

  let authType = 'NONE';
  if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' &&
    sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
    authType = 'AWS_IAM';
  }

  const simpleHttpClientConfig = {
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType
  };

  const apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);

  apigClient.subscribersTokensGuestGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-key'], ['body']);

    const subscribersTokensGuestGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/subscribers/tokens/guest').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(subscribersTokensGuestGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.subscribersTokensGuestOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const subscribersTokensGuestOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/subscribers/tokens/guest').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(subscribersTokensGuestOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.subscribersTokensRefreshGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-key', 'token', 'identityId'], ['body']);

    const subscribersTokensRefreshGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/subscribers/tokens/refresh').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, ['token', 'identityId']),
      body: body
    };

    return apiGatewayClient.makeRequest(subscribersTokensRefreshGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.subscribersTokensRefreshOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const subscribersTokensRefreshOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/subscribers/tokens/refresh').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(subscribersTokensRefreshOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.testGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const testGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent + uritemplate('/test').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(testGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.testOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const testOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent + uritemplate('/test').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(testOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.utilitiesCallbacksStationPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const utilitiesCallbacksStationPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/utilities/callbacks/station').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(utilitiesCallbacksStationPostRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.utilitiesCallbacksStationOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const utilitiesCallbacksStationOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/utilities/callbacks/station').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(utilitiesCallbacksStationOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webActivetravelersGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webActivetravelersGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/activetravelers').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webActivetravelersGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webActivetravelersOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webActivetravelersOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/activetravelers').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webActivetravelersOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webConstantsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webConstantsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/constants').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webConstantsGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webConstantsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webConstantsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/constants').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webConstantsOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webCostcentersGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['sort_by', 'filter_organization', 'x-api-key', 'pagesize', 'page', 'x-api-auth-token', 'search_name'], ['body']);

    const webCostcentersGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/costcenters').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key', 'x-api-auth-token']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params,
        ['sort_by', 'filter_organization', 'pagesize', 'page', 'search_name']),
      body: body
    };

    return apiGatewayClient.makeRequest(webCostcentersGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webCostcentersOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webCostcentersOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/costcenters').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webCostcentersOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webFlightsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['sort_by', 'pagesize', 'language', 'status', 'x-api-auth-token', 'airport', 'is_vip', 'x-api-key',
        'company', 'filter_costcenter_id', 'carrier', 'withCostCenters', 'page', 'needs_assistance'], ['body']);

    const webFlightsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/flights').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params,
        ['sort_by', 'pagesize', 'language', 'status', 'airport', 'is_vip', 'company', 'filter_costcenter_id',
          'carrier', 'withCostCenters', 'page', 'needs_assistance']),
      body: body
    };

    return apiGatewayClient.makeRequest(webFlightsGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webFlightsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webFlightsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/flights').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webFlightsOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webFlightsMapGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key', 'language'], ['body']);

    const webFlightsMapGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/flights/map').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, ['language']),
      body: body
    };

    return apiGatewayClient.makeRequest(webFlightsMapGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webFlightsMapOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webFlightsMapOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/flights/map').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webFlightsMapOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webFlightsSubscriberIdGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'sort_by', 'pagesize', 'language', 'status', 'x-api-auth-token', 'airport',
        'is_vip', 'x-api-key', 'company', 'datestart', 'dateend', 'filter_costcenter_id', 'carrier',
        'withCostCenters', 'fstatus', 'page', 'needs_assistance'], ['body']);

    const webFlightsSubscriberIdGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/flights/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params,
        ['sort_by', 'pagesize', 'language', 'status', 'airport', 'is_vip', 'company', 'datestart', 'dateend',
          'filter_costcenter_id', 'carrier', 'withCostCenters', 'fstatus', 'page', 'needs_assistance']),
      body: body
    };

    return apiGatewayClient.makeRequest(webFlightsSubscriberIdGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webFlightsSubscriberIdOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webFlightsSubscriberIdOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
      uritemplate('/web/flights/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
        ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webFlightsSubscriberIdOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webLastmessagesGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webLastmessagesGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
      uritemplate('/web/lastmessages').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webLastmessagesGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webLastmessagesOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webLastmessagesOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/lastmessages').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webLastmessagesOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webLastmessagesMessageIdViewGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['messageId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webLastmessagesMessageIdViewGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/lastmessages/{messageId}/view').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['messageId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webLastmessagesMessageIdViewGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webLastmessagesMessageIdViewOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['messageId'], ['body']);

    const webLastmessagesMessageIdViewOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/lastmessages/{messageId}/view').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['messageId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webLastmessagesMessageIdViewOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webLoginPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['body', 'x-api-key'], ['body']);

    const webLoginPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent + uritemplate('/web/login').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webLoginPostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webLoginOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webLoginOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent + uritemplate('/web/login').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webLoginOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['sort_by', 'with_costCenters', 'filter_agency', 'x-api-key', 'pagesize', 'filter_type', 'page',
        'x-api-auth-token', 'search_name', 'with_parents'], ['body']);

    const webOrganizationsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key', 'x-api-auth-token']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params,
        ['sort_by', 'with_costCenters', 'filter_agency', 'pagesize', 'filter_type', 'page',
          'search_name', 'with_parents']),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['body', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webOrganizationsPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsPostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webOrganizationsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['organizationId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webOrganizationsOrganizationIdGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
      uritemplate('/web/organizations/{organizationId}').expand(apiGateway.core.utils.parseParametersToObject(params,
        ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdPatch = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['organizationId', 'body', 'x-api-auth-token', 'x-api-key', 'if-match'], ['body']);

    const webOrganizationsOrganizationIdPatchRequest = {
      verb: 'patch'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key', 'if-match']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdPatchRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['organizationId'], ['body']);

    const webOrganizationsOrganizationIdOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdBlockPatch = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['organizationId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webOrganizationsOrganizationIdBlockPatchRequest = {
      verb: 'patch'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/block'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdBlockPatchRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdBlockOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['organizationId'], ['body']);

    const webOrganizationsOrganizationIdBlockOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/block'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdBlockOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdPermissionsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['organizationId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webOrganizationsOrganizationIdPermissionsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/permissions'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdPermissionsGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdPermissionsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['organizationId'], ['body']);

    const webOrganizationsOrganizationIdPermissionsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/permissions'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdPermissionsOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdUnblockPatch = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['organizationId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webOrganizationsOrganizationIdUnblockPatchRequest = {
      verb: 'patch'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/unblock'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdUnblockPatchRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdUnblockOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['organizationId'], ['body']);

    const webOrganizationsOrganizationIdUnblockOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/unblock'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdUnblockOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdUsersGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['organizationId', 'sort_by', 'x-api-key', 'pagesize', 'page', 'x-api-auth-token', 'search_name'], ['body']);

    const webOrganizationsOrganizationIdUsersGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/users'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key', 'x-api-auth-token']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params,
        ['sort_by', 'pagesize', 'page', 'search_name']),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdUsersGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdUsersPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['organizationId', 'body', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webOrganizationsOrganizationIdUsersPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/users'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdUsersPostRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdUsersOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['organizationId'], ['body']);

    const webOrganizationsOrganizationIdUsersOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/users'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdUsersOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdUsersSubscriberIdPatch = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'organizationId', 'body', 'x-api-auth-token', 'x-api-key', 'if-match'], ['body']);

    const webOrganizationsOrganizationIdUsersSubscriberIdPatchRequest = {
      verb: 'patch'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/users/{subscriberId}'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId', 'organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key', 'if-match']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdUsersSubscriberIdPatchRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webOrganizationsOrganizationIdUsersSubscriberIdOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'organizationId'], ['body']);

    const webOrganizationsOrganizationIdUsersSubscriberIdOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/organizations/{organizationId}/users/{subscriberId}'
        ).expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId', 'organizationId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webOrganizationsOrganizationIdUsersSubscriberIdOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webPasswordResetPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['body', 'x-api-key'], ['body']);

    const webPasswordResetPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/password-reset').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webPasswordResetPostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webPasswordResetOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webPasswordResetOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/password-reset').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webPasswordResetOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webPasswordResetVerifyPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['body', 'x-api-key'], ['body']);

    const webPasswordResetVerifyPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/password-reset/verify').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webPasswordResetVerifyPostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webPasswordResetVerifyOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webPasswordResetVerifyOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/password-reset/verify').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webPasswordResetVerifyOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  // apigClient.webPingPost = function (params, body, additionalParams) {
  //     if(additionalParams === undefined) { additionalParams = {}; }

  //     apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

  //     var webPingPostRequest = {
  //         verb: 'post'.toUpperCase(),
  //         path: pathComponent + uritemplate('/web/ping'
  //         ).expand(apiGateway.core.utils.parseParametersToObject(params, [])),
  //         headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
  //         queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
  //         body: body
  //     };

  //     return apiGatewayClient.makeRequest(webPingPostRequest, authType, additionalParams, config.apiKey);
  // };

  // apigClient.webPingOptions = function (params, body, additionalParams) {
  //     if(additionalParams === undefined) { additionalParams = {}; }

  //     apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

  //     var webPingOptionsRequest = {
  //         verb: 'options'.toUpperCase(),
  //         path: pathComponent + uritemplate('/web/ping'
  //         ).expand(apiGateway.core.utils.parseParametersToObject(params, [])),
  //         headers: apiGateway.core.utils.parseParametersToObject(params, []),
  //         queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
  //         body: body
  //     };

  //     return apiGatewayClient.makeRequest(webPingOptionsRequest, authType, additionalParams, config.apiKey);
  // };

  apigClient.webProductsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webProductsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/products').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webProductsGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webStationsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['active_from', 'x-api-auth-token', 'x-api-key', 'active_to'], ['body']);

    const webStationsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/stations').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, ['active_from', 'active_to']),
      body: body
    };

    return apiGatewayClient.makeRequest(webStationsGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webStationsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webStationsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/stations').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webStationsOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelAdvisoryGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelAdvisoryGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travel-advisory').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelAdvisoryGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelAdvisoryOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelAdvisoryOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travel-advisory').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelAdvisoryOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelAdvisorySubscriberIdGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelAdvisorySubscriberIdGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travel-advisory/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelAdvisorySubscriberIdGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelAdvisorySubscriberIdOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelAdvisorySubscriberIdOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travel-advisory/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelAdvisorySubscriberIdOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelAdvisoryParsePost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['body', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelAdvisoryParsePostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travel-advisory/parse').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelAdvisoryParsePostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelAdvisoryParseOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelAdvisoryParseOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travel-advisory/parse').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelAdvisoryParseOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['sort_by', 'pagesize', 'filter_isVIP', 'filter_jstatus_warning', 'filter_jstatus_ok',
        'x-api-auth-token', 'filter_nonHelped', 'withCompanies', 'x-api-key', 'filter_costcenter_id',
        'filter_jstatus_alarm', 'filter_organization_id', 'withCostCenters', 'page'], ['body']);

    const webTravelersGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params,
        ['sort_by', 'pagesize', 'filter_isVIP', 'filter_jstatus_warning', 'filter_jstatus_ok',
          'filter_nonHelped', 'withCompanies', 'filter_costcenter_id', 'filter_jstatus_alarm',
          'filter_organization_id', 'withCostCenters', 'page']),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['body', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersPostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelersOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersHelpedGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersHelpedGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/helped').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersHelpedGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersHelpedOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersHelpedOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/helped').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersHelpedOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersImportPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersImportPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/import').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersImportPostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersImportOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelersImportOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/import').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersImportOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersImportBaseGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersImportBaseGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/import/base').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersImportBaseGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersImportBaseOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelersImportBaseOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/import/base').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersImportBaseOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersImportProcessPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersImportProcessPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
      uritemplate('/web/travelers/import/process').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersImportProcessPostRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersImportProcessOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelersImportProcessOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
      uritemplate('/web/travelers/import/process').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersImportProcessOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSearchPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['body', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSearchPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/search').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSearchPostRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSearchOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webTravelersSearchOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/search').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSearchOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    // return apiGatewayClient.makeRequest(webTravelersSubscriberIdGetRequest, authType, additionalParams, config.apiKey);
    //returning dummy data
    return Data['travelers']
  };

  apigClient.webTravelersSubscriberIdPatch = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'body', 'x-api-auth-token', 'x-api-key', 'if-match'], ['body']);

    const webTravelersSubscriberIdPatchRequest = {
      verb: 'patch'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key', 'if-match']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdPatchRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webTravelersSubscriberIdOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdBlockGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdBlockGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/block').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdBlockGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdBlockOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webTravelersSubscriberIdBlockOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/block').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdBlockOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdCasesActionsPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'body', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdCasesActionsPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/cases/actions'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdCasesActionsPostRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdCasesActionsPatch = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'body', 'x-api-auth-token', 'x-api-key', 'if-match'], ['body']);

    const webTravelersSubscriberIdCasesActionsPatchRequest = {
      verb: 'patch'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/cases/actions'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key', 'if-match']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdCasesActionsPatchRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdCasesActionsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webTravelersSubscriberIdCasesActionsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/cases/actions'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdCasesActionsOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdCasesActionsCaseActionIdGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'caseActionId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdCasesActionsCaseActionIdGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/cases/actions/{caseActionId}'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId', 'caseActionId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdCasesActionsCaseActionIdGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdCasesActionsCaseActionIdOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['caseActionId', 'subscriberId'], ['body']);

    const webTravelersSubscriberIdCasesActionsCaseActionIdOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/cases/actions/{caseActionId}'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['caseActionId', 'subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdCasesActionsCaseActionIdOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdInviteGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdInviteGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/invite').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdInviteGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdInviteOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webTravelersSubscriberIdInviteOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/invite').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdInviteOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdLatestproductsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdLatestproductsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/latestproducts'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdLatestproductsGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdLatestproductsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdLatestproductsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/latestproducts'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdLatestproductsOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdReservationsGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'x-api-auth-token', 'x-api-key', 'language'], ['body']);

    const webTravelersSubscriberIdReservationsGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/reservations'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, ['language']),
      body: body
    };

    // return apiGatewayClient.makeRequest(webTravelersSubscriberIdReservationsGetRequest,
    //   authType, additionalParams, config.apiKey);
    return Data['reservations']

  };

  apigClient.webTravelersSubscriberIdReservationsOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webTravelersSubscriberIdReservationsOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/reservations'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdReservationsOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdTimelineGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'x-api-auth-token', 'x-api-key', 'language'], ['body']);

    const webTravelersSubscriberIdTimelineGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/timeline'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, ['language']),
      body: body
    };

    // return apiGatewayClient.makeRequest(webTravelersSubscriberIdTimelineGetRequest,
    //   authType, additionalParams, config.apiKey);
    //returning dummy data
    return Data["timeline"]



  };

  apigClient.webTravelersSubscriberIdTimelineOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webTravelersSubscriberIdTimelineOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/timeline'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdTimelineOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdUnblockGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webTravelersSubscriberIdUnblockGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/unblock'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdUnblockGetRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webTravelersSubscriberIdUnblockOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webTravelersSubscriberIdUnblockOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/travelers/{subscriberId}/unblock'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webTravelersSubscriberIdUnblockOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webUserGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['x-api-auth-token', 'x-api-key'], ['body']);

    const webUserGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent + uritemplate('/web/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webUserOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    const webUserOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent + uritemplate('/web/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'withPermissions', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webUserSubscriberIdGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, ['withPermissions']),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdPatch = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'body', 'x-api-auth-token', 'x-api-key', 'if-match'], ['body']);

    const webUserSubscriberIdPatchRequest = {
      verb: 'patch'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key', 'if-match']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdPatchRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webUserSubscriberIdOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdOptionsRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdBlockGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webUserSubscriberIdBlockGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}/block').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdBlockGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdBlockOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webUserSubscriberIdBlockOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}/block').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdBlockOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdPasswordResetPost = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params,
      ['subscriberId', 'body', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webUserSubscriberIdPasswordResetPostRequest = {
      verb: 'post'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}/password-reset'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdPasswordResetPostRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdPasswordResetOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webUserSubscriberIdPasswordResetOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}/password-reset'
        ).expand(apiGateway.core.utils.parseParametersToObject(params, ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdPasswordResetOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdUnlockGet = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId', 'x-api-auth-token', 'x-api-key'], ['body']);

    const webUserSubscriberIdUnlockGetRequest = {
      verb: 'get'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}/unlock').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, ['x-api-auth-token', 'x-api-key']),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdUnlockGetRequest, authType, additionalParams, config.apiKey);
  };

  apigClient.webUserSubscriberIdUnlockOptions = function (params, body, additionalParams) {
    if (additionalParams === undefined) { additionalParams = {}; }

    apiGateway.core.utils.assertParametersDefined(params, ['subscriberId'], ['body']);

    const webUserSubscriberIdUnlockOptionsRequest = {
      verb: 'options'.toUpperCase(),
      path: pathComponent +
        uritemplate('/web/user/{subscriberId}/unlock').expand(apiGateway.core.utils.parseParametersToObject(params,
          ['subscriberId'])),
      headers: apiGateway.core.utils.parseParametersToObject(params, []),
      queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
      body: body
    };

    return apiGatewayClient.makeRequest(webUserSubscriberIdUnlockOptionsRequest,
      authType, additionalParams, config.apiKey);
  };

  return apigClient;
};
export default apigClientFactory;
