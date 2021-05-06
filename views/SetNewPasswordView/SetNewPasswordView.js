import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import SetNewPasswordForm from '../../containers/User/SetNewPasswordForm';

const mapStateToProps = (state) => ({
  user: state.user
});

export class SetNewPasswordView extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.any,
    user: PropTypes.any.isRequired
  };

  render () {
    return (
      <div className='text-center'>
        <SetNewPasswordForm match={this.props.match} />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(SetNewPasswordView);
