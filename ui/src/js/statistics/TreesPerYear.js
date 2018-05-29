import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import moment from 'moment';

import {
  Bar,
  Line
} from 'react-chartjs';

export default class TreesPerYear extends Component {

  constructor() {
    super();
    this.state = {
      amountOfTrees: [],
      amountOfTreesSummed: [],
      labels: [],
      year: new Date().getFullYear(),
      years: [],
      options: {
        scaleShowGridLines: true,
        scaleOverride: true,
        scaleSteps: 3,
        scaleStepWidth: 10000,
        responsive: true,
        barValueSpacing : 3,
        tooltipTemplate: '<%= value %>'
      },
      options2: {
        scaleLineColor: 'rgb(130, 171, 31)',
        scaleShowGridLines: true,
        scaleOverride: true,
        scaleSteps: 4,
        scaleStepWidth: 50000,
        pointDotRadius: 2,
        datasetFill: false,
        responsive: true,
        tooltipTemplate: '<%= value %>'
      }

    };
  }

  componentDidMount() {
    this.getAllYearFrom2007();
    this.updateChartForYear();
    for(var year in this.state.labels){
      console.log(this.state.labels[year]);
    }
  }

  updateChartForYear() {
    var that = this;
    axios.get('http://localhost:8081/statistic/treesPerYear').then(function(response) {
      var result = response.data;
      for (var year in result) {
        that.state.amountOfTrees[year] = result[year].amount;
      }
      that.forceUpdate();
      that.state.amountOfTreesSummed[0] = that.state.amountOfTrees[0];
      for (var year = 1; year < that.state.amountOfTrees.length; year++) {
        that.state.amountOfTreesSummed[year] = that.state.amountOfTreesSummed[year - 1] + that.state.amountOfTrees[year];
      }
      that.forceUpdate();
      that.refs['barChart'].update();
      that.refs['barChart2'].update();
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

  getAllYearFrom2007() {
    var amountOfYearsTill2007 = moment().diff('2007-01-01', 'years') + 1;
    for (var year = 0; year < amountOfYearsTill2007; year++) {
      this.state.labels.push(2007 + parseInt(year));
      this.state.amountOfTrees.push(0);
      this.state.amountOfTreesSummed.push(0);
    }
  }

  render() {
    var chartData = {
      labels: this.state.labels,
      datasets: [{
        label: 'gepflanzte Bäume',
        data: this.state.amountOfTrees,
        fillColor: 'rgb(130, 171, 31)',
        borderWidth: 1
      }]
    };
    var chartData2 = {
      labels: this.state.labels,
      datasets: [{
        label: 'gepflanzte Bäume',
        data: this.state.amountOfTreesSummed,
        fillColor: 'rgb(130, 171, 31)',
        borderWidth: 1
      }]
    };
    var that = this;
    return (
      <div className="row tree-chart">
        <div className="col-md-6">
          <Bar ref="barChart" data={chartData} options={this.state.options}/>
        </div>
        <div className="col-md-6">
          <Line ref="barChart2" data={chartData2} options={this.state.options2}/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
