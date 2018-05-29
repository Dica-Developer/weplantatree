import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';

export default class MainSlider extends Component {

  constructor() {
    super();
    this.state = {
      value: 5,
      price: 0
    };
  }

  updateMainSlider(event) {
    this.setState({value: event.target.value});
    this.balanceProjectSliders(event.target.value);
  }

  balanceProjectSliders(value) {
    this.props.balanceProjectSliders(value);
  }

  setMainSliderValue(value) {
    this.state.value = value;
    this.forceUpdate();
  }

  setOverallPrice(value){
    this.state.price = value;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="mainSlider">
        <div className="desc">
          PREIS&nbsp;/&nbsp;STÜCKZAHL&nbsp;<span className="bold">GESAMT</span>
        </div>
        <div className="sliderDiv">
          <input type="range" min="1" max="100" step="1" value={this.state.value} onChange={this.updateMainSlider.bind(this)}/>
        </div>
        <div className="sliderSummary">
          <div className="priceValue">
              {Accounting.formatNumber(this.state.price / 100, 2, '.', ',')}&nbsp;€
          </div>
          <div className="treeValue">
            {this.state.value}&nbsp;<span className="glyphicon glyphicon-tree-deciduous" aria-hidden="true"/>
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
