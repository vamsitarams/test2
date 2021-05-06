import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { stateAppSettingsConstants } from '../../redux/modules/appSettings';
import { Accordion, AccordionItem } from 'react-sanfona';

const mapStateToProps = createSelector(
  stateAppSettingsConstants,
  (appSettingsConstants) => {
    return {
      appSettingsConstants
    };
  }
);

export class CaseActionsAccordionContainer extends React.Component {
  static propTypes = {
    appSettingsConstants: PropTypes.object.isRequired,
    code: PropTypes.string,
    subCode: PropTypes.string,
    addAction: PropTypes.func
  };

  addAction = (code, subCode) => (e) => {
    e.preventDefault();
    if (this.props.addAction) {
      this.props.addAction(code, subCode);
    }
  }

  render = () => {
    const { appSettingsConstants } = this.props;
    const accordionItems = appSettingsConstants.caseActions.actions.map((action) => (
      <AccordionItem title={action.name} key={action.code}>
        <ul>
          {action.subactions.map((subAction) => (
            <li key={subAction.code}>
              <a href='' onClick={this.addAction(action.code, subAction.code)}>{subAction.name}</a>
            </li>
          ))}
        </ul>
      </AccordionItem>
    ));

    return (
      <Accordion>
        {accordionItems}
      </Accordion>
    );
  };
}

export default connect(mapStateToProps, null)(CaseActionsAccordionContainer);
