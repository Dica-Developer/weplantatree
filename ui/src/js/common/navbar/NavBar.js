import React, {Component} from 'react';
import {Link} from 'react-router';

import Menu from './Menu';
import MenuItem from './MenuItem';
import PlantBag from './PlantBag';
import LoginMenuItem from './LoginMenuItem';

require("./navbar.less");
require("./menu.less");

export default class NavBar extends Component {
  constructor(){
    super();
  }


  showLeft() {
    this.refs.left.show();
  }

  showRight() {
    this.refs.right.show();
  }

  updatePlantBag(price, projectItems, projectName){
    this.refs["plantBag"].updatePlantBag(price, projectItems, projectName);
  }


  render() {
    return (
      <div>
        <Menu ref="left" alignment="left">
          <MenuItem hash="first-page">PFLANZUNGEN</MenuItem>
          <MenuItem hash="/explore">PROJEKTFLÄCHEN</MenuItem>
          <MenuItem hash="third-page">FINDEN</MenuItem>
          <MenuItem hash="4">FINDEN</MenuItem>
          <MenuItem hash="5">GUTSCHEIN</MenuItem>
          <MenuItem hash="6">FLÄCHE ANBIETEN</MenuItem>
          <MenuItem hash="/ranking">BESTENLISTE</MenuItem>
          <MenuItem hash="8">STATISTIKEN</MenuItem>
          <MenuItem hash="9">BLOG</MenuItem>
          <MenuItem hash="10">FAQs</MenuItem>
        </Menu>
        <Menu ref="right" alignment="right">
          <LoginMenuItem hash="login"></LoginMenuItem>
          <MenuItem hash="first-page">MEIN WALD</MenuItem>
          <MenuItem hash="second-page">MEIN PROFIL</MenuItem>
          <MenuItem hash="third-page">MEIN TEAM</MenuItem>
          <MenuItem hash="4">POSTFACH</MenuItem>
          <MenuItem hash="5">TOOLS</MenuItem>
          <MenuItem hash="6">ABONNEMENTS</MenuItem>
        </Menu>
        <nav id="navBar" className="navbar navbar-default navbar-fixed-top">
          <div className="navbar-header">
            <button className="navbar-toggle navbar-left" onClick={this.showLeft.bind(this)}>
              <img className="nav-img" src="/assets/images/Menu.png" alt="mein Wald" width="30" height="30"/>
              <span className="buttonText">MENU</span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbarLinkBar">
            <button className="navbar-toggle navbar-right" onClick={this.showRight.bind(this)}>
              <img className="nav-img" src="/assets/images/MeinWald.png" alt="mein Wald" width="58" height="50"/>
              <span className="buttonText">MEIN WALD</span>
            </button>
            <div className="container">
              <Link to="/" className="navbar-left navbar-logo">
                <img className="nav-img" src="/assets/images/ipat_logo.png" alt="logo" width="50" height="50"/>
              </Link>
              <Link to="/plant" className="navbar-left">
                <img className="nav-img" src="/assets/images/Spaten.png" alt="selbst pflanzen" width="25" height="50"/>
              </Link>
              <Link to="/plant" className="navbar-left">
                <img className="nav-img" src="/assets/images/Maus.png" alt="online pflanzen" width="50" height="50"/>
              </Link>
              <Link to="/plant" className="navbar-left">
                <img className="nav-img" src="/assets/images/Schere.png" alt="Baumservice" width="59" height="50"/>
              </Link>
              <PlantBag updatePlantBag={this.updatePlantBag.bind(this)} ref="plantBag"/>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
