import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import moment from 'moment';

import {Pie} from 'react-chartjs';

export default class TreesPerOrgType extends Component {

  constructor() {
    super();
    this.state = {
      chartData: [],
      amountOfTrees: [
        1, 1, 1, 1
      ],
      labels: [
        'PrivatPerson', 'Unternehmen', 'Non-Profit Organisationen', 'Schulen'
      ],
      options: {
        scaleShowGridLines: true,
        scaleOverride: true,
        scaleSteps: 6,
        scaleStepWidth: 5000,
        tooltipTemplate: '<%= value %>'
      }
    };
  }

  componentDidMount() {
    this.updateChartForYear();
    this.state.chartData.push({color: 'rgb(50, 171, 31)', label: this.state.labels[0], value: this.state.amountOfTrees[0]});
    this.state.chartData.push({color: 'rgb(70, 100, 31)', label: this.state.labels[1], value: this.state.amountOfTrees[1]});
    this.state.chartData.push({color: 'rgb(10, 50, 31)', label: this.state.labels[2], value: this.state.amountOfTrees[2]});
    this.state.chartData.push({color: 'rgb(130, 171, 100)', label: this.state.labels[3], value: this.state.amountOfTrees[3]});
    this.refs['barChart'].update();
  }

  updateChartForYear() {
    var that = this;
    axios.get('http://localhost:8081/statistic/treesPerOrgType').then(function(response) {
      var result = response.data;
      for (var year in result) {
        that.state.chartData[year].value = result[year].amount;
      }
      that.forceUpdate();
      that.refs['barChart'].update();
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });
  }

  render() {

    var that = this;
    return (
      <div className="row pie-chart">
        <div className="col-md-3">
          <ul className="pie-legend">
            <li>
              <span ></span>{this.state.labels[0]}</li>
            <li>
              <span ></span>{this.state.labels[1]}</li>
            <li>
              <span></span>{this.state.labels[2]}</li>
            <li>
              <span></span>{this.state.labels[3]}</li>
          </ul>
        </div>
        <div className="col-md-9">
          <Pie ref="barChart" data={this.state.chartData} options={this.state.options}/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
