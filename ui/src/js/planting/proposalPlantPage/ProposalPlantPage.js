import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';
import {Link, browserHistory} from 'react-router';
import $ from 'jquery';

import PlantItem from './PlantItem';

import ButtonBar from '../ButtonBar';
import BottomPart from '../BottomPart';

require('./proposalPlantPage.less');

export default class ProposalPlantPage extends Component {

  constructor() {
    super();
    this.state = {
      trees: {
        plantItems: []
      },
      overallPrice: 0,
      amount: -1,
      slideIn: false
    };
    this.toggleDiv = this.toggleDiv.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('isGift', this.props.route.isGift);
    this.setState({amount: this.props.params.amount});
    this.getPlantProposal(this.props.params.amount);
  }

  toggleDiv() {
    $(this.refs['plantItems']).slideToggle(800);
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
      this.props.route.updatePlantBag(price, projectItems, this.state.trees.plantItems[plantItem].projectName, this.props.route.isGift);
    }
  }

  getPlantProposal(value) {
    var that = this;
    this.toggleDiv();
    axios.get('http://localhost:8081/simplePlantProposalForTrees/' + value).then(function(response) {
      var result = response.data;
      setTimeout(function(){
        that.setState({trees: result});
        that.toggleDiv();
       }, 1000);
    });
  }

  componentDidUpdate() {
    if (this.state.amount != this.props.params.amount) {
      this.setState({amount: this.props.params.amount});
      this.getPlantProposal(this.props.params.amount);
    }
  }

  sleep(milliseconds) {
    var e = new Date().getTime() + (milliseconds);
    while (new Date().getTime() <= e) {}
  }

  render() {
    var chosen;
    if (this.props.params.amount == '1' || this.props.params.amount == '5' || this.props.params.amount == '10' || this.props.params.amount == '50' || this.props.params.amount == '100') {
      chosen = this.props.params.amount;
    } else {
      chosen = 'customAmount';
    }
    return (
      <div className="container paddingTopBottom15">
        <div className="row proposalPlantPage">
          <div className="col-md-12">
            <h1>{this.props.route.header}</h1>
            <ButtonBar chosen={chosen}/>
            <div className="align-center bold plantItemDesc">
              <div></div>
              <div>
                <p>
                  Baumtyp<br/>Preis&nbsp;/&nbsp;Stk.
                </p>
              </div>
              <div>
                Anzahl
              </div>
              <div>
                Projekt
              </div>
              <div></div>
              <div>
                Preis gesamt
              </div>
            </div>
            <div ref="plantItems" className={'plantItems align-center'}>
              {this.state.trees.plantItems.map(function(plantItem, i) {
                return (<PlantItem plantItem={plantItem} key={i}/>);
              })}
            </div>
            <BottomPart updatePlantBag={this.updatePlantBag.bind(this)} overallPrice={this.state.trees.actualPrice}/>
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
