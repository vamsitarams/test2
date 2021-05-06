import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';

const modalCustomStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0
  }
};

export default class ModalContainer extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isOpen: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      modalIsOpen: props.isOpen ? props.isOpen : false
    };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModal = (e) => {
    if (e) e.preventDefault();
    this.setState({ modalIsOpen: false });
  }

  handleModalCloseRequest = () => {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({ modalIsOpen: false });
  }

  render () {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        shouldCloseOnOverlayClick
        closeTimeoutMS={150}
        onRequestClose={this.handleModalCloseRequest}
        contentLabel=''
        style={modalCustomStyles}>
        {this.props.children}
        <a href='' className='close-button' onClick={this.closeModal}>x</a>
      </Modal>
    );
  }
}
