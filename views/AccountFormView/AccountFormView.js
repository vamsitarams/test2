import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';

import config from '../../config/index';

import { stateUser as stateCurrentUser } from '../../redux/modules/user';
import AccountFormContainer from '../../components/account/accountFormContainer';
import LoadingIcon from '../../components/common/loadingIcon';
import { TYPE_COMPANY } from '../../helpers/organization';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import {
  actions as organizationFormActions,
  stateOrganization,
  stateCostCenters,
  stateFormLoading,
  stateBlockLoading,
  stateErrorMessage
} from '../../redux/modules/organizationManager';
const headerHeight = config.layout.headerHeight;

const mapStateToProps = createSelector(
  stateOrganization,
  stateCostCenters,
  stateFormLoading,
  stateBlockLoading,
  stateErrorMessage,
  stateAppSettingsDimensions,
  stateCurrentUser,
  (organization, costCenters, formLoading, blockLoading, errorMessage, appSettingsDimensions, currentUser) => {
    return {
      organization,
      costCenters,
      formLoading,
      blockLoading,
      errorMessage,
      appSettingsDimensions,
      currentUser
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(organizationFormActions, dispatch)
  };
};

export class AccountFormView extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.object,
    organization: PropTypes.object,
    errorMessage: PropTypes.string.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    loadOrganization: PropTypes.func.isRequired,
    formLoading: PropTypes.bool.isRequired,
    blockLoading: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    saveOrganization: PropTypes.func.isRequired,
    costCenters: PropTypes.array,
    loadCostCenters: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      viewLoaded: false
    };
  }

  UNSAFE_componentWillMount () {
    const { match: { params: { organizationId } }, loadOrganization, loadCostCenters } = this.props;
    if (organizationId) {
      loadOrganization(organizationId).then(() => {
        const { organization } = this.props;
        if (organization && organization.type === TYPE_COMPANY) {
          loadCostCenters(organizationId).then(() => {
            this.setState({
              viewLoaded: true
            });
          });
        } else {
          this.setState({
            viewLoaded: true
          });
        }
      });
    } else {
      this.setState({
        viewLoaded: true
      });
    }
  }

  componentWillUnmount () {
    this.props.resetForm();
  }

  render () {
    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };
    const { match: { params: { organizationId } }, organization, blockLoading } = this.props;
    let view, loading;
    const isEdit = (organizationId && !isEmpty(organization));

    if (blockLoading) {
      loading = (<LoadingIcon loading />);
    }

    if (!this.state.viewLoaded || organizationId && isEmpty(organization)) {
      loading = (<LoadingIcon loading />);
    } else {
      view = (<AccountFormContainer {...this.props} isEdit={isEdit} />);
    }
    return (
      <div>
        {loading}
        <div className='scrollable-horizontally page-content' style={containerStyle}>{view}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountFormView);
