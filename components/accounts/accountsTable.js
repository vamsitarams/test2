import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import find from 'lodash/find';
import { TYPE_AGENCY, isBlocked } from '../../helpers/organization';

export default class AccountsTable extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    accounts: PropTypes.array.isRequired,
    embedded: PropTypes.object.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortByDirect: PropTypes.bool.isRequired,
    setSorter: PropTypes.func.isRequired,
    canEditType: PropTypes.string
  };

  get rows () {
    const { l } = this.context.i18n;
    const { canEditType } = this.props;
    const rows = this.props.accounts.map((account) => {
      const accountId = account.type === TYPE_AGENCY ? account.cisAccountId : account.accountId;
      let associatedAgencyName = '';
      if (account.parentOrganizationId) {
        const agency = find(
          this.props.embedded.associatedAgencies,
          ['_id.$oid', account.parentOrganizationId.$oid]
        );
        associatedAgencyName = agency && agency.name ? agency.name : '';
      }

      const blockedStatus = (
        isBlocked(account)
          ? <span className='icon blocked'>{account.status}</span>
          : null
      );

      return (
        <tr key={account._id.$oid}>
          <td>
            {blockedStatus}
            <div className='name'>
              <Link to={`/accounts/${account._id.$oid}`}>
                {account.name}
              </Link>
            </div>
          </td>
          <td className='agency-id-col'>
            {
              accountId && accountId.length > 30 ? <div className='tooltip'>
                <div>
                  <span className='tooltip-label'>{accountId}</span>
                </div>

                <div className='tooltip-text'>
                  <span>{accountId}</span>
                </div>
              </div> : <span>{accountId}</span>
            }
          </td>
          <td>{account.type === TYPE_AGENCY ? l('Agency') : l('Company')}</td>
          <td>{associatedAgencyName}</td>
          {
            (
              canEditType
                ? <td>{(
                canEditType === account.type
                  ? <Link to={`/accounts/${account._id.$oid}/edit`} className='btn btn-default btn-edit'>
                    {l('Edit')}
                  </Link>
                  : ''
              )}</td>
                : ''
            )
          }
        </tr>
      );
    });
    return rows;
  }

  sortBy = (sortBy) => () => {
    return this.props.setSorter(sortBy);
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
    const { canEditType } = this.props;
    return (
      <table className='table inner-table'>
        <thead>
          <tr>
            <th className={this.sortClass('name')} onClick={this.sortBy('name')}>
              {l('Account Name')}
            </th>
            <th className={this.sortClass('accountId')} onClick={this.sortBy('accountId')}>
              {l('ID')}
            </th>
            <th>
              {l('Type')}
            </th>
            <th>
              {l('Associated Agency')}
            </th>
            {
              (canEditType ? <th>{l('Actions')}</th> : '')
            }
          </tr>
        </thead>
        <tbody>
          {this.rows}
        </tbody>
      </table>
    );
  }
}
