import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import EditTravelerFormContainer from '../../components/travelerManager/editTravelerFormContainer';
import LoadingIcon from '../../components/common/loadingIcon';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import { stateUser } from '../../redux/modules/user';
import {
  actions as travelerFormActions,
  stateTraveler,
  stateCompaniesAndCostCenters,
  stateErrorMessage,
  stateFormLoading,
  stateTravelerLoading,
  stateSendInvitationLoading
} from '../../redux/modules/travelerManager';

import config from '../../config/index';
const headerHeight = config.layout.headerHeight;

const mapStateToProps = createSelector(
  stateTraveler,
  stateCompaniesAndCostCenters,
  stateErrorMessage,
  stateFormLoading,
  stateTravelerLoading,
  stateAppSettingsDimensions,
  stateSendInvitationLoading,
  stateUser,
  (traveler, companiesAndCostCenters, errorMessage, loading, travelerLoading, appSettingsDimensions,
    sendInvitationLoading, user) => {
    const { companies, sortLevelIds } = companiesAndCostCenters;
    let companiesList = [];
    if (companies.length) {
      companiesList = companies.map((company) => {
        return { value: company._id.$oid, label: company.name };
      });
    }

    return {
      traveler,
      companiesList,
      sortLevelIds,
      errorMessage,
      loading,
      travelerLoading,
      appSettingsDimensions,
      sendInvitationLoading,
      user
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerFormActions, dispatch)
  };
};

export class EditTravelerFormView extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    traveler: PropTypes.object.isRequired,
    companiesList: PropTypes.array.isRequired,
    sortLevelIds: PropTypes.array.isRequired,
    errorMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    travelerLoading: PropTypes.bool.isRequired,
    sendInvitationLoading: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
    appSettingsDimensions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    saveTraveler: PropTypes.func.isRequired,
    loadCompanies: PropTypes.func.isRequired,
    loadTraveler: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired
  };

  UNSAFE_componentWillMount () {
    const { match: { params: { id } } } = this.props;
    this.props.loadCompanies();
    this.props.loadTraveler(id);
  }

  render () {
    const formProps = {
      ...this.props,
      isEdit: true
    };

    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };

    const view = (this.props.travelerLoading || !this.props.companiesList.length) ? null
      : (<EditTravelerFormContainer {...formProps} />);
    return (
      <div className='page-content' style={containerStyle}>
        <LoadingIcon loading={this.props.travelerLoading || !this.props.companiesList.length} />
        {view}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTravelerFormView);
