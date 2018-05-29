import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';
import {Link, browserHistory} from 'react-router';

import IconButton from '../../common/components/IconButton';

import ButtonBar from '../ButtonBar';
import BottomPart from '../BottomPart';

import MainSlider from './MainSlider';
import ProjectSlider from './ProjectSlider';

require('./plantPage.less');

export default class SliderPlantPage extends Component {

  constructor() {
    super();
    this.state = {
      treeCount: 5,
      projects: [],
      overallPrice: 0
    };
    this.balanceProjectSlidersFromProjectSlider = this.balanceProjectSlidersFromProjectSlider.bind(this);
  }

  componentDidMount() {
    this.setState({isGift: this.props.route.isGift, isAbo: this.props.route.isAbo});
    var that = this;
    axios.get('http://localhost:8081/reports/activeProjects').then(function(response) {
      var result = response.data;
      that.setState({projects: result, treeCount: 10});
      that.refs['mainSlider'].setMainSliderValue(10);
      that.forceUpdate();
      axios.get('http://localhost:8081/simplePlantProposalForTrees/' + 10).then(function(response) {
        var result = response.data;
        for (var plantItem in result.plantItems) {
          for (var project in that.state.projects) {
            if (that.state.projects[project].projectName == result.plantItems[plantItem].projectName) {
              that.refs['project_' + project].setSliderValueWithoutBalancing(that.refs['project_' + project].getSliderValue() + result.plantItems[plantItem].amount, false);
              for (var article in that.refs['project_' + project].getArticles()) {
                if (that.refs['project_' + project].getArticles()[article].treeType.name == result.plantItems[plantItem].treeType) {
                  that.refs['project_' + project].setArticleValue(article, result.plantItems[plantItem].amount);
                }
              }
            }
          }
        }
        that.calcAndSetOverallPrice();
      });
    });
  }

  updatePlantBag() {
    for (var project in this.state.projects) {
      var projectItems = {};
      var updateProject = false;
      for (var article in this.refs['project_' + project].getArticles()) {
        if (this.refs['project_' + project].getArticleValue(article) > 0) {
          projectItems[this.refs['project_' + project].getArticles()[article].treeType.name] = {
            amount: parseInt(this.refs['project_' + project].getArticleValue(article)),
            price: parseInt(this.refs['project_' + project].getArticles()[article].price.priceAsLong),
            imageFile: this.refs['project_' + project].getArticles()[article].treeType.imageFile
          };
          updateProject = true;
        }
      }
      if(updateProject){
        this.refs['navbar'].updatePlantBag(this.refs['project_' + project].getPrice(), projectItems, this.state.projects[project].projectName);
      }
    }
  }

  calcAndSetOverallPrice() {
    var price = 0;
    for (var project in this.state.projects) {
      price = price + parseInt(this.refs['project_' + project].getPrice());
    }
    this.state.overallPrice = price;
    this.refs['mainSlider'].setOverallPrice(price);
    this.forceUpdate();
  }

  balanceProjectSlidersFromMain(value) {
    var divisionValue = Math.trunc(value / this.state.projects.length);
    var moduloValue = value % this.state.projects.length;
    var moduloCnt = 0;
    for (var project in this.state.projects) {
      this.refs['project_' + project].updateMaxValue(value);
      if (moduloCnt < moduloValue) {
        this.refs['project_' + project].setSliderValue(divisionValue + 1, false);
        moduloCnt++;
      } else {
        this.refs['project_' + project].setSliderValue(divisionValue, false);
      }
    }
    this.setState({treeCount: value});
    this.calcAndSetOverallPrice();
  }

  balanceProjectSlidersFromProjectSlider(sliderIndex, value) {
    var that = this;
    var movedCntAndSum = this.getMovedCntAndSum();
    if (movedCntAndSum[0] == this.state.projects.length) {
      var manualMovedSliderValueWithMaxValue = this.getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex);
      var diffToTreeCount = movedCntAndSum[1] - this.state.treeCount;

      var valueToSet = this.refs['project_' + manualMovedSliderValueWithMaxValue].getSliderValue() - diffToTreeCount;
      this.refs['project_' + manualMovedSliderValueWithMaxValue].setSliderValue(valueToSet, true);

      var divisionValue = Math.trunc((this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) / ((movedCntAndSum[0] - 2)));
      var moduloValue = (this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) % (movedCntAndSum[0] - 2);
      var moduloCnt = 0;
      for (var project in this.state.projects) {
        if (project != manualMovedSliderValueWithMaxValue && project != sliderIndex) {
          if (moduloCnt < moduloValue) {
            this.refs['project_' + project].setSliderValue(divisionValue + 1, true);
            moduloCnt++;
          } else {
            this.refs['project_' + project].setSliderValue(divisionValue, true);
          }
        }
      }
    } else if (movedCntAndSum[1] > this.state.treeCount) {
      var manualMovedSliderValueWithMaxValue = this.getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex);
      var diffToTreeCount = movedCntAndSum[1] - this.state.treeCount;
      var valueToSet = this.refs['project_' + manualMovedSliderValueWithMaxValue].getSliderValue() - diffToTreeCount;
      this.refs['project_' + manualMovedSliderValueWithMaxValue].setSliderValue(valueToSet, true);

      if (movedCntAndSum[0] > 2) {
        var divisionValue = Math.trunc((this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) / ((movedCntAndSum[0] - 2)));
        var moduloValue = (this.state.treeCount - (parseInt(valueToSet) + parseInt(value))) % (movedCntAndSum[0] - 2);
        var moduloCnt = 0;
        for (var project in this.state.projects) {
          if (this.refs['project_' + project].wasMovedManually() && project != sliderIndex && project != manualMovedSliderValueWithMaxValue) {
            if (moduloCnt < moduloValue) {
              this.refs['project_' + project].setSliderValue(divisionValue + 1, true);
              moduloCnt++;
            } else {
              this.refs['project_' + project].setSliderValue(divisionValue, true);
            }
          }
        }
      }
    } else {
      var divisionValue = Math.trunc((this.state.treeCount - movedCntAndSum[1]) / (this.state.projects.length - movedCntAndSum[0]));
      var moduloValue = (this.state.treeCount - movedCntAndSum[1]) % (this.state.projects.length - movedCntAndSum[0]);
      var moduloCnt = 0;
      for (var project in this.state.projects) {
        if (!this.refs['project_' + project].wasMovedManually()) {
          if (moduloCnt < moduloValue) {
            this.refs['project_' + project].setSliderValue(divisionValue + 1, false);
            moduloCnt++;
          } else {
            this.refs['project_' + project].setSliderValue(divisionValue, false);
          }
        }
      }
    }
    this.calcAndSetOverallPrice();
  }

  getMovedCntAndSum() {
    var result = [];
    var movedCnt = 0;
    var movedSum = 0;
    for (var project in this.state.projects) {
      if (this.refs['project_' + project].wasMovedManually()) {
        movedCnt++;
        movedSum = movedSum + parseInt(this.refs['project_' + project].getSliderValue());
      }
    }
    result.push(movedCnt);
    result.push(movedSum);

    return result;
  }

  getManualMovedSliderValueWithMaxValueExceptCurrent(sliderIndex) {
    var maxValue = -1;
    var index;
    for (var project in this.state.projects) {
      if (project != sliderIndex && parseInt(this.refs['project_' + project].getSliderValue()) > maxValue) {
        maxValue = parseInt(this.refs['project_' + project].getSliderValue());
        index = project;
      }
    }
    return index;
  }

  switchToOfferProjectPage() {
    browserHistory.push('/projectOffer');
  }

  render() {
    var that = this;
    return (
      <div className="container paddingTopBottom15">
        <div className="row plantPage">
          <div className="col-md-12">
            <h1>{this.props.route.header}</h1>
            <ButtonBar chosen="slider"/>
            <MainSlider ref="mainSlider" balanceProjectSliders={this.balanceProjectSlidersFromMain.bind(this)}/> {this.state.projects.map(function(project, i) {
              return (<ProjectSlider project={project} articles={project.articles} key={i} ref={'project_' + i} balanceProjectSliders={that.balanceProjectSlidersFromProjectSlider.bind(this)} sliderIndex={i}/>);
            })}
            <BottomPart updatePlantBag={this.updatePlantBag.bind(this)} overallPrice={this.state.overallPrice}/>
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
