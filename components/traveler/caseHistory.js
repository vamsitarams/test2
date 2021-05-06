import PropTypes from 'prop-types';
import React from 'react';
import LoadingIcon from '../../components/common/loadingIcon';
import find from 'lodash/find';

export class CaseHistory extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    cases: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    addTravelerAction: PropTypes.func.isRequired,
    constants: PropTypes.object.isRequired,
    traveler: PropTypes.object,
    editingCase: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired
  };

  editCase = (actionId, subActionId, comment, caseActionId, etag) => (e) => {
    e.preventDefault();
    this.props.addTravelerAction(actionId, subActionId, comment, caseActionId, etag);
  }

  get cases () {
    const { l, getTimezoneTime } = this.context.i18n;

    const { cases, constants: { caseActions } } = this.props;
    const actions = [
      ...caseActions.actions,
      caseActions.action_buttons.help,
      caseActions.action_buttons.close,
      caseActions.action_buttons.release
    ];
    return cases.map((caseItem) => {
      let caseAction;
      if (actions.length) {
        caseAction = find(actions, (action) => {
          if (caseItem.action === action.code) {
            return true;
          }
        });
      }
      if (!caseAction) return null;

      let actionName = caseAction.name;
      if (caseAction.subactions && caseItem.subaction && caseItem.subaction.length) {
        const caseSubAction = find(caseAction.subactions, (action) => {
          if (caseItem.subaction === action.code) {
            return true;
          }
        });
        actionName += ' - ' + caseSubAction.name;
      }
      let edit;
      if (
        caseItem.action !== caseActions.action_buttons.help.code &&
        caseItem.action !== caseActions.action_buttons.close.code &&
        caseItem.action !== caseActions.action_buttons.release.code &&
        this.props.traveler.helpedBy &&
        this.props.traveler.helpedBy.status !== 'released' &&
        this.props.traveler.helpedBy.status !== 'closed' &&
        this.props.traveler.helpedBy.caseId === caseItem.caseId.$oid
      ) {
        const editFn = this.editCase(
          caseItem.action,
          caseItem.subaction,
          caseItem.description,
          caseItem._id.$oid,
          caseItem._etag.$oid
        );
        edit = <a className='edit-link' href='' onClick={editFn}>{l('Edit')}</a>;
      }
      const description = caseItem.description ? (<p>{caseItem.description}</p>) : '';
      const createdTime = getTimezoneTime(caseItem.createdDateTime.$date, 'MMM D, h:mm A');
      let editedTime = null;
      if (
        caseItem.editedDateTime &&
        caseItem.editedDateTime.$date !== caseItem.createdDateTime.$date
      ) {
        editedTime = ', ' + getTimezoneTime(caseItem.editedDateTime.$date, 'MMM D, h:mm A');
      }

      return (
        <div className='case-item' key={caseItem._id.$oid}>
          <span className='date'>{createdTime}</span>
          <div className='text-holder'>
            <h3>{actionName}</h3>
            {description}
            <span className='helpedMsg'>{caseItem.comment}{editedTime}</span>
            {edit}
          </div>
        </div>
      );
    });
  }

  render () {
    const { l } = this.context.i18n;
    const { loading } = this.props;

    const cases = !loading && !this.cases.length
      ? (<div className='no-events'>{l('There are no cases')}</div>)
      : this.cases;

    return (
      <div>
        {loading ? <LoadingIcon loading /> : null}
        {cases}
      </div>
    );
  }
}
export default CaseHistory;
