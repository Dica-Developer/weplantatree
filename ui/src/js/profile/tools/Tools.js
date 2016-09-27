import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import Boostrap from 'bootstrap';

import Overview from './Overview';

require("./tools.less");

export default class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'overview'
    };
  }

  switchTo(value){
    this.setState({view: value})
  }

  render() {
    var content;
    if(this.state.view == 'overview'){
      content = <Overview switchTo={this.switchTo.bind(this)}/>;
    }
    return (
      <div className="row tools">
        {content}
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
