import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../../containers/Common/Modal';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../../components/common/collapse';
import CaseActionsAccordion from '../../../containers/Common/CaseActionsAccordion';

export default class AddCaseActionModal extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    isOpen: PropTypes.bool,
    actionId: PropTypes.string,
    subActionId: PropTypes.string,
    description: PropTypes.string,
    caseActions: PropTypes.array.isRequired,
    addCase: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._descriptionRef = React.createRef();
    this._modalRef = React.createRef();
    this._dropRef = React.createRef();
    this.state = {
      caseId: null,
      eTag: null,
      isOpen: props.isOpen ? props.isOpen : false,
      actionId: props.actionId ? props.actionId : false,
      description: props.description ? props.description : false,
      subActionId: props.subActionId ? props.subActionId : false
    };
  }

  addCaseAction = (e) => {
    e.preventDefault();
    if (this.state.actionId && this.state.subActionId) {
      this.props.addCase(
        this.state.actionId,
        this.state.subActionId,
        this._descriptionRef.current.value,
        this.state.caseId,
        this.state.eTag
      );
      this._modalRef.current.closeModal();
    }
  }

  addTravelerAction = (actionId, subActionId, description) => {
    this._dropRef.current.close();
    this.setState({
      actionId: actionId,
      subActionId: subActionId,
      description: description
    });
  }

  showAddCaseActionModal = (actionId, subActionId, description, caseId, eTag) => {
    this._modalRef.current.openModal();
    this.setState({
      actionId,
      subActionId,
      caseId,
      eTag,
      description
    });
  }

  render () {
    const { l } = this.context.i18n;
    const { caseActions } = this.props;
    const { actionId, subActionId, description, caseId } = this.state;
    let name = l('Select Case Action');
    caseActions.forEach((action) => {
      if (action.code === actionId) {
        name = action.name;
        action.subactions.forEach((subAction) => {
          if (subAction.code === subActionId) {
            name += ' > ' + subAction.name;
          }
        });
      }
    });

    const buttonLabel = caseId ? l('Edit') : l('Add');

    return (
      <Modal isOpen={this.state.isOpen} ref={this._modalRef}>
        <form onSubmit={this.addCaseAction}>
          <div className='modal-head'><h3>{l('Add Case Action')}</h3></div>
          <div className='modal-block'>
            <div className='fake-select'>
              <CollapseHolder ref={this._dropRef} style='fade' closeByOutsideClick='true'>
                <CollapseOpener>
                  <em>{name}</em>
                  <span className='arrow' />
                </CollapseOpener>
                <CollapseBlock>
                  <div className='fake-select-drop'>
                    <CaseActionsAccordion addAction={this.addTravelerAction} />
                  </div>
                </CollapseBlock>
              </CollapseHolder>
            </div>
            <textarea placeholder={l('Add comment')} ref={this._descriptionRef} defaultValue={description} />
            <div className='btn-hold'>
              <button className='btn btn01' type='submit' disabled={!(actionId && subActionId)}>{buttonLabel}</button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }
}
