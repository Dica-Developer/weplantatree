import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import PieChart from 'react-simple-pie-chart';
import Accounting from 'accounting';
import {Link, browserHistory} from 'react-router';

import IconButton from '../../common/components/IconButton';
import ArticleSlider from './ArticleSlider';

export default class ProjectSlider extends Component {

  constructor() {
    super();
    this.state = {
      value: 0,
      maxValue: 10,
      articles: [],
      showArticles: false,
      movedManually: false,
      price: 0
    };
    this.balanceArticleSlidersFromArticleSlider = this.balanceArticleSlidersFromArticleSlider.bind(this);
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8081/project/articles?projectName=' + that.props.project.projectName).then(function(response) {
      var articles = response.data;
      that.setState({articles: articles});
    }).catch(function(response) {
      if (response instanceof Error) {
        console.error('Error', response.message);
      } else {
        console.error(response.data);
        console.error(response.status);
        console.error(response.headers);
        console.error(response.config);
      }
    });
  }

  balanceArticleSlidersFromArticleSlider(sliderIndex, value) {
    var that = this;
    var movedCntAndSum = this.getMovedCntAndSum();
    if (movedCntAndSum[0] == this.state.articles.length) {
      var manualMovedSliderValueWithMaxValue = this.getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex);
      var diffToTreeCount = movedCntAndSum[1] - this.state.value;

      var valueToSet = this.refs['article_' + manualMovedSliderValueWithMaxValue].getSliderValue() - diffToTreeCount;
      this.refs['article_' + manualMovedSliderValueWithMaxValue].setSliderValue(valueToSet, true);

      var divisionValue = Math.trunc((this.state.value - (parseInt(valueToSet) + parseInt(value))) / ((movedCntAndSum[0] - 2)));
      var moduloValue = (this.state.value - (parseInt(valueToSet) + parseInt(value))) % (movedCntAndSum[0] - 2);
      var moduloCnt = 0;
      for (var project in this.state.articles) {
        if (project != manualMovedSliderValueWithMaxValue && project != sliderIndex) {
          if (moduloCnt < moduloValue) {
            this.refs['article_' + project].setSliderValue(divisionValue + 1, true);
            moduloCnt++;
          } else {
            this.refs['article_' + project].setSliderValue(divisionValue, true);
          }
        }
      }
    } else if (movedCntAndSum[1] > this.state.value) {
      var manualMovedSliderValueWithMaxValue = this.getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex);
      var diffToTreeCount = movedCntAndSum[1] - this.state.value;
      var valueToSet = this.refs['article_' + manualMovedSliderValueWithMaxValue].getSliderValue() - diffToTreeCount;
      this.refs['article_' + manualMovedSliderValueWithMaxValue].setSliderValue(valueToSet, true);

      if (movedCntAndSum[0] > 2) {
        var divisionValue = Math.trunc((this.state.value - (parseInt(valueToSet) + parseInt(value))) / ((movedCntAndSum[0] - 2)));
        var moduloValue = (this.state.value - (parseInt(valueToSet) + parseInt(value))) % (movedCntAndSum[0] - 2);
        var moduloCnt = 0;
        for (var project in this.state.articles) {
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
      var divisionValue = Math.trunc((this.state.value - movedCntAndSum[1]) / (this.state.articles.length - movedCntAndSum[0]));
      var moduloValue = (this.state.value - movedCntAndSum[1]) % (this.state.articles.length - movedCntAndSum[0]);
      var moduloCnt = 0;
      for (var project in this.state.articles) {
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
    for (var project in this.state.articles) {
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
    for (var project in this.state.articles) {
      if (project != sliderIndex && parseInt(this.refs['article_' + project].getSliderValue()) > maxValue) {
        maxValue = parseInt(this.refs['article_' + project].getSliderValue());
        index = project;
      }
    }
    return index;
  }

  wasMovedManually() {
    return this.state.movedManually;
  }

  getSliderValue() {
    return this.state.value;
  }

  getArticles() {
    return this.state.articles;
  }

  getPrice() {
    return this.state.price;
  }

  updateMaxValue(value) {
    var maxValue = ((this.props.project.amountOfMaximumTreesToPlant - this.props.project.amountOfPlantedTrees) >= value
      ? value
      : (this.props.project.amountOfMaximumTreesToPlant - this.props.project.amountOfPlantedTrees));
    this.setState({maxValue: maxValue});
  }

  getArticleValue(article) {
    return this.refs['article_' + article].getSliderValue();
  }

  setArticleValue(article, amount) {
    this.refs['article_' + article].setSliderValue(amount, false);
    this.calcProjectPrice();
  }

  updateSliderValue(event) {
    this.state.value = event.target.value;
    this.state.movedManually = true;
    this.forceUpdate();
    this.props.balanceProjectSliders(this.props.sliderIndex, event.target.value);
    this.balanceArticleSliders(event.target.value);
  }

  balanceArticleSliders(value) {
    var divisionValue = Math.trunc(value / this.state.articles.length);
    var moduloValue = value % this.state.articles.length;
    var moduloCnt = 0;
    for (var project in this.state.articles) {
      this.refs['article_' + project].updateMaxValue(value);
      if (moduloCnt < moduloValue) {
        this.refs['article_' + project].setSliderValue(divisionValue + 1, false);
        moduloCnt++;
      } else {
        this.refs['article_' + project].setSliderValue(divisionValue, false);
      }
    }
    this.calcProjectPrice();
  }

  calcProjectPrice() {
    var price = 0;
    for (var article in this.state.articles) {
      price = price + parseInt(this.refs['article_' + article].getPrice());
    }
    this.state.price = price;
    this.forceUpdate();
  }

  setSliderValue(value, movedManually) {
    this.setState({value: value, movedManually: movedManually});
    this.balanceArticleSliders(value);
  }

  setSliderValueWithoutBalancing(value, movedManually) {
    this.setState({value: value, movedManually: movedManually});
  }

  switchToProjectPlantingPage() {
    browserHistory.push('/projects/' + this.props.project.projectName);
  }

  setShowArticles(value) {
    this.setState({showArticles: value});
  }

  render() {
    var that = this;
    var percent = 0;
    if (this.props.project.amountOfMaximumTreesToPlant != 0) {
      percent = this.props.project.amountOfPlantedTrees / this.props.project.amountOfMaximumTreesToPlant * 100;
    }
    var formattedPercent = Accounting.formatNumber(percent, 0, '.', ',');
    var articles;
    var articleButton;
    if (this.state.showArticles) {
      articles = <div>{this.state.articles.map(function(article, i) {
          return (<ArticleSlider article={article} key={i} ref={'article_' + i} balanceArticleSliders={that.balanceArticleSlidersFromArticleSlider.bind(this)} sliderIndex={i}/>);
        })}</div>;
      articleButton = <div className="align-center"><IconButton glyphIcon="glyphicon-chevron-up" onClick={() => {
        this.setShowArticles(false);
      }}/></div>;
    } else {
      articles = '';
      articleButton = <div className="align-center"><IconButton glyphIcon="glyphicon-chevron-down" onClick={() => {
        this.setShowArticles(true);
      }}/></div>;
    }
    return (
      <div className="projectSlider">
        <div className="projectSummary">
          <div className="pieChart">
            <PieChart slices={[
              {
                color: '#82ab1f',
                value: percent
              }, {
                color: '#fff',
                value: 100 - percent
              }
            ]}/>
          </div>
          <div className="projectInfo">
            <span className="bold">{this.props.project.projectName}</span><br/>
            <span className="bold">{formattedPercent}&nbsp;%&nbsp;</span>bepflanzt<br/>
            <IconButton glyphIcon="glyphicon-forward" text="IM PROJEKT PFLANZEN" onClick={this.switchToProjectPlantingPage.bind(this)}/>
          </div>
        </div>
        <div className="sliderDiv">
          <input type="range" min="0" max={this.state.maxValue} step="1" value={this.state.value} onChange={this.updateSliderValue.bind(this)}/>
        </div>
        <div className="sliderSummary">
          <div className="priceValue">
            {Accounting.formatNumber(this.state.price / 100, 2, '.', ',')}&nbsp;€
          </div>
          <div className="treeValue">
            {this.state.value}&nbsp;<span className="glyphicon glyphicon-tree-deciduous" aria-hidden="true"/>
          </div>
        </div>
        <div className={(this.state.showArticles
          ? ''
          : 'invisible')}>
          {this.state.articles.map(function(article, i) {
            return (<ArticleSlider article={article} key={i} ref={'article_' + i} balanceArticleSliders={that.balanceArticleSlidersFromArticleSlider.bind(this)} sliderIndex={i}/>);
          })}
        </div>
        {articleButton}
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
