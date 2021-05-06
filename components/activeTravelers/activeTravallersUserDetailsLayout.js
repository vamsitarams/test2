import PropTypes from 'prop-types';
import React from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Cross from '../../styles/images/Icon_ Cancellation.png';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import config from '../../config/index';
import { connect } from 'react-redux';

import Timeline from '../../containers/Traveler/Timeline';
import Reservations from '../../containers/Traveler/Reservations';
import Maps from '../../containers/Traveler/Maps';
import FlightStatus from '../../containers/Traveler/FlightStatus';
import TravelAdvisory from '../../containers/Traveler/TravelAdvisory';
import CaseHistory from '../../containers/Traveler/CaseHistory';

import {
  actions as travelerActions,
  stateTraveler,
  stateTravelAdvisoryLevel
} from '../../redux/modules/travelerDetails';
import { actions as timelineActions } from '../../redux/modules/timeline';
import { actions as reservationsActions } from '../../redux/modules/reservations';
import { actions as pusherActions } from '../../redux/modules/pusher';
import { stateAppSettingsConstants, stateAppSettingsDimensions } from '../../redux/modules/appSettings';
import { stateUserRole } from '../../redux/modules/user';
import TravelerView from '../../views/TravelerView/TravelerView';
import { withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1rem'
  },

  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '0.4px',
    lineHeight: '16px'
  },

  tabs:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }

});
const mapStateToProps = createSelector(
  stateTraveler,
  stateAppSettingsConstants,
  stateAppSettingsDimensions,
  stateUserRole,
  stateTravelAdvisoryLevel,
  (traveler, appSettingsConstants, appSettingsDimensions, userRole, advisoryLevel) => {
    appSettingsConstants = appSettingsConstants || {};
    return {
      traveler,
      appSettingsConstants,
      appSettingsDimensions,
      userRole,
      advisoryLevel
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(travelerActions, dispatch),
    ...bindActionCreators(pusherActions, dispatch),
    ...bindActionCreators(reservationsActions, dispatch),
    ...bindActionCreators(timelineActions, dispatch)
  };
};



function UserLayoutComponent (props) {

  const tabActive = {
    '/traveler/:id':0,
    '/traveler/:id/reservations':1
    };


  const classes = useStyles();
  const [value, setValue] = React.useState(tabActive[props.match.path]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return <>
    <div style={{ width: '100%' }}>
      <div className={classes.header}>
        <div>
          <span><img src={Cross} style={{
            width: '24px',
            height: '24px',
            marginRight: '8px'
          }}/>

          </span>

          <span className={classes.userName}>Robert California  ({props.match.params.id})</span>
          <div style={{paddingLeft:'30px',fontSize:'16px'}}>Management</div>



        </div>
        <div>
          Details
        </div>
        <div>
          X
        </div>
      </div>

      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          variant="fullWidth"
        >
          <Link to={'/traveler/'+props.uid}><Tab label="Timeline" /></Link>
          <Link to={'/traveler/'+props.uid+'/reservations'} ><Tab label="Reservations"/></Link>
          <Tab label="Maps" />
          <Tab label="Flight Status" />
          <Tab label="Travel Advisors" />
          <Tab label="Contact" />
        </Tabs>
      </Paper>

      <Route exact path='/traveler/:id' render={(props) => <Timeline />} />
      <Route path='/traveler/:id/reservations' render={(props) => <Reservations {...props} />} />

    </div>

  </>;
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserLayoutComponent));

