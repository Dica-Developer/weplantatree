import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import {browserHistory } from 'react-router';
import Accounting from 'accounting';
import NavBar from '../common/navbar/NavBar';
import Footer from '../common/Footer';
import Header from '../common/header/Header';
import Boostrap from 'bootstrap';

import PlantBagProject from './PlantBagProject';
import IconButton from '../common/components/IconButton';

require("./plantBagPage.less");

export default class PlantBagPage extends Component {

  constructor(props){
      super(props);
      this.state = {
        plantBag: JSON.parse(localStorage.getItem('plantBag'))
      };
  }

  switchTOPaymentPage(){
    browserHistory.push('/payment');
  }

  render() {
    var that = this;
    return (
      <div>
        <NavBar/>
        <Header/>
        <div className="container paddingTopBottom15">
          <div className="row plantBagPage">
            <div className="col-md-12">
              <h2>Dein Pflanzkorb</h2>
              <div className="overview">
                {Object.keys(this.state.plantBag.projects).map(function(project, i){
                  return(
                    <PlantBagProject projectName={project} plantItems={that.state.plantBag.projects[project].plantItems} key={i}/>
                  );
                })}
                <div className="doubledLine" />
                <div className="overallPrice">
                  GESAMT:&nbsp;{Accounting.formatNumber(this.state.plantBag.price /100, 2, ".", ",")}&nbsp;€
                </div>
                <div className="align-right">
                  <IconButton glyphIcon="glyphicon-euro" text="WEITER ZUR KASSE" onClick={this.switchTOPaymentPage.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>);
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
