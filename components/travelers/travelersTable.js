import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { isAdmin, isCompanyAdminOrUser, isGlobalAdmin } from '../../helpers/user';
import HelpedBlock from '../../containers/Traveler/HelpedBlock';
import EditBlock from '../../containers/TravelerManager/editBlock';
import Mask from '../common/mask';
import config from '../../config';
import lodashFind from 'lodash/find';

export class TravelersTable extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    location: PropTypes.object.isRequired,
    travelers: PropTypes.array.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortByDirect: PropTypes.bool.isRequired,
    showOrganizationCol: PropTypes.bool.isRequired,
    travelersSorter: PropTypes.func.isRequired,
    userRole: PropTypes.string
  };

  get rows () {
    const { location, showOrganizationCol } = this.props;
    const rows = this.props.travelers.map((traveler) => {
      const vip = traveler.isVIP ? (<span className='vip'>VIP</span>) : '';
      const journeyStatus = traveler.status !== 'blocked' ? (
        <span className={`${traveler.currentJourneyStatus} icon`}>{traveler.currentJourneyStatus}</span>
      ) : null;
      const blockedStatus = traveler.status === 'blocked' ? (
        <span className='icon blocked'>{traveler.status}</span>
      ) : null;
      const phone = traveler.phoneNumbers && traveler.phoneNumbers.length ? traveler.phoneNumbers[0].number : '';

      const primaryEmail = traveler.emails && lodashFind(traveler.emails, { type: 'primary' })
        ? lodashFind(traveler.emails, { type: 'primary' })
        : (traveler.emails instanceof Array && traveler.emails.length > 0 ? traveler.emails[0] : null);

      const email = primaryEmail ? primaryEmail.email : null;
      let adminActionColTd;
      if (isAdmin(this.props.userRole) && !isGlobalAdmin(this.props.userRole)) {
        adminActionColTd = (
          <td>
            <EditBlock location={location} travelerId={traveler._id.$oid} />
          </td>
        );
      }
      const helpedBtn = traveler.status !== 'blocked' ? (
        <HelpedBlock helpedBy={traveler.helpedBy} travelerId={traveler._id.$oid} />
      ) : null;

      let orgName = traveler.organization.name;
      if (isCompanyAdminOrUser(this.props.userRole) && traveler.costCenter) {
        orgName = traveler.costCenter.name;
      }

      return (
        <tr key={traveler._id.$oid} className={traveler.status}>
          <td>
            {journeyStatus}
            {blockedStatus}
            <div className='traveler-info'>
              <div className='name'>
                <Link to={`/traveler/${traveler._id.$oid}`}>
                  {traveler.firstName} {traveler.lastName}
                </Link>
                {vip}
              </div>
            </div>
          </td>
          {showOrganizationCol ? <td>{orgName}</td> : null}
          <td>
            {
              email && email.length > 30 ? <div className='tooltip'>
                <div>
                  <span className='tooltip-label'>{email}</span>
                </div>

                <div className='tooltip-text'>
                  <span>{email}</span>
                </div>
              </div> : <span>{email}</span>
            }
          </td>
          <td><Mask mask={config.mask.phone}>{phone}</Mask></td>
          <td>
            {helpedBtn}
          </td>
          {adminActionColTd}
        </tr>
      );
    });
    return rows;
  }

  sortBy = (sortBy) => () => {
    return this.props.travelersSorter(sortBy);
  }

  sortClass (name) {
    let className = this.props.sortBy === name ? 'sortedBy' : '';
    if (className) {
      className = this.props.sortByDirect ? className : 'up ' + className;
    }
    return 'sortable ' + className;
  }

  render () {
    const { l } = this.context.i18n;
    const { showOrganizationCol } = this.props;

    let adminActionColTh;
    if (isAdmin(this.props.userRole) && !isGlobalAdmin(this.props.userRole)) {
      adminActionColTh = (
        <th>{l('Actions')}</th>
      );
    }

    let organizationColumn = (
      <th className={this.sortClass('organization.name')} onClick={this.sortBy('organization.name')}>
        <span className='travelers-table'>{l('Company')}</span>
      </th>
    );
    if (isCompanyAdminOrUser(this.props.userRole)) {
      organizationColumn = (
        <th className={this.sortClass('costCenter.name')} onClick={this.sortBy('costCenter.name')}>
          {l('Sort Level ID')}
        </th>
      );
    }

    return (
      <table className='table inner-table travelers-list-table user-table'>
        <thead>
          <tr style={{ width: '100%' }}>
            <th className={this.sortClass('firstName')} onClick={this.sortBy('firstName')}>
              <span className='travelers-table'>{l('Traveler')}</span>
            </th>
            {showOrganizationCol ? organizationColumn : null}
            <th className={this.sortClass('userName')} onClick={this.sortBy('userName')}>
              <span className='travelers-table'>{l('Email')}</span>
            </th>
            <th>
              <span>{l('Phone')}</span>
            </th>
            <th>
              <span>{l('Help Status')}</span>
            </th>
            {adminActionColTh}
          </tr>
        </thead>
        <tbody>
          {this.rows}
        </tbody>
      </table>
    );
  }
}
export default TravelersTable;
