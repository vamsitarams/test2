import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { actions as travelerDetailsActions, stateCaseHistory } from '../../redux/modules/travelerDetails';
import { stateAppSettingsConstants } from '../../redux/modules/appSettings';

import CaseHistory from '../../components/traveler/caseHistory';

const mapStateToProps = createSelector(
  stateCaseHistory,
  stateAppSettingsConstants,
  (caseHistory, appSettingsConstants) => {
    return {
      cases: caseHistory.cases,
      loading: caseHistory.loading,
      editingCase: caseHistory.editingCase,
      constants: appSettingsConstants
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerDetailsActions, dispatch)
  };
};

class CaseHistoryContainer extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    traveler: PropTypes.object,
    cases: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    editingCase: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    constants: PropTypes.object.isRequired,
    requestTravelerCaseHistory: PropTypes.func.isRequired,
    addTravelerAction: PropTypes.func.isRequired
  };

  UNSAFE_componentWillMount () {
    if (!this.props.cases || this.props.cases.length === 0) {
      this.props.requestTravelerCaseHistory(this.props.match.params.id);
    }
  }

  render () {
    return (
      <CaseHistory {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseHistoryContainer);
