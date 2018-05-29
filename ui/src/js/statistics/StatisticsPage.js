import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import moment from 'moment';

import {Bar, Line} from 'react-chartjs';

import TreesPerMonth from './TreesPerMonth';
import TreesPerYear from './TreesPerYear';
import TreesPerOrgType from './TreesPerOrgType';
import Co2PerYear from './Co2PerYear';

require('./statisticsPage.less');

export default class StatisticsPage extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="container paddingTopBottom15">
        <div className="statisticsPage">
          <div className="row">
            <div className="col-md-12">
              <h1>Statistiken</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h2>Gepflanzte Bäume</h2>
            </div>
          </div>
          <TreesPerYear/>
          <div className="row">
            <div className="col-md-12">
              <h2>Gebundenes CO<sub>2</sub></h2>
            </div>
          </div>
          <Co2PerYear/>
          <div className="row">
            <div className="col-md-12">
              <h2>Gepflanzte Bäume pro Spendertyp</h2>
            </div>
          </div>
          <TreesPerOrgType/>
            <div className="row">
              <div className="col-md-12">
                <h2>Gepflanzte Bäume pro Monat</h2>
              </div>
            </div>
          <TreesPerMonth/>

        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
