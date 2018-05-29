import React, {
  Component
} from 'react';
import {
  Link,
  browserHistory
} from 'react-router';

import Menu from './Menu';
import MenuItem from './MenuItem';
import LanguageMenuItem from './LanguageMenuItem';
import PlantBag from './PlantBag';
import LoginMenuItem from './LoginMenuItem';
import UserDetails from './UserDetails';
import BackOfficeMenuItem from './BackOfficeMenuItem';
import SvgButton from '../components/SvgButton';
import axios from 'axios';

require('./navbar.less');
require('./menu.less');

export default class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      language: (localStorage.getItem('language') == null ?
        'DEUTSCH' :
        localStorage.getItem('language')),
      userDetails: {
        co2Data: {}
      }
    };
  }

  componentDidMount() {
    this.isLoggedIn();
    localStorage.setItem('language', this.state.language);
  }

  showLeft() {
    this.refs.left.show();
  }

  showRight() {
    this.refs.right.show();
  }

  updatePlantBagFromLocaleStorage() {
    this.refs['plantBag'].updatePlantBagFromLocaleStorage();
  }

  updatePlantBag(price, projectItems, projectName, isGift) {
    localStorage.setItem('isGift', isGift);
    this.refs['plantBag'].updatePlantBag(price, projectItems, projectName);
  }

  resetPlantBag() {
    this.refs['plantBag'].resetPlantBag();
  }

  updateLanguage(value) {
    localStorage.setItem('language', value);
    this.setState({
      language: value
    });
    if (localStorage.getItem('jwt') != null && localStorage.getItem('jwt') != '') {
      var config = {
        headers: {
          'X-AUTH-TOKEN': localStorage.getItem('jwt')
        }
      };
      axios.post('http://localhost:8081/user/edit?userName=' + localStorage.getItem('username') + '&toEdit=LANGUAGE&newEntry=' + value, {}, config);
    }
    if (value == 'DEUTSCH') {
      this.props.switchLocale('de');
    } else if (value == 'ENGLISH') {
      this.props.switchLocale('en');
    }
  }

  updateComponents() {
    this.isLoggedIn();
    this.props.reRender();
  }

  isLoggedIn() {
    if (localStorage.getItem('username') == null || localStorage.getItem('username') == '') {
      this.setState({
        isLoggedIn: false,
        userDetails: {
          co2Data: {}
        }
      });
    } else {
      let userDetails;
      if(localStorage.getItem('userDetails') && localStorage.getItem('userDetails') != ''){
        userDetails = JSON.parse(localStorage.getItem('userDetails'));
      }else{
        userDetails = {co2Data: {}};
      }
      this.setState({
        isLoggedIn: true,
        userDetails: userDetails
      });
    }
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    let myForrestButton;
    let userDetails;
    if (this.state.isLoggedIn) {
      myForrestButton = <div className="navbar-right myForrestDiv">
        <SvgButton text="MEIN WALD" buttonType="trees" onClick={this.showRight.bind(this)} />
      </div>;
      userDetails = <UserDetails user={this.state.userDetails} updateNavbar={this.updateComponents.bind(this)}/>;
    } else {
      myForrestButton = '';
      userDetails = <div className="user-details logged-out"> <a className="pull left" onClick={this.showRight.bind(this)}>Login</a>  <a className="pull right" onClick={() => {
        this.linkTo('/registration');
      }}>Registrieren</a></div>;
    }

    return (
      <div>
        <Menu ref="left" alignment="left">
          <MenuItem hash="/projects">Projekte</MenuItem>
          <MenuItem hash="/ranking">Bestenliste</MenuItem>
          <MenuItem hash="/certificate/find">Pflanzungen finden</MenuItem>
          <MenuItem hash={'/gift/redeem'}>Gutschein einlösen</MenuItem>
          <MenuItem hash="/co2Calculator">CO<sub>2</sub>-Rechner</MenuItem>
          <MenuItem hash="/statistics">Zahlen & Fakten</MenuItem>
          <MenuItem hash="/projectOffer">Fläche anbieten</MenuItem>
          <MenuItem hash="/blog">Blog</MenuItem>
          <MenuItem hash="/faq">FAQs</MenuItem>
          <LanguageMenuItem language={this.state.language} updateLanguage={this.updateLanguage.bind(this)}/>
        </Menu>
        <Menu ref="right" alignment="right">
          <LoginMenuItem hash="login" updateNavbar={this.updateComponents.bind(this)} updateLanguage={this.updateLanguage.bind(this)}></LoginMenuItem>
          <MenuItem hash={'/user/' + localStorage.getItem('username')} inactive={!this.state.isLoggedIn}>Mein Profil</MenuItem>
          <MenuItem hash={'/tools/' + localStorage.getItem('username')} inactive={!this.state.isLoggedIn}>Tools</MenuItem>
          <MenuItem hash={'/gifts/' + localStorage.getItem('username')} inactive={!this.state.isLoggedIn}>Gutscheine</MenuItem>
          <MenuItem hash={'/receipts/' + localStorage.getItem('username')} inactive={!this.state.isLoggedIn}>Spendenquittungen</MenuItem>
          <BackOfficeMenuItem hash="/backOffice">Backoffice</BackOfficeMenuItem>
        </Menu>
        <nav id="navBar" className="navbar navbar-default navbar-fixed-top">
          <div className="navbar-left">
            <SvgButton text="MENÜ" buttonType="hamburger" onClick={this.showLeft.bind(this)} />
          </div>
          {myForrestButton}
          <div className="container">
            <div className="collapse navbar-collapse" id="navbarLinkBar">
              <div className="navbar-left">
                <SvgButton text="" buttonType="ipatlogo" onClick={() => {
                  this.linkTo('/');
                }} />
                <SvgButton text="" buttonType="shovel" onClick={() => {
                  this.linkTo('/selfPlant');
                }} />
                <SvgButton text="" buttonType="mouse" onClick={() => {
                  this.linkTo('/plant/5');
                }} />
                <SvgButton text="" buttonType="secateurs" onClick={() => {
                  this.linkTo('/treeService');
                }} />
              </div>
            </div>
            <div className="navbar-right">
              {userDetails}
              <PlantBag updatePlantBag={this.updatePlantBag.bind(this)} ref="plantBag"/>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
