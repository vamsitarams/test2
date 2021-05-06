import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { TYPE_AGENCY } from '../../helpers/organization';

import {
  actions as accountsListActions,
  stateAccountsFilter
} from '../../redux/modules/accountsList';

const mapStateToProps = createSelector(
  stateAccountsFilter,
  (accountsFilter) => {
    return {
      accountsFilter
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(accountsListActions, dispatch)
  };
};

export class OrganizationDetails extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object,
    router: PropTypes.object
  };

  static propTypes = {
    agencyAdmin: PropTypes.bool,
    organization: PropTypes.shape({
      accountId: PropTypes.string,
      cisAccountId: PropTypes.string,
      parents: PropTypes.any,
      children: PropTypes.array,
      type: PropTypes.string,
      _id: PropTypes.shape({
        $oid: PropTypes.string
      })
    }),
    clearAccountsFilter: PropTypes.func.isRequired
  };

  onAssociatedCompaniesClick = (id) => (e) => {
    e.preventDefault();
    this.props.clearAccountsFilter();
    this.context.router.replace('/?agency=' + id);
  };

  render () {
    const { l } = this.context.i18n;
    const { organization: { type, accountId, cisAccountId, parents, children, _id }, agencyAdmin } = this.props;
    const idTitle = type === TYPE_AGENCY ? l('Agency ID') : l('Company ID');
    let additionalInfo;
    if (type === TYPE_AGENCY) {
      additionalInfo = (
        <a href='' onClick={this.onAssociatedCompaniesClick(_id.$oid)}>
          {l('Associated Companies')} ({children.length})
        </a>
      );
    } else if (parents && parents.length && agencyAdmin) {
      additionalInfo = (
        <div>
          {l('Associated Agency')}: <Link to={'/accounts/' + parents[0]._id.$oid}>{parents[0].name}</Link>
        </div>
      );
    }
    return (
      <ul className='organization-details'>
        <li>{idTitle}: {type === TYPE_AGENCY ? cisAccountId : accountId}</li>
        <li>{additionalInfo}</li>
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetails);
