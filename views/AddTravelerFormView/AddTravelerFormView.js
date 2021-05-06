import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import AddTravelerFormContainer from '../../components/travelerManager/addTravelerFormContainer';
import LoadingIcon from '../../components/common/loadingIcon';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import { stateUser } from '../../redux/modules/user';
import {
  actions as travelerFormActions,
  stateTraveler,
  stateCompaniesAndCostCenters,
  stateErrorMessage,
  stateFormLoading
} from '../../redux/modules/travelerManager';

import config from '../../config/index';
const headerHeight = config.layout.headerHeight;

const mapStateToProps = createSelector(
  stateTraveler,
  stateCompaniesAndCostCenters,
  stateErrorMessage,
  stateFormLoading,
  stateAppSettingsDimensions,
  stateUser,
  (traveler, companiesAndCostCenters, errorMessage, loading, appSettingsDimensions, user) => {
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
      appSettingsDimensions,
      user
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerFormActions, dispatch)
  };
};

export class AddTravelerFormView extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    traveler: PropTypes.object.isRequired,
    companiesList: PropTypes.array.isRequired,
    sortLevelIds: PropTypes.array.isRequired,
    errorMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    appSettingsDimensions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    saveTraveler: PropTypes.func.isRequired,
    loadCompanies: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };

  UNSAFE_componentWillMount () {
    this.props.loadCompanies();
  }

  componentWillUnmount () {
    this.props.resetForm();
  }

  render () {
    const containerStyle = {
      height: this.props.appSettingsDimensions.height - headerHeight
    };

    const view = !this.props.companiesList.length ? (<LoadingIcon loading />) : (
      <AddTravelerFormContainer {...this.props} />
    );
    return (
      <div className='page-content' style={containerStyle}>{view}</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTravelerFormView);
