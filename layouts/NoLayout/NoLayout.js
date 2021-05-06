import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";




export default class DashboardLayout extends Component {
  constructor (props) {
    super(props);


  }


  render () {


    return (
      <div className="wrapper">



          {this.props.children}






      </div>
    );

  }

}


