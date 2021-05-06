import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useHistory } from 'react-router';
import Header from '../../../../containers/Header/Header';
import HomeIcon from '../../../../components/common/svgIcon/HomeIcon';
import TravelerIcon from '../../../../components/common/svgIcon/TravelerIcon';
import FlightIcon from '../../../../components/common/svgIcon/FlightIcon';
import HealthIcon from '../../../../components/common/svgIcon/HealthIcon';
import WorldhubIcon from '../../../../components/common/svgIcon/WorldhubIcon';
import SettingIcon from '../../../../components/common/svgIcon/SettingIcon';
import logo from '../../../../styles/images/logo.png';
import Logout from '../../../../containers/Logout/Logout';
import UsersIcon from '../../../../components/common/svgIcon/UsersIcon';
import CompanyIcon from '../../../../components/common/svgIcon/CompanyIcon';
import FilterIcon from '../../../../components/common/svgIcon/FilterIcon';
import NotifIcon from '../../../../components/common/svgIcon/NotifIcon';
import TravelersIcon from '../../../../components/common/svgIcon/TravelersIcon';
import WorldWatchWhite from '../../../../styles/images/WorldWatchWhite.png';
import Pin from '../../../../styles/images/Pin.svg';
import Unpin from '../../../../styles/images/Unpin.svg';
import { Link, Redirect } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { fade } from '@material-ui/core/styles/colorManipulator';

import Collapse from "@material-ui/core/Collapse";
import { setSidebarOpen, setSidebarClose, pinSidebar, unpinSidebar } from '../../../../helpers/sidebarActions';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'none'
  },
  appMenu: {
    width: '100%',
    height: '843px'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 34
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    justifyContent: 'space-between',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    justifyContent: 'space-between',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    backgroundColor: '#154690',
    alignItems: 'center',
    justifyContent: 'center',

    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,

  },

  nested: {
    paddingLeft: '40px'
  },
  nestedclosed: {
    paddingLeft: '22px'
  },

  listopenpad: {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '22px',
  },
  listclosepad: {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '22px',
  },

  menuItem: {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '22px',
    color: 'white',
    fontSize: 14,
    '&:focus': {
      borderLeft: '5px solid',
      borderLeftColor: 'white',
      backgroundColor: '#006cba',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  },

  miniMenuItem: {
    color: 'white',
    margin: '10px 0',
    fontSize: 14,
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  },
  miniIcon: {
    margin: '0 auto',
    color: 'white',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.5)
    },
    minWidth: '24px'
  },
  bg1546: {
    backgroundColor: '#154690',
    color: 'white',
    borderRadius: '0px 0px 0px 14px',
  },
  colorWhite: { color: 'white' },
  iconMinWidth: { minWidth: '35px' },
  fw800: { fontWeight: 800 },
  activeMenu: {
    borderLeft: '5px solid',
    borderLeftColor: 'white',
    backgroundColor: '#006cba',
  }

}));

const SettingsTabs = (props) => {
  console.log(props, 'SettingsTabs');

  const classes = useStyles();
  const theme = useTheme();
  const open = props.sidebarState.isOpened || props.sidebarState.isSidebarPinned;
  const isSidebarPinned = props.sidebarState.isSidebarPinned;
  const [isPinned, setIsPinned] = React.useState(false);
  const [sastate, setsaState] = React.useState({});

  // const [activeItem, setActiveItem] = React.useState('Home');
  const history = useHistory();

  const itemjson = [
    {
      id: 1,
      name: 'Home',
      link: '/home',
      icon: <HomeIcon />,
      activeID: 1
    },
    {
      id: 2,
      name: 'Travelers',
      link: '/active-travelers',
      icon: <TravelerIcon />,
      activeID: 2
    },
    {
      id: 3,
      name: 'FlightBoard',
      link: '/flights-status',
      icon: <FlightIcon />,
      activeID: 3
    },
    {
      id: 4,
      name: 'Health',
      link: '/health',
      icon: <HealthIcon />,
      activeID: 4
    },
    {
      id: 5,
      name: 'Securities',
      link: '/travel-advisories',
      icon: <HomeIcon />,
      activeID: 5
    },
    {
      id: 6,
      name: 'WorldHub',
      link: '/worldhub',
      icon: <WorldhubIcon />,
      activeID: 6
    },
    {
      id: 7,
      name: 'Settings',
      icon: <SettingIcon />,
      subitems: [
        {
          id: 1,
          name: 'Companies',
          icon: <CompanyIcon style={{ paddingTop: '2px' }} />,
          link: '/companies',
          activeID: 7
        },
        {
          id: 2,
          name: 'Users',
          icon: <UsersIcon />,
          link: '/users',
          activeID: 8
        },
        {
          id: 3,
          name: 'Travelers',
          icon: <TravelersIcon />,
          link: '/travelers-list',
          activeID: 9
        },
        {
          id: 4,
          name: 'Fliters',
          icon: <FilterIcon />,
          link: '/settings/global-filter',
          activeID: 10
        },
        {
          id: 5,
          name: 'Notifications',
          icon: <NotifIcon />,
          link: '/settings/notifications',
          activeID: 11
        }
      ]
    },
    {
      id: 6,
      name: <Header />,
      icon: <Logout />,
      link: '',
      activeID: 12
    },

  ];

  const handleDrawerOpen = () => {
    props.setSidebarOpen();
    // setOpen(true);
  };

  const handleDrawerClose = () => {
    console.log("handleDrawerClose");

    // console.log(isPinned);
    if (!props.sidebarState.isSidebarPinned) {
      // setOpen(false);
      console.log("call setSidebarClose");
      props.setSidebarClose();
    }
    ;
  };
  const handlePinClosed = () => {
    // setIsPinned(false);
    props.unpinSidebar();
    handleDrawerClose();
    // this.setState({ isPinned: false }, () => { handleDrawerClose(); });
  };
  const handlePinOpen = () => {
    // setIsPinned(true);
    props.pinSidebar();
    handleDrawerOpen();
    // this.setState({ isPinned: true }, () => { handleDrawerOpen(); });
  };

  const handleClick = (name, id, nested) => {
    if (nested) {
      const target = Object.fromEntries(Object
        .entries(sastate)
        .map(([k, v]) => [k, v === "activeId" ? replace : id])
      );

      setsaState(target);
    }
    else {
      setsaState({ [name]: !sastate[name], "activeId": id });
    }
  };


  console.log(sastate);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
            [classes.bg1546]: true,
          },
          ),
        }}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <div>
          <div className={classes.toolbar}
            style={{
              paddingBottom: '20px',
              paddingTop: '35px'
            }}>
            {(!open)
              ? <img style={{
                backgroundColor: '#154690',
                marginRight: '2px',

              }} src={logo} alt="Worldwatch" width='40px' />
              : <img style={{ backgroundColor: '#154690' }} src={WorldWatchWhite} alt="Worldwatch" width='186.8px'
                height='34.05px ' />
            }
          </div>

          <Divider />
          <List>
            {itemjson.map(item => {
              return (
                <div key={item.id}>
                  {item.subitems != null ? (
                    <div key={item.id}>

                      <ListItem classes={{ root: classes.menuItem }}
                        button
                        key={item.id}
                        onClick={handleClick.bind(
                          this,
                          item.name
                        )}

                      >
                        <ListItemIcon className={clsx({
                          [classes.iconMinWidth]: open,

                        })}
                          style={{ color: 'white' }}> {item.icon} </ListItemIcon>

                        <ListItemText
                          primary={<span style={{ fontWeight: 'bold' }}>{item.name}</span>}
                        />

                      </ListItem>

                      <Collapse
                        key={itemjson.id}
                        component="li"
                        in={sastate[item.name]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List disablePadding style={{ backgroundColor: '#1B355D' }}>
                          {item.subitems.map(
                            sitem => {
                              return (
                                <Link key={sitem.id} to={sitem.link}>
                                  <ListItem classes={{ root: classes.menuItem }}
                                    button
                                    key={
                                      sitem.id
                                    }
                                    className={
                                      clsx({
                                        [classes.nested]: open,
                                        [classes.nestedclosed]: !open,
                                        [classes.activeMenu]: sitem.activeID === sastate['activeId'],
                                      })
                                    }
                                    onClick={handleClick.bind(
                                      this,
                                      sitem.name,
                                      sitem.activeID,
                                      true
                                    )}
                                  >
                                    <ListItemIcon className={clsx({
                                      [classes.iconMinWidth]: open,

                                    })}
                                      style={{ color: 'white' }}> {sitem.icon} </ListItemIcon>

                                    <ListItemText
                                      key={
                                        sitem.id
                                      }
                                      primary={
                                        <span style={{ fontWeight: 'bold' }}>{sitem.name}</span>
                                      }
                                      style={{ fontWeight: 900 }}
                                    />
                                  </ListItem>
                                </Link>

                              );
                            }
                          )}
                        </List>
                      </Collapse>{' '}
                    </div>
                  ) : (
                      <Link key={item.id} to={item.link}>
                        <ListItem classes={{ root: classes.menuItem }}
                          className={clsx({
                            [classes.listopenpad]: open,
                            [classes.listclosepad]: !open,
                            [classes.activeMenu]: item.activeID === sastate['activeId']

                          })}
                          button
                          onClick={handleClick.bind(
                            this,
                            item.name,
                            item.activeID,
                            false
                          )}
                          key={item.id}
                        >
                          <ListItemIcon className={clsx({
                            [classes.iconMinWidth]: open,

                          })}
                            style={{ color: 'white' }}> {item.icon} </ListItemIcon>
                          <ListItemText
                            primary={<span style={{ fontWeight: 'bold' }}>{item.name}</span>}
                            style={{ fontWeight: 900 }}
                          />
                        </ListItem>
                      </Link>
                    )}
                </div>
              );
            })}


          </List>
        </div>


        <div style={{
          backgroundColor: '#154690', color: 'white', borderRadius: '0px 0px 0px 14px', borderTop: '4px solid white', left: 0,
          width: '-webkit-fill-available',
        }}
          className={clsx({
            [classes.listopenpad]: open,
            [classes.listclosepad]: !open,
          })}
          tabIndex="-1"
        >
          {(!isSidebarPinned)
            ?
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img onClick={handlePinOpen} src={Pin} alt=''
                className={clsx(classes.menuButton, { [classes.hide]: isSidebarPinned })} />
              {open && <p style={{ padding: '20px 0px 0px 10px' }}>pin Menu</p>}
            </div>
            : <div style={{ display: 'flex', justifyContent: 'center' }}> <img onClick={handlePinClosed} src={Unpin} /> <p style={{ padding: '20px 0px 0px 10px' }}>Unpin Menu</p> </div>
          }

        </div>


      </Drawer>
      <main className={classes.content}>
        {props.children}
      </main>
    </div >
  );

};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    sidebarState: state.sidebar
  }
}

const mapDispatchToProps = dispatch => ({
  pinSidebar: bindActionCreators(pinSidebar, dispatch),
  unpinSidebar: bindActionCreators(unpinSidebar, dispatch),
  setSidebarOpen: bindActionCreators(setSidebarOpen, dispatch),
  setSidebarClose: bindActionCreators(setSidebarClose, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsTabs);