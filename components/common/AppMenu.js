/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import './settings.css';
import {Link, Redirect} from "react-router-dom";


// import TextExpandLess from '@material-ui/icons/ExpandLess';
// import TextExpandMore from '@material-ui/icons/ExpandMore';

// React runtime PropTypes
export const AppMenuItemPropTypes = {
  Name: PropTypes.string.isRequired,
  Text: PropTypes.string.isRequired,
  // img: PropTypes.object.isRequired,
  // Icon: PropTypes.elementType,
  items: PropTypes.array
};
const AppMenuItem = props => {
  const { Text, Name, items = [] } = props;
  const classes = useStyles();
  const isExpandable = items && items.length > 0;
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const MenuItemRoot = (
    <>
    <div className='activee' style={{ display: 'flex', height: '46px' }}>
       <ListItem className='list' button onClick={handleClick} style={{ width: '24px', margin: '14px', justifyContent: 'center', paddingTop: '0px' }} >
          {!!Text && (
           <ListItemText primary={Text} inset={!Name} className={classes.menuItem} >

           </ListItemText>
          )}
           {/* <ListItemText primary={Name} inset={!Text} className={classes.menuItem} /> */}
          </ListItem>
         {/* <ListItem button onClick={handleClick} style={{ marginBottom: '10px', height: '46px' }}>
         <ListItemText primary={Name} inset={!Text} className={classes.menuItem} />
       </ListItem> */}
       </div>
       </>
  );
  const MenuItemChildren = (!isExpandable) ? (
       <div>
       <Collapse in={open} timeout="auto" unmountOnExit >
         <List component="div" disablePadding>
           {items.map((item, index) => {
             console.log(item);
             const { onClick } = item;
             return (
               <Link to={item.link} style={{ textDecoration: 'none', color: 'white' }}>
             <div style={{ backgroundColor: '#1B355D' }} key={index} onClick={onClick}>
                <p>{item.Text}</p>
             </div>
               </Link>
             );
           })}
         </List>
        </Collapse>
        </div>
  ) : null;

  return (
       <div style= {{ justifyContent: 'none' }}>
         {MenuItemRoot}
         {MenuItemChildren}
       </div>
  );
};

AppMenuItem.propTypes = AppMenuItemPropTypes;

const useStyles = makeStyles(theme =>
  createStyles({
    menuItem: {
      height: '24px',
      width: '64px',
      color: 'FFFFFF',
      fontFamily: 'Open Sans',
      fontSize: '13px',
      fontWeight: 'bold',
      letterSpacing: '0',
      lineHeight: '24px',
      paddingRight: '20px',
      justifyContent: 'none'
    }
  })
);

export default AppMenuItem;
