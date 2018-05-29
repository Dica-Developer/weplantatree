import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';

import DoPlanting from './DoPlanting';
import PlantingDone from './PlantingDone';

require('./selfPlant.less');

export default class SelfPlantPage extends Component {

  constructor() {
    super();
    this.state = {
      plantingDone: false
    };
  }

  setPlantingDone(value){
    this.setState({plantingDone: value});
  }

  render() {
    var content;
    if(this.state.plantingDone){
      content = <PlantingDone setPlantingDone={this.setPlantingDone.bind(this)}/>;
    }else{
      content = <DoPlanting setPlantingDone={this.setPlantingDone.bind(this)}/>;
    };
    return (
      <div className="container paddingTopBottom15 selfPlant">
        {content}
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
