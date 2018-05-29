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
  Line
} from 'react-chartjs';

export default class Co2PerYear extends Component {

  constructor() {
    super();
    this.state = {
      amountOfCo2: [],
      labels: [],
      year: new Date().getFullYear(),
      years: [],
      options: {
        scaleLineColor: 'rgb(81, 168, 190)',
        scaleShowGridLines: true,
        scaleOverride: true,
        scaleSteps: 4,
        scaleStepWidth: 5000,
        datasetFill: false,
        responsive: true,
        tooltipTemplate: '<%= value %>'
      }
    };
  }

  componentDidMount() {
    this.updateChartForYear();
    this.getAllYearFrom2007();
  }

  updateChartForYear() {
    var that = this;
    axios.get('http://localhost:8081/statistic/co2').then(function(response) {
      var result = response.data;
      for (var year in result) {
      //  console.log("value for " + year + ": " + result[year].co2);
        that.state.amountOfCo2[year] = parseFloat(result[year].co2);
        that.forceUpdate();
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

  getAllYearFrom2007() {
    var amountOfYearsTill2007 = moment().diff('2007-01-01', 'years') + 1;
    for (var year = 0; year < amountOfYearsTill2007; year++) {
      this.state.years.push(2007 + parseInt(year));
      this.state.labels.push(2007 + parseInt(year));
      this.state.amountOfCo2.push(0);
    }
  }

  updateYear(event) {
    this.state.year = event.target.value;
    this.forceUpdate();
    this.updateChartForYear();
  }

  render() {
    var chartData = {
      labels: this.state.labels,
      datasets: [{
        label: 'gepflanzte Bäume',
        data: this.state.amountOfCo2,
        fillColor: 'rgb(81, 168, 190)',
        borderWidth: 1
      }]
    };
    var that = this;
    return (
      <div className="row tree-chart">
        <div className="col-md-3" />
        <div className="col-md-6">
          <Line ref="barChart" data={chartData} options={this.state.options}/>
        </div>
        <div className="col-md-3" />
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
