import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';

import {getTextForSelectedLanguage} from '../../common/language/LanguageHelper';

require('./articleSlider.less');

export default class ArticleSlider extends Component {
  constructor(props) {
    super(props);
    this.state = ({value: 0, maxValue: 5, overallPrice: 0, movedManually: false});
  }

  wasMovedManually() {
    return this.state.movedManually;
  }

  getSliderValue() {
    return this.state.value;
  }

  getPrice() {
    return this.state.overallPrice;
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
    this.state.overallPrice = this.props.article.price.priceAsLong * event.target.value;
    this.forceUpdate();
    this.props.balanceArticleSliders(this.props.sliderIndex, event.target.value);
  }

  setSliderValue(value, movedManually) {
    this.state.value = value;
    this.state.movedManually = movedManually;
    this.state.overallPrice = this.props.article.price.priceAsLong * value;
    this.forceUpdate();
  }

  render() {
    let imageUrl = 'http://localhost:8081/treeType/image/' + this.props.article.treeType.imageFile + '/60/60';
    return (
      <div className="articleSlider">
        <div className="image">
          <img src={imageUrl} className="treeImg"/>
        </div>
        <div className="treeTypeInfo">
          <span className="bold">
            {getTextForSelectedLanguage(this.props.article.treeType.name)}</span><br/>
          Stk.&nbsp;<span className="bold">{Accounting.formatNumber(this.props.article.price.priceAsLong / 100, 2, '.', ',')}&nbsp;€</span><br/>
        </div>
        <div className="slider">
          <input type="range" min="0" max={this.state.maxValue} value={this.state.value} step="1" onChange={this.updateSliderValue.bind(this)}/>
        </div>
        <div className="sliderSummary">
          <span className="price">{Accounting.formatNumber(this.state.overallPrice / 100, 2, '.', ',')}&nbsp;€</span><br/>
          <span className="treeCount">{Accounting.formatNumber(this.state.value, 0, '.', ',')}</span>
          <span className="glyphicon glyphicon-tree-deciduous" aria-hidden="true"></span>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
