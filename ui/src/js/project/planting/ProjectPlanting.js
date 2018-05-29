import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import Accounting from 'accounting';
import {Link} from 'react-router';

import IconButton from '../../common/components/IconButton';
import SvgButton from '../../common/components/SvgButton';
import ProjectSlider from './ProjectSlider';
import ArticleSlider from './ArticleSlider';

require('./projectPlanting.less');
require('./slider.less');

export default class ProjectPlanting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 5,
      treeCount: this.props.articles.length,
      maximumAmountOfTreesToPlant: 0,
      sliderValue: this.props.articles.length,
      sliderStep: 1,
      maxValue: 100,
      fade: false
    };
    this.balanceArticleSlidersFromArticleSlider = this.balanceArticleSlidersFromArticleSlider.bind(this);
    this.fadingDone = this.fadingDone.bind(this);
  }

  componentDidMount() {
    const elm = this.refs.planting;
    elm.addEventListener('animationend', this.fadingDone);
  }
  componentWillUnmount() {
    const elm = this.refs.planting;
    elm.removeEventListener('animationend', this.fadingDone);
  }
  fadingDone() {
    this.setState({fade: false});
  }

  updatePlantBag() {
    var projectItems = {};
    for (var i = 0; i < this.props.articles.length; i++) {
      if (this.refs['article_' + i].getSliderValue() > 0) {
        projectItems[this.props.articles[i].treeType.name] = {
          amount: parseInt(this.refs['article_' + i].getSliderValue()),
          price: parseInt(this.props.articles[i].price.priceAsLong),
          imageFile: this.props.articles[i].treeType.imageFile
        };
      }
    }
    this.props.updatePlantBag(this.state.price, projectItems, this.props.projectName);
  }

  balanceArticleSliders(value) {
    var divisionValue = Math.trunc(value / this.props.articles.length);
    var moduloValue = value % this.props.articles.length;
    var moduloCnt = 0;
    for (var project in this.props.articles) {
      this.refs['article_' + project].updateMaxValue(value);
      if (moduloCnt < moduloValue) {
        this.refs['article_' + project].setSliderValue(divisionValue + 1, false);
        moduloCnt++;
      } else {
        this.refs['article_' + project].setSliderValue(divisionValue, false);
      }
    }
    this.setState({treeCount: value});
    this.calcProjectPrice();
  }

  balanceArticleSlidersFromArticleSlider(sliderIndex, value) {
    var that = this;
    var movedCntAndSum = this.getMovedCntAndSum();
    if (movedCntAndSum[0] == this.props.articles.length) {
      var manualMovedSliderValueWithMaxValue = this.getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex);
      var diffToTreeCount = movedCntAndSum[1] - this.state.treeCount;

      var valueToSet = this.refs['article_' + manualMovedSliderValueWithMaxValue].getSliderValue() - diffToTreeCount;
      this.refs['article_' + manualMovedSliderValueWithMaxValue].setSliderValue(valueToSet, true);

      var divisionValue = Math.trunc((this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) / ((movedCntAndSum[0] - 2)));
      var moduloValue = (this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) % (movedCntAndSum[0] - 2);
      var moduloCnt = 0;
      for (var project in this.props.articles) {
        if (project != manualMovedSliderValueWithMaxValue && project != sliderIndex) {
          if (moduloCnt < moduloValue) {
            this.refs['article_' + project].setSliderValue(divisionValue + 1, true);
            moduloCnt++;
          } else {
            this.refs['article_' + project].setSliderValue(divisionValue, true);
          }
        }
      }
    } else if (movedCntAndSum[1] > this.state.treeCount) {
      var manualMovedSliderValueWithMaxValue = this.getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex);
      var diffToTreeCount = movedCntAndSum[1] - this.state.treeCount;
      var valueToSet = this.refs['article_' + manualMovedSliderValueWithMaxValue].getSliderValue() - diffToTreeCount;
      this.refs['article_' + manualMovedSliderValueWithMaxValue].setSliderValue(valueToSet, true);

      if (movedCntAndSum[0] > 2) {
        var divisionValue = Math.trunc((this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) / ((movedCntAndSum[0] - 2)));
        var moduloValue = (this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) % (movedCntAndSum[0] - 2);
        var moduloCnt = 0;
        for (var project in this.props.articles) {
          if (this.refs['article_' + project].wasMovedManually() && project != sliderIndex && project != manualMovedSliderValueWithMaxValue) {
            if (moduloCnt < moduloValue) {
              this.refs['article_' + project].setSliderValue(divisionValue + 1, true);
              moduloCnt++;
            } else {
              this.refs['article_' + project].setSliderValue(divisionValue, true);
            }
          }
        }
      }
    } else {
      var divisionValue = Math.trunc((this.state.treeCount - movedCntAndSum[1]) / (this.props.articles.length - movedCntAndSum[0]));
      var moduloValue = (this.state.treeCount - movedCntAndSum[1]) % (this.props.articles.length - movedCntAndSum[0]);
      var moduloCnt = 0;
      for (var project in this.props.articles) {
        if (!this.refs['article_' + project].wasMovedManually()) {
          if (moduloCnt < moduloValue) {
            this.refs['article_' + project].setSliderValue(divisionValue + 1, false);
            moduloCnt++;
          } else {
            this.refs['article_' + project].setSliderValue(divisionValue, false);
          }
        }
      }
    }
    this.calcProjectPrice();
  }

  getMovedCntAndSum() {
    var result = [];
    var movedCnt = 0;
    var movedSum = 0;
    for (var project in this.props.articles) {
      if (this.refs['article_' + project].wasMovedManually()) {
        movedCnt++;
        movedSum = movedSum + parseInt(this.refs['article_' + project].getSliderValue());
      }
    }
    result.push(movedCnt);
    result.push(movedSum);

    return result;
  }

  getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex) {
    var maxValue = -1;
    var index;
    for (var project in this.props.articles) {
      if (project != sliderIndex && parseInt(this.refs['article_' + project].getSliderValue()) > maxValue) {
        maxValue = parseInt(this.refs['article_' + project].getSliderValue());
        index = project;
      }
    }
    return index;
  }

  calcProjectPrice() {
    var price = 0;
    for (var article in this.props.articles) {
      price = price + parseInt(this.refs['article_' + article].getPrice());
    }
    this.state.price = price;
    this.forceUpdate();
  }

  render() {
    var that = this;
    return (
      <div ref="planting" className={(this.state.fade
        ? 'fadeOut'
        : 'fadeIn') + ' projectPlanting'}>
        <h1>{this.props.projectName}&nbsp;/&nbsp;
          <i>hier pflanzen</i>
        </h1>
        <ProjectSlider ref="projectSlider" maximumAmountOfTreesToPlant={this.state.maximumAmountOfTreesToPlant} ref="projectSlider" price={this.state.price} balanceArticleSliders={this.balanceArticleSliders.bind(this)}/>
        <div className="articleDesc">
          <div>
            Hier kannst Du die Anzahl Deiner Bäume individuell verteilen.
          </div>
          {this.props.articles.map(function(article, i) {
            return (<ArticleSlider article={article} key={i} ref={'article_' + i} sliderIndex={i} balanceArticleSliders={that.balanceArticleSlidersFromArticleSlider.bind(this)}/>);
          })}
          <table className="bottomTable">
            <tbody>
              <tr>
                <td></td>
                <td>
                  <span>GESAMT:&nbsp;{Accounting.formatNumber(this.state.price / 100, 2, '.', ',')}&nbsp;€</span>
                </td>
                <td>
                  <SvgButton text="AB IN MEINEN<br/>PFLANZKORB" buttonType="barrow" onClick={this.updatePlantBag.bind(this)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bottom align-center">
          <IconButton text="ZURÜCK ZUR BESCHREIBUNG" glyphIcon="glyphicon-backward" onClick={this.props.showDetails.bind(this)}/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
