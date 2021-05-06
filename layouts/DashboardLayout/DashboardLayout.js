import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import { Sidebar } from './components';



export default class DashboardLayout extends Component {
  constructor (props) {
    super(props);


  }


  render () {


    return (
      <div className="wrapper">

         <Sidebar>

        {this.props.children}

         </Sidebar>




      </div>
    );

  }

}





