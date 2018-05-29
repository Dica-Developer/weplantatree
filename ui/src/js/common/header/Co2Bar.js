import React, {Component} from 'react';
import axios from 'axios';
import Accounting from 'accounting';

export default class Co2Bar extends Component {

  constructor() {
    super();
    this.state = {
      co2: 0.0,
      treesCount: 0
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8081/reports/co2').then(function(co2) {
      that.setState(co2.data);
    });
  }

  render() {
    return (
      <div>
        <div className="tree-chars">gepflanzte Bäume</div>
        <div className="tree-number">{this.state.treesCount.toLocaleString()}</div>
        <br/>
        <div className="co2-chars">CO<sub>2</sub> gebunden / Tonnen</div>
        <div className="co2-number">{Accounting.formatNumber(this.state.co2, 0, '.', ',')}</div>
      </div>
    );
  }
}
