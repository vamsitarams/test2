import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';

import config from '../../config/index';

import { stateUser as stateCurrentUser } from '../../redux/modules/user';
import UserFormContainer from '../../components/userManager/userFormContainer';
import LoadingIcon from '../../components/common/loadingIcon';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import {
  actions as userFormActions,
  stateUser,
  stateOrganization,
  stateSortLevelIds,
  stateFormLoading,
  stateErrorMessage
} from '../../redux/modules/userManager';
const headerHeight = config.layout.headerHeight;

const mapStateToProps = createSelector(
  stateUser,
  stateSortLevelIds,
  stateOrganization,
  stateFormLoading,
  stateErrorMessage,
  stateAppSettingsDimensions,
  stateCurrentUser,
  (user, sortLevelIds, organization, formLoading, errorMessage, appSettingsDimensions, currentUser) => {
    let organizations = [];
    if (sortLevelIds.length) {
      organizations = sortLevelIds.map((organization) => {
        return { value: organization._id.$oid, label: organization.name };
      });
    }
    return {
      user,
      organizations,
      organization,
      formLoading,
      errorMessage,
      appSettingsDimensions,
      currentUser
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userFormActions, dispatch)
  };
};

export class AddUserFormView extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    match: PropTypes.object,
    organizations: PropTypes.array,
    organization: PropTypes.object,
    location: PropTypes.object,
    currentUser: PropTypes.object,
    errorMessage: PropTypes.string.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    loadSortLevelIds: PropTypes.func.isRequired,
    loadOrganization: PropTypes.func.isRequired,
    formLoading: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._load = false;
    this.state = {
      viewLoaded: false
    };
  }

  UNSAFE_componentWillMount () {
    const {
      match: { params: { organizationId } }, currentUser: { organization },
      loadSortLevelIds, loadOrganization
    } = this.props;
    if (!this._load) {
      const editedUsrOrganisation = organizationId || organization._id.$oid;
      loadSortLevelIds(editedUsrOrganisation).then(() => {
        this.setState({
          viewLoaded: true
        });
      });
      this._load = true;
    }

    if (organizationId) {
      loadOrganization(organizationId);
    }
  }

  componentWillUnmount () {
    this.props.resetForm();
  }

  render () {
    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };

    const { match: { params: { organizationId } }, organization } = this.props;
    let view, loading;
    if (!this.state.viewLoaded || organizationId && isEmpty(organization)) {
      loading = (<LoadingIcon loading />);
    } else {
      view = (<UserFormContainer {...this.props} />);
    }

    return (
      <div>
        {loading}
        <div className='scrollable-horizontally page-content' style={containerStyle}>{view}</div>
    </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUserFormView);
