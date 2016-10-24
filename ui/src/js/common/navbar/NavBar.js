import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';

import Menu from './Menu';
import MenuItem from './MenuItem';
import LanguageMenuItem from './LanguageMenuItem';
import PlantBag from './PlantBag';
import LoginMenuItem from './LoginMenuItem';
import ImageButton from '../components/ImageButton';
import axios from 'axios';

require("./navbar.less");
require("./menu.less");

export default class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      profileLinksInActive: 'true',
      language: (localStorage.getItem('language') == null
        ? 'DEUTSCH'
        : localStorage.getItem('language'))
    }
  }

  componentDidMount() {
    this.setProfileLinkIsInActive();
    localStorage.setItem('language', this.state.language);
  }

  showLeft() {
    this.refs.left.show();
  }

  showRight() {
    this.refs.right.show();
  }

  updatePlantBagFromLocaleStorage() {
    this.refs["plantBag"].updatePlantBagFromLocaleStorage();
  }

  updatePlantBag(price, projectItems, projectName) {
    this.refs["plantBag"].updatePlantBag(price, projectItems, projectName);
  }

  updateLanguage(value) {
    localStorage.setItem('language', value);
    this.setState({language: value});
    if (localStorage.getItem('jwt') != null && localStorage.getItem('jwt') != '') {
      var config = {
        headers: {
          'X-AUTH-TOKEN': localStorage.getItem('jwt')
        }
      };
      axios.post('http://localhost:8081/user/edit?userName=' + localStorage.getItem('username') + '&toEdit=LANGUAGE&newEntry=' + value, {}, config);
    }
    this.props.reRender();
  }

  updateComponents() {
    this.setProfileLinkIsInActive();
    this.refs["plantBag"].resetPlantBag();
    this.forceUpdate();
  }

  setProfileLinkIsInActive() {
    if (localStorage.getItem('username') == null || localStorage.getItem('username') == '') {
      this.setState({profileLinksInActive: 'true'});
    } else {
      this.setState({profileLinksInActive: 'false'});
    }
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    return (
      <div>
        <Menu ref="left" alignment="left">
          <MenuItem hash="first-page">PFLANZUNGEN</MenuItem>
          <MenuItem hash="/projects">PROJEKTFLÄCHEN</MenuItem>
          <MenuItem hash="/certificate/find">FINDEN</MenuItem>
          <MenuItem hash="5">GUTSCHEIN ERSTELLEN</MenuItem>
          <MenuItem hash="/gift/redeem">GUTSCHEIN EINLÖSEN</MenuItem>
          <MenuItem hash="/projectOffer">FLÄCHE ANBIETEN</MenuItem>
          <MenuItem hash="/ranking">BESTENLISTE</MenuItem>
          <MenuItem hash="/statistics">STATISTIKEN</MenuItem>
          <MenuItem hash="9">BLOG</MenuItem>
          <MenuItem hash="10">FAQs</MenuItem>
          <LanguageMenuItem language={this.state.language} updateLanguage={this.updateLanguage.bind(this)}/>
        </Menu>
        <Menu ref="right" alignment="right">
          <LoginMenuItem hash="login" updateNavbar={this.updateComponents.bind(this)} updateLanguage={this.updateLanguage.bind(this)}></LoginMenuItem>
          <MenuItem hash={"/user/" + localStorage.getItem('username')} inactive={this.state.profileLinksInActive}>MEIN PROFIL</MenuItem>
          <MenuItem hash="4" inactive={this.state.profileLinksInActive}>POSTFACH</MenuItem>
          <MenuItem hash={"/gifts/" + localStorage.getItem('username')} inactive={this.state.profileLinksInActive}>GUTSCHEINE</MenuItem>
          <MenuItem hash="6" inactive={this.state.profileLinksInActive}>ABONNEMENTS</MenuItem>
        </Menu>
        <nav id="navBar" className="navbar navbar-default navbar-fixed-top">
          <div className="navbar-left">
            <ImageButton text="MENU" onClick={this.showLeft.bind(this)} imagePath="/assets/images/Menu.png" imageWidth="20" imageHeight="20"/>
          </div>
          <div className="navbar-right myForrestDiv">
            <ImageButton text="MEIN WALD" onClick={this.showRight.bind(this)} imagePath="/assets/images/MeinWald.png" imageWidth="29" imageHeight="25"/>
          </div>
          <div className="container">
            <div className="navbar-left">
              <ImageButton text="" onClick={() => {
                this.linkTo('/')
              }} imagePath="/assets/images/ipat_logo.png" imageWidth="35" imageHeight="35"/>
            </div>
            <div className="collapse navbar-collapse" id="navbarLinkBar">
              <div className="navbar-left">
                <ImageButton text="" onClick={() => {
                  this.linkTo('/selfPlant')
                }} imagePath="/assets/images/Spaten.png" imageWidth="18" imageHeight="35"/>
                <ImageButton text="" onClick={() => {
                  this.linkTo('/plant/5')
                }} imagePath="/assets/images/Maus.png" imageWidth="35" imageHeight="35"/>
                <ImageButton text="" onClick={() => {
                  this.linkTo('/plant')
                }} imagePath="/assets/images/Schere.png" imageWidth="44" imageHeight="35"/>
              </div>
            </div>
            <div className="navbar-right">
              <PlantBag updatePlantBag={this.updatePlantBag.bind(this)} ref="plantBag"/>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
