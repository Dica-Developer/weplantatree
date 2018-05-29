import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';

require('./loadingItem.less');


export default class LoadingItem extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="loadingItem">
        <h1>Daten werden geladen...</h1>
        <div>
          <span className="glyphicon glyphicon-refresh spinning"></span>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
