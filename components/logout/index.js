import PropTypes from 'prop-types';
import React from 'react';
// import SearchBar from '../../containers/Header/SearchBar';
// import UserActions from '../../components/header/userActions';
import Logout from './Logout';
// import Logout from './Logout';
// import Messages from '../../containers/Common/Messages';
// import MainMenu from '../../containers/Common/MainMenu';
// import SettingsDropdown from '../../containers/Header/SettingsDropdown';
// import config from '../../config';

export class Header extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    logInUser: PropTypes.func.isRequired,
    logOutUser: PropTypes.func.isRequired
  };

  render () {
    // const { user } = this.props;
    // const { l } = this.context.i18n;
    return (
      <header className='header'>
        <div className='col'>
          {/* {user.worldHubUrl && (
            <a href={user.worldHubUrl} className='logo' rel='noopener noreferrer' target='_blank'>{l('Dashboard')}</a>
          )}
          {!user.worldHubUrl && (
            <a href={config.links.worldHubAbout} className='logo' rel='noopener noreferrer' target='_blank'>
              {l('Dashboard')}</a>
          )}
          <div className='header-main-menu'>
            <MainMenu />
          </div>
          <SearchBar />
          <Messages /> */}
        </div>
        <div className='col user-holder'>
          {/* <SettingsDropdown /> */}
          {/* <UserActions {...this.props} /> */}
          <Logout {...this.props}/>
        </div>
      </header>
    );
  }
}
export default Header;
