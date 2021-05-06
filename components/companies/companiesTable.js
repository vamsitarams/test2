import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { TYPE_COMPANY, isBlocked } from '../../helpers/organization';

export default class CompaniesTable extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    companies: PropTypes.array.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortByDirect: PropTypes.bool.isRequired,
    setSorter: PropTypes.func.isRequired,
    canEditType: PropTypes.string
  };

  get rows () {
    const { l } = this.context.i18n;
    const { canEditType } = this.props;
    const rows = this.props.companies.map((company) => {
      const blockedStatus = (
        isBlocked(company)
          ? <span className='icon blocked'>{company.status}</span>
          : null
      );
      return (
        <tr key={company._id.$oid}>
          <td>
            {blockedStatus}
            <div className='name'>
              <Link to={`/companies/${company._id.$oid}`}>
                {company.name}
              </Link>
            </div>
          </td>
          <td className='company-id-col'>
            {company.accountId && company.accountId.length > 30 ? <div className='tooltip'>
              <div>
                <span className='tooltip-label'>{company.accountId}</span>
              </div>

              <div className='tooltip-text'>
                <span>{company.accountId}</span>
              </div>
            </div> : <span>{company.accountId}</span>}
          </td>
          {
            (
              canEditType
                ? <td>{(
                canEditType === company.type
                  ? <Link to={`/companies/${company._id.$oid}/edit`} className='btn btn-default btn-edit'>
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
    const table = (
      <table className='table inner-table user-table'>
        <thead>
          <tr>
            <th className={this.sortClass('name')} onClick={this.sortBy('name')}>
              <span>{l('Company Name')}</span>
            </th>
            <th width='186' className={this.sortClass('accountId')} onClick={this.sortBy('accountId')}>
              <span>{l('ID')}</span>
            </th>
            {
              (canEditType && canEditType === TYPE_COMPANY ? <th width='100'>{l('Actions')}</th> : '')
            }
          </tr>
        </thead>
        <tbody>
          {this.rows}
        </tbody>
      </table>
    );

    return this.props.companies.length ? table : <span>{l('No results found')}</span>;
  }
}
