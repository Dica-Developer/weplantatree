import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';
import {Link, browserHistory} from 'react-router';

import ButtonBar from './ButtonBar';
import BottomPart from '../../planting/BottomPart';
import Article from '../../planting/customPlantPage/Article';
import ArticleDesc from '../../planting/customPlantPage/ArticleDesc';

export default class PlantCustom extends Component {

  constructor() {
    super();
    this.state = {
      overallPrice: 0
    };
    this.updatePrice = this.updatePrice.bind(this);
  }

  updatePlantBag() {
    var projectItems = {};
    for (var article in this.props.articles) {
      if (this.refs['article_' + article].getAmount() != null && this.refs['article_' + article].getAmount() > 0) {
        projectItems[this.props.articles[article].treeType.name] = {
          amount: parseInt(this.refs['article_' + article].getAmount()),
          price: parseInt(this.props.articles[article].price.priceAsLong),
          imageFile: this.props.articles[article].treeType.imageFile
        };
      }
    }
    this.props.updatePlantBag(this.state.overallPrice, projectItems, this.props.projectName);
  }

  updatePrice() {
    var price = 0;
    for (var article in this.props.articles) {
      if (this.refs['article_' + article].getAmount() != null && this.refs['article_' + article].getAmount() > 0) {
        price = price + parseInt(this.refs['article_' + article].getAmount()) * parseInt(this.props.articles[article].price.priceAsLong);
      }
    }
    this.state.overallPrice = price;
    this.forceUpdate();
  }

  render() {
    var that = this;
    return (
      <div className="plantCustom">
        <ButtonBar chosen={this.props.amount} setAmount={this.props.setAmount.bind(this)}/>
        <ArticleDesc/>
        <div className={'plantItems align-center'}>
          {this.props.articles.map(function(article, i) {
            return (<Article key={i} article={article} ref={'article_' + i} updatePrice={that.updatePrice.bind(this)}/>);
          })}
        </div>
        <BottomPart updatePlantBag={this.updatePlantBag.bind(this)} overallPrice={this.state.overallPrice}/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
