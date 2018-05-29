import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';
import axios from 'axios';

import ButtonBar from './ButtonBar';
import BottomPart from '../../planting/BottomPart';
import PlantItem from './PlantItem';

export default class PlantProposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trees: {
        plantItems: []
      },
      overallPrice: 0,
      amount: 0,
      slideIn: false
    };
  }

  componentDidMount(){
    this.getPlantProposal(this.props.amount);
  }

  updatePlantBag() {
    for (var plantItem in this.state.trees.plantItems) {
      var price = this.state.trees.plantItems[plantItem].amount * this.state.trees.plantItems[plantItem].treePrice;
      var projectItems = {};
      projectItems[this.state.trees.plantItems[plantItem].treeType] = {
        amount: parseInt(this.state.trees.plantItems[plantItem].amount),
        price: parseInt(this.state.trees.plantItems[plantItem].treePrice),
        imageFile: this.state.trees.plantItems[plantItem].imageFile
      };
      this.props.updatePlantBag(price, projectItems, this.props.projectName);
    }
  }

  getPlantProposal(value) {
    var that = this;
    this.setState({slideIn: true});
    axios.get('http://localhost:8081/simplePlantProposalForTrees/project?projectName=' + this.props.projectName + '&amountOfTrees=' + value).then(function(response) {
      var result = response.data;
      that.sleep(500);
      that.setState({
        trees: result,
        slideIn: false
      });
    });
  }

  componentDidUpdate() {
    if (this.state.amount != this.props.amount) {
      this.setState({amount: this.props.amount});
      this.getPlantProposal(this.props.amount);
    }
  }

  sleep(milliseconds) {
    var e = new Date().getTime() + (milliseconds);
    while (new Date().getTime() <= e) {}
  }

  render() {
    return (
      <div>
          <ButtonBar chosen={this.props.amount} setAmount={this.props.setAmount.bind(this)}/>
          <div className="plantItemDesc align-center bold plantItemDesc ">
            <div>
              <p>
                Baumtyp&nbsp;&&nbsp;Preis/Stk.
              </p>
            </div>
            <div>
              Anzahl
            </div>
            <div></div>
            <div>
              Preis gesamt
            </div>
          </div>
          <div ref="plantItems" className={(this.state.slideIn
            ? 'sliding-in '
            : 'sliding-out ') + 'align-center plantItems'}>
            {this.state.trees.plantItems.map(function(plantItem, i) {
              return (<PlantItem plantItem={plantItem} key={i}/>);
            })}
          </div>
          <BottomPart updatePlantBag={this.updatePlantBag.bind(this)} overallPrice={this.state.trees.actualPrice}/>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
