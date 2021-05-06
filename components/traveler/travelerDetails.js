import PropTypes from 'prop-types';
import React from 'react';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../components/common/collapse';
import EditBlock from '../../containers/TravelerManager/editBlock';
import AppInformationModal from './modals/appInformationModal';
import { isAdmin, isCompanyAdminOrUser, isGlobalAdmin } from '../../helpers/user';
import config from '../../config';
import Mask from '../../components/common/mask';
import lodashFind from 'lodash/find';
import filter from 'lodash/filter';

export class TravelerDetails extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    location: PropTypes.object,
    traveler: PropTypes.object.isRequired,
    onlineStatus: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this._appInformationModalRef = React.createRef();
  }

  get vip () {
    if (this.props.traveler.isVIP) {
      return (<span className='vip'>VIP</span>);
    }
  }

  get status () {
    const status = this.props.traveler.currentJourneyStatus;
    const blockedStatus = this.props.traveler.status;
    if (status && blockedStatus !== 'blocked') {
      return (<span className={`${status} icon`}>{status}</span>);
    }
  }

  get blocked () {
    const { l } = this.context.i18n;
    const blockedStatus = this.props.traveler.status;
    if (blockedStatus === 'blocked') {
      return (
        <div className='blocked-set'>
          <span className='glyphicon glyphicon-lock' />
          <span className='blocked-tooltip text-warning'>{l('Admin can unblock traveler on Edit Traveler page.')}</span>
        </div>
      );
    }
  }

  get onlineStatus () {
    const { l } = this.context.i18n;
    const { onlineStatus, traveler } = this.props;
    const hasApp = traveler.app_4site && traveler.app_4site.status;
    if (!hasApp) {
      return (<span className='no-app'>{l('No App')}</span>);
    } else if (onlineStatus) {
      return (<span className='online'>{l('Online')}</span>);
    } else {
      return (<span className='offline'>{l('Offline')}</span>);
    }
  }

  openAppInformationModal = (e) => {
    e.preventDefault();
    this._appInformationModalRef.current.showModal();
  };

  render () {
    const { l } = this.context.i18n;
    const { traveler, location } = this.props;

    let primaryEmail = traveler.emails && lodashFind(traveler.emails, { type: 'primary' })
      ? lodashFind(traveler.emails, { type: 'primary' })
      : (traveler.emails instanceof Array && traveler.emails.length > 0 ? traveler.emails[0] : null);
    let primaryPhone = traveler.phoneNumbers && lodashFind(traveler.phoneNumbers, { type: 'primary' })
      ? lodashFind(traveler.phoneNumbers, { type: 'primary' })
      : (traveler.phoneNumbers instanceof Array && traveler.phoneNumbers.length > 0
          ? traveler.phoneNumbers[0]
          : null
        );
    primaryEmail = primaryEmail && primaryEmail.email || '';
    primaryPhone = primaryPhone && primaryPhone.number || '';
    let emailHolder = (
      primaryEmail && primaryEmail.length > 25 ? <div className='tooltip'>
        <div>
          <span className='tooltip-label'>{primaryEmail}</span>
        </div>

        <div className='tooltip-text'>
          <span>{primaryEmail}</span>
        </div>
      </div> : <span title={primaryEmail}>{primaryEmail}</span>
    );

    let phoneHolder = (<span title={primaryPhone}>{<Mask mask={config.mask.phone}>{primaryPhone}</Mask>}</span>);

    const numbers = traveler.phoneNumbers ? filter(traveler.phoneNumbers, (t) => t.type !== 'primary') : [];
    if (numbers.length) {
      const phones = numbers.map((phone) => {
        return (
          <span key={phone.number}>
            <Mask mask={config.mask.phone}>{phone.number}</Mask>
          </span>
        );
      });
      phoneHolder = (
        <CollapseHolder style='fade' closeByOutsideClick='true'>
          <CollapseOpener>
            <span className='phone'>
              <Mask mask={config.mask.phone}>{primaryPhone}</Mask>
            </span>
            <span className='arrow' />
          </CollapseOpener>
          <CollapseBlock>
            {phones}
          </CollapseBlock>
        </CollapseHolder>
      );
    }

    const emails = traveler.emails ? filter(traveler.emails, (email) => email.type !== 'primary') : [];
    if (emails.length) {
      const emailsList = emails.map((email) => {
        return (
          <span title={email.email} key={email.email}>
            {email.email}
          </span>
        );
      });
      emailHolder = (
        <CollapseHolder style='fade' closeByOutsideClick='true'>
          <CollapseOpener>
            <span title={primaryEmail} className='email'>
              {primaryEmail}
            </span>
            <span className='arrow' />
          </CollapseOpener>
          <CollapseBlock>
            {emailsList}
          </CollapseBlock>
        </CollapseHolder>
      );
    }

    let editBtn;
    if (
      this.props.traveler._id &&
      this.props.traveler._id.$oid &&
      isAdmin(this.props.userRole) &&
      !isGlobalAdmin(this.props.userRole)
    ) {
      editBtn = (
        <EditBlock location={location} travelerId={this.props.traveler._id.$oid} />
      );
    }

    let orgName = (
      <div className='item organization'>
        <span title={traveler.organization.name}>{traveler.organization.name}</span>
      </div>
    );
    if (isCompanyAdminOrUser(this.props.userRole) && this.props.traveler.costCenter) {
      orgName = (
        <span className='item organization' title={traveler.costCenter.name}>
          {traveler.costCenter.name}
        </span>
      );
    }

    let appInfo;
    if (traveler.app_4site.settings) {
      appInfo = <AppInformationModal ref={this._appInformationModalRef} settings={traveler.app_4site.settings} />;
    }

    return (
      <div>
        <div className='head-row'>
          {this.blocked}
          {this.status}
          <h1><span title={`${traveler.firstName} ${traveler.lastName}`}
            className='user-name'>{traveler.firstName} {traveler.lastName}</span> {this.vip}</h1>
          {editBtn}
        </div>
        <div className='holder'>
          <div className='col'>
            {orgName}
            <div className='item phone'>{phoneHolder}</div>
          </div>
          <div className='col'>
            <div className='item email'>{emailHolder}</div>
            <div className='item status-holder'>
              <span className='online-status'>{this.onlineStatus}</span>
              {appInfo ? <a href='/' onClick={this.openAppInformationModal}>{l('More App Info')}</a> : null}
            </div>
          </div>
        </div>
        {appInfo}
      </div>
    );
  }
}
export default TravelerDetails;
