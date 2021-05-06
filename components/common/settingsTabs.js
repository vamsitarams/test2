//
// import React from 'react';
// // import './settings.css';
// // import PropTypes from 'prop-types';
// import clsx from 'clsx';
// import { makeStyles } from '@material-ui/core/styles';
// import Drawer from '@material-ui/core/Drawer';
// import AppBar from '@material-ui/core/AppBar';
// import List from '@material-ui/core/List';
// // import ListItem from '@material-ui/core/ListItem';
// // import ListItemName from '@material-ui/core/ListItemName';
// // import ListItemIcon from '@material-ui/core/ListItemIcon';
// import CssBaseline from '@material-ui/core/CssBaseline';
// // import Divider from '@material-ui/core/Divider';
// // import IconButton from '@material-ui/core/IconButton';
// // import MenuIcon from '@material-ui/icons/Menu';
// // import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// // import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// // import HomeIcon from './svgIcon/HomeIcon';
// // import HomeIcon from '@material-ui/icons/Home';
// // import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
// // import FlightIcon from '@material-ui/icons/Flight';
// // import FavoriteIcon from '@material-ui/icons/Favorite';
// // import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
// // import DeviceHubIcon from '@material-ui/icons/DeviceHub';
// // import SettingsIcon from '@material-ui/icons/Settings';
// import { useHistory } from 'react-router';
// import AppMenu from './AppMenu';
// import AppMenuu from './AppMenuu';
// import Header from '../../containers/Header/Header';
// // import Worldwatch from '../../styles/images/Worldwatch.png';
// import HomeIcon from './svgIcon/HomeIcon';
// import TravelerIcon from './svgIcon/TravelerIcon';
// import FlightIcon from './svgIcon/FlightIcon';
// import HealthIcon from './svgIcon/HealthIcon';
// import WorldhubIcon from './svgIcon/WorldhubIcon';
// import SettingIcon from './svgIcon/SettingIcon';
// import logo from '../../styles/images/logo.png';
// import Logout from '../../containers/Logout/Logout';
// import UsersIcon from './svgIcon/UsersIcon';
// import CompanyIcon from './svgIcon/CompanyIcon';
// import FilterIcon from './svgIcon/FilterIcon';
// import NotifIcon from './svgIcon/NotifIcon';
// import TravelersIcon from './svgIcon/TravelersIcon';
// import WorldWatchWhite from '../../styles/images/WorldWatchWhite.png';
// // import PinIcon from './svgIcon/PinIcon';
// import Pin from '../../styles/images/Pin.svg';
// import Unpin from '../../styles/images/Unpin.svg';
// // import Worlwatch from './svgIcon/Worlwatch';
//
// // import { Home } from '../../styles/images/Home.svg';
// // import LogoutIndex from '../header/LogoutIndex';
// // import Logout from '../../containers/Header/Logout';
//
// const drawerWidth = 233;
//
// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     justifyContent: 'none'
//   },
//   appMenu: {
//     width: '100%',
//     height: '843px'
//   },
//   appBar: {
//     zIndex: theme.zIndex.drawer + 1,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen
//     })
//   },
//   appBarShift: {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen
//     })
//   },
//   menuButton: {
//     marginRight: 34
//   },
//   hide: {
//     display: 'none'
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//     whiteSpace: 'nowrap'
//   },
//   drawerOpen: {
//     width: drawerWidth,
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen
//     })
//   },
//   drawerClose: {
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen
//     }),
//     overflowX: 'hidden',
//     width: theme.spacing(7) + 1,
//     [theme.breakpoints.up('sm')]: {
//       width: theme.spacing(9) + 1
//     }
//   },
//   toolbar: {
//     display: 'flex',
//     // width: '70px',
//     backgroundColor: '#154690',
//     // height: '843px',
//     alignItems: 'center',
//     justifyContent: 'center',
//     // padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3)
//   }
// }));
//
// const SettingsTabs = () => {
//   const classes = useStyles();
//   // const theme = useTheme();
//   const [open, setOpen] = React.useState(false);
//   const [isPinned, setIsPinned] = React.useState(false);
//   // const [activeItem, setActiveItem] = React.useState('Home');
//   const history = useHistory();
//   const itemList = [
//     {
//       Name: 'Home',
//       Text: <HomeIcon/>,
//       onClick: () => history.push('/home')
//
//     },
//     {
//       Name: 'Travelers',
//       Text: <TravelerIcon/>,
//       onClick: () => history.push('/active-travelers')
//
//     },
//     {
//       Name: 'FlightBoard',
//       Text: <FlightIcon/>,
//       onClick: () => history.push('/flights-status')
//
//     },
//     {
//       Name: 'Health',
//       Text: <HealthIcon/>,
//       onClick: () => history.push('/health')
//
//     },
//     {
//       Name: 'Security',
//       Text: <HomeIcon/>,
//       onClick: () => history.push('/travel-advisories')
//
//     },
//     {
//       Name: 'WorldHub',
//       Text: <WorldhubIcon/>,
//       onClick: () => history.push('/worldhub')
//
//     },
//     {
//       Name: 'Settings',
//       Text: <SettingIcon/>,
//       items: [
//         {
//           Name: 'Companies',
//           Text: <CompanyIcon style={{ paddingTop: '2px' }}/>,
//           onClick: () => history.push('/companies')
//         },
//         {
//           Name: 'Users',
//           Text: <UsersIcon/>,
//           onClick: () => history.push('/users')
//         },
//         {
//           Name: 'Travelers',
//           Text: <TravelersIcon/>,
//           onClick: () => history.push('/travelers-list')
//         },
//         {
//           Name: 'Fliters',
//           Text: <FilterIcon/>,
//           onClick: () => history.push('/settings/global-filter')
//         },
//         {
//           Name: 'Notifications',
//           Text: <NotifIcon/>,
//           onClick: () => history.push('/settings/notifications')
//         }
//       ]
//     },
//     {
//       Text: <Logout/>,
//       Name: <Header/>
//     }
//   ];
//
//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };
//
//   const handleDrawerClose = () => {
//     // console.log(isPinned);
//     if (!isPinned) {
//       setOpen(false);
//     };
//   };
//   const handlePinClosed = () => {
//     setIsPinned(false);
//     handleDrawerClose();
//     // this.setState({ isPinned: false }, () => { handleDrawerClose(); });
//   };
//   const handlePinOpen = () => {
//     setIsPinned(true);
//     handleDrawerOpen();
//     // this.setState({ isPinned: true }, () => { handleDrawerOpen(); });
//   };
//
//   return (
//     <div className={classes.root} >
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         className={clsx(classes.appBar, {
//           [classes.appBarShift]: open
//         })}
//       >
//       </AppBar>
//       <Drawer
//         variant="permanent"
//         className={clsx(classes.drawer, {
//           [classes.drawerOpen]: open,
//           [classes.drawerClose]: !open
//         })}
//         classes={{
//           paper: clsx({
//             [classes.drawerOpen]: open,
//             [classes.drawerClose]: !open
//           })
//         }}
//       >
//         <div style= {{ borderRadius: '14px 0px 0px 0px' }} onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose} className={classes.toolbar}>
//           {(!open)
//             ? <img style={{ backgroundColor: '#154690', marginRight: '2px' }} src={logo} alt="Worldwatch" width= '40px' />
//             : <img style={{ backgroundColor: '#154690' }} src={WorldWatchWhite} alt="Worldwatch" width= '186.8px' height='34.05px '/>
//             }
//         </div>
//         <List className={classes.appMenu} style={{ backgroundColor: '#154690', color: 'white' }}>
//           {itemList.map((item, index) => {
//             // console.log(item);
//             const { onClick } = item;
//             return (
//               <div button key={index} onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose} onClick={ onClick}>
//                 {(!open)
//                   ? <AppMenu {...item}/>
//                   : <AppMenuu {...item}/>
//                 }
//                 {/* <AppMenuu {...item}/> */}
//             </div>
//             );
//           })}
// //         </List>
// //         {/* <Divider/> */}
//         <div style={{ backgroundColor: '#154690', color: 'white', borderRadius: '0px 0px 0px 14px' }}>
//           {(!open)
//             ? <img onClick={handlePinOpen} src={Pin} alt='' style={{ paddingLeft: '17px' }}
//             className={clsx(classes.menuButton, { [classes.hide]: open })} />
//             : <div style={{ display: 'flex', justifyContent: 'center' }}> <img onClick={handlePinClosed} src={Unpin}/> <p style={{ padding: '20px 0px 0px 10px' }}>Unpin Menu</p> </div>
//           }
//             {/* <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handlePinOpen}
//             edge="start"
//             className={clsx(classes.menuButton, {
//               [classes.hide]: open
//             })}
//           >
//             <MenuIcon />
//           </IconButton> */}
//            {/* <IconButton
//             color="inherit">
//             {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon
//             onClick={handlePinClosed}/>}
//           </IconButton> */}
//         </div>
// //       </Drawer>
//     </div>
//   );
// };
// export default SettingsTabs;
