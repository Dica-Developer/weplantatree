import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';
import {Link} from 'react-router';
import axios from 'axios';

import IconButton from '../../common/components/IconButton';

import PlantProposal from './PlantProposal';
import PlantCustom from './PlantCustom';

require('./projectPlanting.less');

export default class ProjectPlantingWithoutSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGift: false,
      isAbo: false,
      amount: 5
    };
  }

  updatePlantBag(price, projectItems, projectName) {
    this.props.updatePlantBag(price, projectItems, projectName);
  }

  setAmount(value) {
    this.setState({amount: value});
  }

  render() {
    var plantContent;
    if(this.state.amount != 'custom'){
      plantContent = <PlantProposal projectName={this.props.projectName} amount={this.state.amount} setAmount={this.setAmount.bind(this)} updatePlantBag={this.updatePlantBag.bind(this)}/>;
    }else{
      plantContent = <PlantCustom projectName={this.props.projectName} articles={this.props.articles} updatePlantBag={this.updatePlantBag.bind(this)} amount={this.state.amount} setAmount={this.setAmount.bind(this)}/>;
    }
    return (
      <div className=" projectPlanting">
        <h1>{this.props.projectName}&nbsp;/&nbsp;
          <i>hier pflanzen</i>
        </h1>
        {plantContent}
        <div className="bottom align-center">
          <IconButton text="ZURÜCK ZUR BESCHREIBUNG" glyphIcon="glyphicon-backward" onClick={this.props.showDetails.bind(this)}/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
