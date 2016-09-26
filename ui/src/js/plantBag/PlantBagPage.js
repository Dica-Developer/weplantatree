import React, {Component} from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import {browserHistory} from 'react-router';
import Accounting from 'accounting';
import NavBar from '../common/navbar/NavBar';
import Footer from '../common/Footer';
import Header from '../common/header/Header';
import Boostrap from 'bootstrap';

import PlantBagProject from './PlantBagProject';
import PlantBagItem from './PlantBagItem'
import IconButton from '../common/components/IconButton';
import CheckBox from '../common/components/CheckBox';

require("./plantBagPage.less");

export default class PlantBagPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      plantBag: JSON.parse(localStorage.getItem('plantBag')),
      isGift: false
    };
  }

  switchTOPaymentPage() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    if(this.state.isGift){
      localStorage.setItem('plantBag', JSON.stringify(this.state.plantBag));
      axios.post('http://localhost:8081/gift/create', this.state.plantBag, config).then(function(response) {
        browserHistory.push('/payGift/' + response.data[0] + '/' + response.data[1]);
      }).catch(function(response) {
        if (response instanceof Error) {
          console.error('Error', response.message);
        } else {
          console.error(response.data);
          console.error(response.status);
          console.error(response.headers);
          console.error(response.config);
        }
        console.error('Payment failed');
      });
    }else{
      localStorage.setItem('plantBag', JSON.stringify(this.state.plantBag));
      axios.post('http://localhost:8081/donateTrees', this.state.plantBag, config).then(function(response) {
        browserHistory.push('/payCart/' + response.data);
      }).catch(function(response) {
        if (response instanceof Error) {
          console.error('Error', response.message);
        } else {
          console.error(response.data);
          console.error(response.status);
          console.error(response.headers);
          console.error(response.config);
        }
        console.error('Payment failed');
      });
    }
  }

  removePlantBagItem(project, plantItem){
    delete this.state.plantBag.projects[project].plantItems[plantItem];
    this.forceUpdate();
    if(Object.keys(this.state.plantBag.projects[project].plantItems).length === 0){
      delete this.state.plantBag.projects[project];
      this.forceUpdate();
    }
    this.calcPriceAndUpdatePlantBag();
  }

  increasePlantBagItem(project, plantItem){
    this.state.plantBag.projects[project].plantItems[plantItem].amount++
    this.forceUpdate();
    this.calcPriceAndUpdatePlantBag();
  }

  decreasePlantBagItem(project, plantItem){
    this.state.plantBag.projects[project].plantItems[plantItem].amount--;
    this.forceUpdate();
    if(this.state.plantBag.projects[project].plantItems[plantItem].amount == 0){
      delete this.state.plantBag.projects[project].plantItems[plantItem];
      this.forceUpdate();
    }
    this.calcPriceAndUpdatePlantBag();
  }

  calcPriceAndUpdatePlantBag(){
    var price = 0;
    for (var project in this.state.plantBag.projects) {
      for (var plantItem in this.state.plantBag.projects[project].plantItems) {
        price = price + this.state.plantBag.projects[project].plantItems[plantItem].price * this.state.plantBag.projects[project].plantItems[plantItem].amount;
      }
    }
    this.state.plantBag.price = price;
    this.forceUpdate();
    localStorage.setItem('plantBag', JSON.stringify(this.state.plantBag));
    this.refs["navbar"].updatePlantBagFromLocaleStorage();
  }

  updateValue(toUpdate, value){
    this.setState({[toUpdate]: value});
  }

  render() {
    var that = this;
    return (
      <div>
        <NavBar ref="navbar"/>
        <Header/>
        <div className="container paddingTopBottom15">
          <div className="row plantBagPage">
            <div className="col-md-12">
              <h2>Dein Pflanzkorb</h2>
              <div className="overview">
                {Object.keys(this.state.plantBag.projects).map(function(project, i) {
                  var projectPrice = 0;
                  for (var plantItem in that.state.plantBag.projects[project].plantItems) {
                    projectPrice = projectPrice + (that.state.plantBag.projects[project].plantItems[plantItem].amount * that.state.plantBag.projects[project].plantItems[plantItem].price);
                  }
                  return (
                    <PlantBagProject projectName={project} plantItems={that.state.plantBag.projects[project].plantItems} key={i} price={projectPrice}>
                      {Object.keys(that.state.plantBag.projects[project].plantItems).map(function(plantItem, i) {
                        return (<PlantBagItem plantItemName={plantItem} plantBagitem={that.state.plantBag.projects[project].plantItems[plantItem]}  key={i} removePlantBagItem={()=>{that.removePlantBagItem(project, plantItem)}} increasePlantBagItem={()=>{that.increasePlantBagItem(project, plantItem)}} decreasePlantBagItem={()=>{that.decreasePlantBagItem(project, plantItem)}}/>);
                      })}
                    </PlantBagProject>
                  );
                })}
                <div className="doubledLine"/>
                <div className="overallPrice">
                  GESAMT:&nbsp;{Accounting.formatNumber(this.state.plantBag.price / 100, 2, ".", ",")}&nbsp;€
                </div>
                <div className="align-right">
                  <CheckBox toUpdate="isGift" value={this.state.isGift} updateValue={this.updateValue.bind(this)} text="Als Geschenkgutschein"/><br/>
                  <IconButton glyphIcon="glyphicon-euro" text="WEITER ZUR KASSE" onClick={this.switchTOPaymentPage.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */