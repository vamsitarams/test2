import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';
import config from '../../config/index';
import { isAdmin, isGlobalAdmin, isTravelAgencyAdmin, isCompanyAdmin } from '../../helpers/user';

import GlobalAdminLayout from '../../routes/layouts/GlobalAdminLayout';
import TravelAgencyAdminLayout from '../../routes/layouts/TravelAgencyAdminLayout';
import CompanyAdminLayout from '../../routes/layouts/CompanyAdminLayout';
import UsersView from '../../views/UsersView/UsersView';

import GlobalFilter from '../../containers/Settings/GlobalFilter';
import NotificationSettings from '../../containers/Settings/NotificationSettings';

import LoadingIcon from '../../components/common/loadingIcon';

import { stateAppSettingsDimensions } from '../../redux/modules/appSettings';

const mapStateToProps = createSelector(
  stateAppSettingsDimensions,
  (appSettingsDimensions) => ({
    appSettingsDimensions
  })
);

const mapDispatchToProps = (dispatch) => {
  return {};
};

// TODO: know if we are loading?
// TODO: get the user
class SettingsContainerView extends React.Component {
    static propTypes = {
      appSettingsDimensions: PropTypes.object.isRequired,
      user: PropTypes.object,
      loading: PropTypes.bool
    };

    render () {
      const { user, loading } = this.props;
      const containerStyle = {
        height: this.props.appSettingsDimensions.height - config.layout.headerHeight
      };

      return (
        <div className='page-content-without-top-whitespace settings-container'>
            <LoadingIcon loading={loading} />
            <section style={containerStyle} className='settings-body'>
                <Route path='/settings/global-filter' component={GlobalFilter} />
                <Route path='/settings/notifications' component={NotificationSettings} />

                {isAdmin(user.roleName) && (<Route exact path='/users' component={UsersView} />)}
                {isCompanyAdmin(user.roleName) && (<Route component={CompanyAdminLayout} />)}
                {isTravelAgencyAdmin(user.roleName) && (<Route component={TravelAgencyAdminLayout} />)}
                {isGlobalAdmin(user.roleName) && (<Route component={GlobalAdminLayout} />)}
            </section>
        </div>
      );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsContainerView));
