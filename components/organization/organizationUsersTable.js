import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { isAdmin } from '../../helpers/user';
export default class OrganizationUsersTable extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    users: PropTypes.array.isRequired,
    sortBy: PropTypes.string.isRequired,
    organizationId: PropTypes.string,
    sortByDirect: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    setSorter: PropTypes.func.isRequired
  };

  get rows () {
    const { l } = this.context.i18n;
    const { organizationId } = this.props;
    const rows = this.props.users.map((user) => {
      const blockedStatus = user.status === 'blocked' ? (
        <span className='icon blocked'>{user.status}</span>
      ) : null;
      const editLink = organizationId ? `${organizationId}/users/edit/${user._id.$oid}`
        : `/users/edit/${user._id.$oid}`;
      return (
        <tr key={user._id.$oid}>
          <td>
            {blockedStatus}
            <div className='name'>
              <Link to={editLink}>
                {user.firstName} {user.lastName}
              </Link>
            </div>
          </td>
          <td>{user.userName}</td>
          <td>{isAdmin(user.roleName) ? l('Administrator') : l('User')}</td>
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
    if (!this.props.users.length && !this.props.loading) {
      return <div>{l('No users found')}</div>;
    }

    return (
      <table className='table inner-table user-table'>
        <thead>
          <tr>
            <th className={this.sortClass('firstName')} onClick={this.sortBy('firstName')}>
              <span>{l('User Name')}</span>
            </th>
            <th className={this.sortClass('userName')} onClick={this.sortBy('userName')}>
              <span>{l('Email')}</span>
            </th>
            <th className={this.sortClass('roleName')} onClick={this.sortBy('roleName')}>
              <span>{l('Role')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.rows}
        </tbody>
      </table>
    );
  }
}
