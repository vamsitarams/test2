import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { actions as userActions, stateUser } from '../../redux/modules/user';

import Header from '../../components/header';

const mapStateToProps = createSelector(
  stateUser,
  (stateUser) => {
    return {
      user: stateUser
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(userActions, dispatch)
  };
};

export class HeaderContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render () {
    return (
      <Header {...this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
