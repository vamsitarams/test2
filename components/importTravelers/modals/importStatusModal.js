import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import Modal from '../../../containers/Common/Modal';
import { stateUserRole } from '../../../redux/modules/user';
import LoadingIcon from '../../../components/common/loadingIcon';

import {
  actions as importTravelersActions,
  stateImportTravelers
} from '../../../redux/modules/importTravelers';

const mapStateToProps = createSelector(
  stateUserRole,
  stateImportTravelers,
  (userRole, importTravelers) => {
    const importStatusModal = importTravelers.importStatusModal;
    const importingState = importTravelers.importingState;
    const serverLoading = importTravelers.serverLoading;
    return {
      importStatusModal,
      importingState,
      serverLoading
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(importTravelersActions, dispatch)
  };
};

export class ImportStatusModal extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    isOpen: PropTypes.bool,
    importingState: PropTypes.object.isRequired,
    importStatusModal: PropTypes.object,
    serverLoading: PropTypes.bool,
    resetState: PropTypes.func.isRequired,
    setStateImportProcessStart: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._modalRef = React.createRef();
    this.state = {
      serverLoading: this.props.serverLoading,
      importStatusModal: this.props.importStatusModal
    };
  }

  closeModal = () => {
    this.props.resetState();
    this._modalRef.current.closeModal();
  }

  reUploadAction = () => {
    this.props.setStateImportProcessStart(this.props.importingState);
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      ...this.state,
      serverLoading: nextProps.serverLoading,
      importStatusModal: nextProps.importStatusModal
    });
  }

  render () {
    const { l } = this.context.i18n;
    const { serverLoading, importStatusModal: { isOpen, title, message, isReUploadButton } } = this.state;

    return (
      <Modal isOpen={isOpen} ref={this._modalRef}>
        <div className='modal-container import-status-modal'>
          <h1>{title}</h1>
          <div className='modal-content'>
            {message}
          </div>
          <div className='btn-hold'>
            <button className='btn btn03' type='button' onClick={this.closeModal}>{l('Close')}</button>
            {(
              isReUploadButton
                ? <button
                  className={`${(serverLoading ? 'disabled' : '')} btn btn01`}
                  type='button'
                  onClick={serverLoading ? null : this.reUploadAction}
                  disabled={serverLoading}>
                  {l('Reupload the file')}
                </button>
                : null
            )}
          </div>
          <LoadingIcon loading={serverLoading} />
        </div>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportStatusModal);
