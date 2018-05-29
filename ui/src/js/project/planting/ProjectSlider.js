import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';

export default class ProjectSlider extends Component {
  constructor(props) {
    super(props);
    this.state = ({maxSliderValue: 100, sliderValue: 5});
  }

  updateSliderValue(event) {
    this.state.sliderValue = event.target.value;
    this.forceUpdate();
    this.props.balanceArticleSliders(event.target.value);
  }

  render() {
    return (
      <div className="projectSlider">
        <div>
          PREIS&nbsp;/&nbsp;STÜCKZAHL&nbsp;<span className="bold">
            GESAMT</span>
        </div>
        <div className="slider">
          <input type="range" min="1" max={this.state.maxSliderValue} step="1" value={this.state.sliderValue} onChange={this.updateSliderValue.bind(this)}/>
        </div>
        <div className="sliderSummary">
          <span className="overallPrice">{Accounting.formatNumber(this.props.price / 100, 2, '.', ',')}&nbsp;€</span><br/>
          <span className="green">{Accounting.formatNumber(this.state.sliderValue, 0, '.', ',')}</span>
          <span className="glyphicon glyphicon-tree-deciduous" aria-hidden="true"></span>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
