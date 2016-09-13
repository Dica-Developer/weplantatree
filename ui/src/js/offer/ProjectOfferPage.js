import React, {Component} from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import NavBar from '../common/navbar/NavBar';
import Header from '../common/header/Header';
import Footer from '../common/Footer';
import Boostrap from 'bootstrap';

import ProjectOffer from './ProjectOffer';
import ThanksForOffer from './ThanksForOffer';


require("./projectOffer.less");

export default class ProjectOfferPage extends Component {

  constructor() {
    super();
    this.state = {
      thankYou: false
    };
  }

  setThankYou(value){
    this.setState({thankYou: value});
  }

  render() {
    var content;
    if(this.state.thankYou){
        content = <ThanksForOffer setThankYou={this.setThankYou.bind(this)}/>;
    }else{
      content = <ProjectOffer setThankYou={this.setThankYou.bind(this)}/>;
    }

    return (
      <div>
        <NavBar/>
        <Header/>
        <div className="container paddingTopBottom15">
          <div className="row projectOffer">
            {content}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
