/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import LoadingIcon from '../../components/common/loadingIcon';

import { isAdmin } from '../../helpers/user';
import { stateUserRole } from '../../redux/modules/user';

import {
  actions as importTravelersBaseActions,
  stateImportTravelersBase
} from '../../redux/modules/importTravelersBase';

const mapStateToProps = createSelector(
  stateUserRole,
  stateImportTravelersBase,
  (userRole, importTravelersBase) => {
    const loading = importTravelersBase.loading;
    const baseFile = (
      importTravelersBase.baseFile &&
      typeof importTravelersBase.baseFile === 'object' &&
      importTravelersBase.baseFile.content
        ? importTravelersBase.baseFile
        : null
    );
    if (baseFile) baseFile.name = 'sample.csv';

    return {
      baseFile,
      loading,
      userRole
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(importTravelersBaseActions, dispatch)
  };
};

export class ImportTravelersBaseContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    baseFile: PropTypes.shape({
      content: PropTypes.string,
      name: PropTypes.string
    }),
    userRole: PropTypes.string.isRequired,
    requestImportTravelersBase: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(this.props.userRole, nextProps.userRole) ||
      !isEqual(this.props.loading, nextProps.loading) ||
      !isEqual(JSON.stringify(this.props.baseFile), JSON.stringify(nextProps.baseFile))
    );
  };

  componentDidMount = () => {
    return this.props.requestImportTravelersBase();
  };

  detectIE () {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }

  detectSafari () {
    return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  }

  render () {
    const { baseFile, userRole, loading } = this.props;

    if (!isAdmin(userRole)) return null;
    const { l } = this.context.i18n;

    let downloadLink;
    const bomCode = '%EF%BB%BF';
    if (baseFile && baseFile.name && baseFile.content && baseFile.content.length > 0) {
      if (this.detectIE() !== false) {
        if (navigator.msSaveBlob) {
          downloadLink = (<a href='#' onClick={function (e) {
            e.preventDefault();
            const blob = new Blob([baseFile.content], { type: 'text/csv;charset=utf-8;' });
            navigator.msSaveBlob(blob, baseFile.name);
          }} className='download-link'>
            {l('Download Sample CSV File')}
          </a>);
        } else {
          downloadLink = <span className='alarm'>{l('It is not possible to download sample CSV file in your browser, ' +
            'please try another one')}</span>;
        }
      } else if (this.detectSafari()) {
        const url = 'data:attachment/file;charset=utf-8,' + bomCode + encodeURIComponent(baseFile.content);
        downloadLink = (<a
          textContent='download'
          href={url}
          download={baseFile.name}
          className='download-link'
          suggestedFilename={baseFile.name}
        >{l('Download Sample CSV File')}</a>);
      } else {
        const blob = new Blob([baseFile.content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        downloadLink = (<a href={url} download={baseFile.name} className='download-link'>
          {l('Download Sample CSV File')}
        </a>);
      }
    }

    // var blob = new Blob([csvString]);
    // if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
    //   window.navigator.msSaveBlob(blob, "filename.csv");
    // else
    // {
    //   var a = window.document.createElement("a");
    //   a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
    //   a.download = "filename.csv";
    //   document.body.appendChild(a);
    //   a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    //   document.body.removeChild(a);
    // }

    return (
      <span>
        {downloadLink}
        <LoadingIcon loading={loading} />
      </span>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportTravelersBaseContainer);
