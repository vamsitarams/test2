import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LoadingIcon from '../../components/common/loadingIcon';

const mapStateToProps = (state) => ({
  loading: state.loading
});

export class LoadingContainer extends React.Component {
  static propTypes = {
    loading: PropTypes.bool
  };

  render () {
    const { loading } = this.props;
    return (
      <LoadingIcon loading={loading} overlay />
    );
  }
}

export default connect(mapStateToProps, null)(LoadingContainer);
