import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


export default function SimpleTabs () {
  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square>
      <Tabs
        value={value}
        className='threetabs'
        // indicatorColor="primary"
        // textColor="primary"
        onChange={handleChange}
      >
        <Tab label="Locations" />
        <Tab label="Airports"/>
        <Tab label="Flights"/>
      </Tabs>
    </Paper>
  );
}
