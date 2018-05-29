import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import Boostrap from 'bootstrap';

import Overview from './Overview';
import Certificates from './Certificates';
import Receipts from './Receipts';
import Banner from './Banner';
import Widgets from './Widgets';

require('./tools.less');

export default class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'overview'
    };
  }

  switchTo(value) {
    this.setState({view: value});
  }

  render() {
    var content;
    switch (this.state.view) {
      case 'overview':
        content = <Overview switchTo={this.switchTo.bind(this)}/>;
        break;
      case 'certificates':
        content = <Certificates view={this.state.view} switchTo={this.switchTo.bind(this)}/>;
        break;
      case 'receipts':
        content = <Receipts view={this.state.view} switchTo={this.switchTo.bind(this)}/>;
        break;
      case 'banner':
        content = <Banner view={this.state.view} switchTo={this.switchTo.bind(this)}/>;
        break;
      case 'widgets':
        content = <Widgets view={this.state.view} switchTo={this.switchTo.bind(this)}/>;
        break;
      default:
        break;
    }

    return (
      <div className="row tools">
        {content}
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
