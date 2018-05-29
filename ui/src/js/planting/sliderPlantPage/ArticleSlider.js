import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {getTextForSelectedLanguage} from '../../common/language/LanguageHelper';
import Accounting from 'accounting';

export default class ArticleSlider extends Component {

  constructor() {
    super();
    this.state = {
      value: 0,
      maxValue: 5,
      price: 0,
      movedManually: false
    };
  }

  wasMovedManually() {
    return this.state.movedManually;
  }

  getSliderValue() {
    return this.state.value;
  }

  getPrice() {
    return this.state.price;
  }

  updateMaxValue(value) {
    var maxValue = ((this.props.article.amount - this.props.article.alreadyPlanted) >= value
      ? value
      : (this.props.article.amount - this.props.article.alreadyPlanted));
    this.setState({maxValue: maxValue});
  }

  updateSliderValue(event) {
    this.state.value = event.target.value;
    this.state.movedManually = true;
    this.state.price = this.props.article.price.priceAsLong * event.target.value;
    this.forceUpdate();
    this.props.balanceArticleSliders(this.props.sliderIndex, event.target.value);
  }

  setSliderValue(value, movedManually) {
    this.state.value = value;
    this.state.movedManually = movedManually;
    this.state.price = this.props.article.price.priceAsLong * value;
    this.forceUpdate();
  }

  render() {
    var imgUrl = 'http://localhost:8081/treeType/image/' + this.props.article.treeType.imageFile + '/40/40';
    return (
      <div className="articleSlider">
        <div className="image">
          <img src={imgUrl}/>
        </div>
        <div className="treeTypeInfo">
          <span className="bold">{getTextForSelectedLanguage(this.props.article.treeType.name)}</span><br/>
          Stk.&nbsp;<span className="bold">{Accounting.formatNumber(this.props.article.price.priceAsLong / 100, 2, '.', ',')}
            &nbsp;€</span>
        </div>
        <div className="sliderDiv">
          <input type="range" min="0" max={this.state.maxValue} step="1" value={this.state.value} onChange={this.updateSliderValue.bind(this)}/>
        </div>
        <div className="sliderSummary">
          {Accounting.formatNumber(this.state.price / 100, 2, '.', ',')}&nbsp;€&nbsp;/&nbsp;<span className="green">{this.state.value}&nbsp;</span><span className="glyphicon glyphicon-tree-deciduous" aria-hidden="true"/>
        </div>

      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
