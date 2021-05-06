/* eslint-disable react/no-children-prop */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import Popover from 'react-popover';
import StickyHolder from '../../components/common/stickyHolder';
import { stateSideMenuOpened } from '../../redux/modules/appSettings';
import CSVDocumentError from '../../styles/images/CSV Document Error.svg';
import {
  actions as importTravelersActions,
  // STEP_1 as IMPORT_STEP_1,
  // STEP_2 as IMPORT_STEP_2,
  STEP_3 as IMPORT_STEP_3,
  stateImportTravelers
} from '../../redux/modules/importTravelers';

const mapStateToProps = createSelector(
  stateImportTravelers,
  stateSideMenuOpened,
  (importTravelers, showSideMenu) => {
    const importingState = importTravelers.importingState;
    const importingErrors = importTravelers.importingErrors;
    return {
      importingState,
      importingErrors,
      showSideMenu
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(importTravelersActions, dispatch)
  };
};

class ITPreviewErrorCell extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    rowIndex: PropTypes.any,
    data: PropTypes.any
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      errorPopover: false
    };
  }

  renderErrors (errors) {
    return <ul className='list-unstyled alarm'>
      {errors.map(function (error, idx) {
        return <li key={idx}>{error.message}</li>;
      })}
    </ul>;
  }

  onClosePopover = () => {
    this.setState({
      ...this.state,
      errorPopover: false
    });
  };

  onShowPopover = () => {
    this.setState({
      ...this.state,
      errorPopover: true
    });
  };

  render () {
    const { l } = this.context.i18n;
    const { rowIndex, data, ...props } = this.props;
    const result = data[rowIndex];
    const hasErrors = result.errors && result.errors instanceof Array && result.errors.length > 0;
    const hasDuplicates =
        result.duplicates &&
        result.duplicates instanceof Array &&
        result.duplicates.length > 0
      ;
    const hasUpdates = result.updated instanceof Array && result.updated.length;

    let cellContent = '';
    if (hasDuplicates) {
      cellContent = (<ul className='list-unstyled already-exists'>
        {result.duplicates.map(function (error, idx) {
          return <li key={idx}>{error.message}</li>;
        })}
      </ul>);
    } else if (hasErrors) {
      cellContent = (
        <Popover
          isOpen={this.state.errorPopover}
          preferPlace='right'
          body={this.renderErrors(result.errors)}
          children={
            <div
              className='alarm row-summary status-label'
              onMouseEnter={this.onShowPopover}
              onMouseLeave={this.onClosePopover}
            >
              {l('Error')} <span className='badge'>{result.errors.length}</span>
            </div>
          }
        />
      );
    } else if (hasUpdates) {
      cellContent = (
        <Popover
          isOpen={this.state.errorPopover}
          preferPlace='right'
          body={
            <div className='already-exists-popup'>
              <span>Partial match.</span><br />
              <span>New data will overwrite existing one.</span>
            </div>
          }
          children={
            <div
              className='row-summary already-exists status-label'
              onMouseEnter={this.onShowPopover}
              onMouseLeave={this.onClosePopover}
            >
              {l('Already exists')} <i className='icon-updated' />
            </div>
          }
        />
      );
    } else {
      cellContent = (
        <div className='status-label'>
          <span>{l('Valid')}</span>
        </div>
      );
    }

    let elClass;

    if (hasUpdates) {
      elClass = 'updated-bg';
    } else if (hasDuplicates) {
      elClass = 'warnings-cell warning-bg';
    } else if (hasErrors) {
      elClass = 'errors-cell alarm-bg';
    } else {
      elClass = 'errors-cell';
    }

    return (
      <Cell className={elClass} {...props}>
        {cellContent}
      </Cell>
    );
  }
}

class ITIndexCell extends React.Component {
  static propTypes = {
    rowIndex: PropTypes.number,
    data: PropTypes.any
  };

  render () {
    const { rowIndex, data, ...props } = this.props;
    const result = data[rowIndex];
    const hasDuplicates =
        result.duplicates &&
        result.duplicates instanceof Array &&
        result.duplicates.length > 0
      ;
    const hasErrors = result.errors instanceof Array && result.errors.length;
    const hasUpdates = result.updated instanceof Array && result.updated.length;
    let elClass = 'text-center ';

    if (hasDuplicates) {
      elClass += 'warnings-cell warning-bg';
    } else if (hasUpdates) {
      elClass += 'updated-bg';
    } else if (hasErrors) {
      elClass += 'errors-cell alarm-bg';
    }

    return (
      <Cell className={elClass} {...props}>
        {rowIndex + 2}
      </Cell>
    );
  }
}

class ITDataCell extends React.Component {
  static propTypes = {
    rowIndex: PropTypes.number,
    columnKey: PropTypes.string,
    data: PropTypes.any
  };

  render () {
    const { rowIndex, columnKey, data, ...props } = this.props;
    const result = data[rowIndex];
    let cellClass;
    let columnClass;
    if (result.duplicates && result.duplicates instanceof Array && result.duplicates.length > 0) {
      columnClass = 'warning-bg';
    } else if (result.errors && result.errors instanceof Array && result.errors.length > 0) {
      columnClass = 'alarm-bg';
      const error = result.errors.filter(function (element) {
        return element.field === columnKey;
      });
      if (error.length > 0) {
        cellClass = 'alarm';
      }
    } else if (result.updated instanceof Array && result.updated.length) {
      columnClass = 'updated-bg';
      if (result.updated.includes(columnKey)) {
        cellClass = 'hightlighted-text';
      }
    }

    let value = '-';
    if (data[rowIndex].data[columnKey]) {
      value = data[rowIndex].data[columnKey];
    }

    return (
      <Cell className={columnClass} {...props}>
        <span className={cellClass}>{value}</span>
      </Cell>
    );
  }
}

export class ImportTravelersPreviewContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    importingState: PropTypes.object.isRequired,
    importingErrors: PropTypes.any,
    showSideMenu: PropTypes.bool,
    children: PropTypes.object
  };

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.children, nextProps.children) ||
      !isEqual(this.props.showSideMenu, nextProps.showSideMenu) ||
      !isEqual(JSON.stringify(this.props.importingState), JSON.stringify(nextProps.importingState)) ||
      !isEqual(this.props.importingErrors, nextProps.importingErrors)
    );
  };

  render () {
    const { l } = this.context.i18n;
    const { importingState } = this.props;

    let resultData = [];
    let resultMeta = {
      header: [],
      fail: 0,
      duplicates: 0,
      updated: 0,
      total: 0,
      success: 0
    };

    if (importingState &&
      importingState.step === IMPORT_STEP_3 &&
      importingState.result && importingState.result.data && importingState.result.meta
    ) {
      if (importingState && importingState.result) {
        if (importingState.result.meta) {
          resultMeta = importingState.result.meta;
        }
        if (importingState.result.data) {
          resultData = importingState.result.data;
        }
      }

      let previewResultTable;
      if (resultData && resultData instanceof Array && resultData.length > 0 && resultMeta) {
        const resultHasErrors =
          (resultMeta.fail && resultMeta.fail > 0) ||
          (resultMeta.duplicates && resultMeta.duplicates > 0);

        const style = {
          height: resultData.length * 50 + 50 + 20
        };

        previewResultTable = (
          <div className='result-table-preview-container' {...{ style }}>
            <Table
              width={window.innerWidth}
              headerHeight={50}
              rowsCount={resultData.length}
              rowHeight={50}
              height={600}
              {...this.props}
            >
              {(
              resultHasErrors || resultMeta.updated
                ? <Column
                header={<Cell className='errors-row'>{l('Status')}</Cell>}
                cell={
                  <ITPreviewErrorCell data={resultData} />
                }
                width={200}
                fixed
              />
                : ''
              )}
              <Column
                align='center'
                header={<Cell>#</Cell>}
                cell={
                  <ITIndexCell data={resultData} />
                }
                width={50}
                fixed
              />
              {Object.keys(resultMeta.header).map(function (columnName, idx) {
                const cellAlign = ['VIP', 'Invite', 'Blocked'].indexOf(columnName) !== -1 ? 'center' : 'left';
                const cellWidth = ['VIP', 'Invite', 'Blocked'].indexOf(columnName) !== -1 ? 100 : 200;
                return (<Column key={idx}
                  align={cellAlign}
                  columnKey={columnName}
                  header={
                    <Cell>{l(resultMeta.header[columnName])}</Cell>
                  }
                  cell={<ITDataCell data={resultData} columnKey={columnName} />}
                  width={cellWidth}
                />);
              })}
            </Table>
          </div>
        );
      } else {
        previewResultTable = <p>{l('No results found')}</p>;
      }

      return (
        <div className='import-result-preview'>
          <StickyHolder name='sh3' holderRef='pageImportScrollHolder'>
            <div className='import-summary' style={{ width: window.innerWidth }}>
              <p className='import-heading'>
                          {
            resultMeta.fail && resultMeta.fail > 0
              ? (<div>
                <img src={CSVDocumentError} alt='aaa'/>
                <p className='message-error'>
                  {l('Your upload file contains errors. Please correct the errors and upload again.')}
                </p>
              </div>
                )
              : (
                  resultMeta.duplicates && resultMeta.duplicates > 0
                    ? (
                  <p className='message-warning'>
                    {l('File includes users that already exist in 4site. ' +
                      'They will be ignored during the import process.')}
                  </p>
                      )
                    : ''
                )
          }
              </p>
              <div className='error-span'>
                <span><br></br>{l('Total number of imported travelers:')}
                 {(resultMeta.total ? resultMeta.total : 0)} :</span>
              <ul>
                {!!resultMeta.success && <li><label>{l('Valid')} - {resultMeta.success}</label></li>}
                {!!(resultMeta.duplicates || resultMeta.updated) && <li>
                  <label className='already-exists-label'>
                    {l('Already Exist')} - {(() => {
                      let number;
                      if (+resultMeta.updated && +resultMeta.duplicates) {
                        number = resultMeta.updated + resultMeta.duplicates;
                      } else if (!+resultMeta.duplicates) {
                        number = resultMeta.updated;
                      } else if (!+resultMeta.updated) {
                        number = resultMeta.duplicates;
                      }
                      return number;
                    })()}
                  </label>
                </li>}
                {!!resultMeta.fail && <li>
                  <label className='invalid-label'>{l('Errors')} - {resultMeta.fail}</label>
                </li>}
              </ul>
              </div>
              {this.props.children}
            </div>
          </StickyHolder>
          {previewResultTable}
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportTravelersPreviewContainer);
