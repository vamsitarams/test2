import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';
import LogoutIcon from '../common/svgIcon/LogoutIcon';
// import HomeIcon from '@material-ui/icons/Home';/

// import StatusDropdown from '../../containers/Header/StatusDropdown';

export default class Logout extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    logOutUser: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render () {
    // const { l } = this.context.i18n;
    // const { user } = this.props;

    return (
      <div className='user-actions'>
        {/* <div className='cols'> */}
        <LogoutIcon onClick={this.props.logOutUser}></LogoutIcon>
        {/* </div> */}
        <div>
        {/* <span>{user.firstName} {user.lastName}</span> */}
        </div>
      </div>
    );
  }
}
