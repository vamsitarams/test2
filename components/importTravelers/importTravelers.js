import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import { Link } from 'react-router-dom';

import { isAdmin } from '../../helpers/user';
import { stateUserRole } from '../../redux/modules/user';
import ImportTravelersBase from '../../components/importTravelers/importTravelersBase';
import ImportTravelersPreview from '../../components/importTravelers/ImportTravelersPreview';
import LoadingIcon from '../../components/common/loadingIcon';

import {
  actions as importTravelersActions,
  STEP_1 as IMPORT_STEP_1,
  STEP_2 as IMPORT_STEP_2,
  STEP_3 as IMPORT_STEP_3,
  STEP_5 as IMPORT_STEP_5,
  stateImportTravelers
} from '../../redux/modules/importTravelers';

const mapStateToProps = createSelector(
  stateUserRole,
  stateImportTravelers,
  (userRole, importTravelers) => {
    const importingState = importTravelers.importingState;
    const importingErrors = importTravelers.importingErrors;
    const serverLoading = importTravelers.serverLoading;
    return {
      importingState,
      userRole,
      importingErrors,
      serverLoading
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(importTravelersActions, dispatch)
  };
};

export class ImportTravelersContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    importingState: PropTypes.object.isRequired,
    importingErrors: PropTypes.any,
    serverLoading: PropTypes.bool,
    userRole: PropTypes.string.isRequired,
    resetState: PropTypes.func.isRequired,
    setStateImportFileStart: PropTypes.func.isRequired,
    setStateImportFileProcess: PropTypes.func.isRequired,
    setStateImportFilePreview: PropTypes.func.isRequired,
    setStateImportFileError: PropTypes.func.isRequired,
    setStateImportProcessStart: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.userRole, nextProps.userRole) ||
      !isEqual(JSON.stringify(this.props.importingState), JSON.stringify(nextProps.importingState)) ||
      !isEqual(this.props.importingErrors, nextProps.importingErrors) ||
      !isEqual(this.props.serverLoading, nextProps.serverLoading)
    );
  };

  isImportReady = () => {
    console.log(this.props.importingState &&
      this.props.importingState.step === IMPORT_STEP_3 &&
      this.props.importingState.result &&
      this.props.importingState.result.meta);
    return (
      this.props.importingState &&
      this.props.importingState.step === IMPORT_STEP_3 &&
      this.props.importingState.result &&
      this.props.importingState.result.meta && this.props.importingState.result.meta.total > 0 &&
      (!this.props.importingState.result.meta.fail ||
      (this.props.importingState.result.meta.fail && this.props.importingState.result.meta.fail === 0)
      )
    );
  };

  onFileInputClick () {
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInput').click();
  };

  onFileInputDrop (event) {
    event.preventDefault();

    let files;
    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event.target) {
      files = event.target.files;
    }

    const reader = new FileReader();
    const processFile = files[0];

    const fileInfo = {
      name: (processFile.name || null),
      size: (processFile.size || null),
      type: (processFile.type ? processFile.type.toString().toLowerCase() : null)
    };

    if (!fileInfo.name) {
      return this.props.setStateImportFileError({
        ...fileInfo,
        error: 'Invalid file provided. Please correct and try your upload again.'
      });
    }

    if (fileInfo.type) {
      if ([
        'text/csv',
        'text/x-comma-separated-values',
        'application/vnd.ms-excel',
        'application/vnd.msexcel',
        'application/csv',
        'text/comma-separated-values'
      ].indexOf(fileInfo.type) === -1) {
        return this.props.setStateImportFileError({
          ...fileInfo,
          error: 'Invalid file format. Please correct and try your upload again.'
        });
      }
    } else {
      // check the file extension
      const fileExtension = fileInfo.name.split('.').pop();
      if ([
        'csv',
        'txt'
      ].indexOf(fileExtension) === -1) {
        return this.props.setStateImportFileError({
          ...fileInfo,
          error: 'Invalid file format. Please correct and try your upload again.'
        });
      } else {
        fileInfo.type = 'text/csv';
      }
    }

    if (fileInfo.size > 4 * 1024 * 1024) {
      return this.props.setStateImportFileError({
        ...fileInfo,
        error: 'Invalid file size (limit 4MB). Please correct and try your upload again.'
      });
    }

    reader.onloadend = (event) => {
      this.props.setStateImportFilePreview({
        ...fileInfo,
        loaded: event.loaded,
        total: event.total,
        content: event.target.result
      });
    };

    reader.onloadstart = (event) => {
      this.props.setStateImportFileStart(fileInfo);
    };

    reader.onabort = (event) => {
      console.error('Error reading the file' + event.target.error.code);
    };

    reader.onprogress = (event) => {
      this.props.setStateImportFileProcess({
        name: fileInfo.name,
        loaded: event.loaded,
        total: event.total
      });
    };

    // reader.readAsBinaryString(processFile);
    reader.readAsText(processFile, 'UTF-8');
  };

  startImportProcess () {
    this.props.setStateImportProcessStart(this.props.importingState);
  }

  constructor (props) {
    super(props);
    this.onFileInputDrop = this.onFileInputDrop.bind(this);
    this.startImportProcess = this.startImportProcess.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.props.resetState(); // This initialize state from the props
  }

  render () {
    if (!isAdmin(this.props.userRole)) return null;
    const { l } = this.context.i18n;

    const currentStep = (this.props.importingState && this.props.importingState.step
      ? this.props.importingState.step
      : IMPORT_STEP_1
    );
    const isImportReady = this.isImportReady();
    let fileInformation;

    if (currentStep === IMPORT_STEP_2 && this.props.serverLoading) {
      const process = { width: this.props.importingState.fileProcess + '%' };
      fileInformation = (
        <div className='progress-wrap-with-icon'>
          <span className='progressbar-text'>Uploading CSV FIle ...</span>
          <div className='progress-container'>
            <div className='progressbar' style={process} />
          </div>
        </div>
      );
    } else if (this.props.importingState && this.props.importingState.fileName) {
      if (
        this.props.importingErrors &&
        typeof this.props.importingErrors === 'string' &&
        this.props.importingErrors.length > 0
      ) {
        fileInformation = (
          <p className='alarm upload-file-link'><span>{this.props.importingErrors}</span></p>
        );
      } else if (currentStep === IMPORT_STEP_5 && this.props.importingState.result) {
        fileInformation =
          <p
            className='success upload-file-link import-success'
          >{l('Import success')}: {this.props.importingState.result.meta.success} {l('records')}</p>;
      } else if (currentStep === IMPORT_STEP_3 && this.props.importingState.result) {
        fileInformation = <p>{this.props.importingState.fileName}</p>;
      } else {
        fileInformation = <p className='upload-file-link'>{this.props.importingState.fileName}</p>;
      }
    }

    const { importingState } = this.props;
    const importingStateResult = importingState && importingState.result && importingState.result.data;
    const ctrls = (
      <div className='import-buttons-container'>
        <Link to='/travelers-list' className='btn btn03 btn-user-disabled'>
          {l('Cancel')}
        </Link>
        <a href='#'
          style={!importingStateResult ? { display: 'none' } : { display: 'inline-block' } }
          className='btn import-btn'
          onClick={(isImportReady ? this.startImportProcess : null)}
          disabled={isImportReady}>{l('Import')}</a>
      </div>
    );

    return (
      <div className='import-container'>
        <div className='import-desc'>
          <span>{l('You can import traveler details from a CSV file to the existing list of travelers.')}</span>
          <ImportTravelersBase />
        </div>
        <div className='import-process-container'>
          <div className='import-process-file' onClick={this.onFileInputClick} onDrop={this.onFileInputDrop}>
            <input
              style={{ display: 'none' }}
              type='file' id='fileInput'
              onChange={this.onFileInputDrop}
              accept='text/csv' />
            <a className='btn btn03 btn-add-user'><span>{l('Upload CSV File')}</span></a>
          </div>
          <div className='import-process-status'>{console.log(fileInformation)}</div>
        </div>
        {!importingStateResult && (<div style={{ minHeight: '350px' }}></div>)}
          {!importingStateResult && ctrls}
          <ImportTravelersPreview/>
            {importingStateResult ? ctrls : ''}
        <LoadingIcon loading={this.props.serverLoading} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportTravelersContainer);
