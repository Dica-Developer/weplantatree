import React, {Component} from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import {browserHistory} from 'react-router';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';

import PlantBagProject from './PlantBagProject';
import PlantBagItem from './PlantBagItem';
import IconButton from '../common/components/IconButton';
import CheckBox from '../common/components/CheckBox';
import Notification from '../common/components/Notification';
import LoadingSpinner from '../common/components/LoadingSpinner';

import {getTextForSelectedLanguage} from '../common/language/LanguageHelper';

require('./plantBagPage.less');

export default class PlantBagPage extends Component {

  constructor(props) {
    super(props);
    var isGift = (localStorage.getItem('isGift') === 'undefined')
      ? false
      : JSON.parse(localStorage.getItem('isGift'));
    var plantBag = (localStorage.getItem('plantBag') === 'undefined')
      ? {
        projects: []
      }
      : JSON.parse(localStorage.getItem('plantBag'));
    let isAnonymUser = !(localStorage.getItem('jwt') != null && localStorage.getItem('jwt') != '');
    this.state = {
      plantBag: plantBag,
      isGift: isGift,
      isAnonymUser: isAnonymUser
    };
  }

  switchTOPaymentPage() {
    var that = this;
    var config;
    if (!this.state.isAnonymUser) {
      config = {
        headers: {
          'X-AUTH-TOKEN': localStorage.getItem('jwt')
        }
      };
    } else {
      config = {
        headers: {
          'X-AUTH-TOKEN': 'anonym-user'
        }
      };
    }
    if (this.state.isGift) {
      if (!this.state.isAnonymUser) {
        this.createGift(config);
      } else {
        this.refs.notification.addNotification('Kein Nutzer angemeldet!', 'Anonymen Nutzern ist es leider nicht gestattet, Gutscheine zu erstellen.', 'error');
      }
    } else {
      this.createCart(config);
    }
  }

  createGift(config) {
    this.refs['spinner'].showSpinner();
    var that = this;
    localStorage.setItem('plantBag', JSON.stringify(this.state.plantBag));
    axios.post('http://localhost:8081/gift/create', this.state.plantBag, config).then(function(response) {
      that.refs['spinner'].hideSpinner();
      browserHistory.push('/payGift/' + response.data[0] + '/' + response.data[1]);
    }).catch(function(response) {
      that.refs['spinner'].hideSpinner();
      that.refs.notification.handleError(error);
    });
  }

  createCart(config) {
    this.refs['spinner'].showSpinner();
    var that = this;
    localStorage.setItem('plantBag', JSON.stringify(this.state.plantBag));
    axios.post('http://localhost:8081/donateTrees', this.state.plantBag, config).then(function(response) {
      that.refs['spinner'].hideSpinner();
      browserHistory.push('/payCart/' + response.data);
    }).catch(function(response) {
      that.refs['spinner'].hideSpinner();
      that.refs.notification.handleError(error);
    });
  }

  removePlantBagItem(project, plantItem) {
    delete this.state.plantBag.projects[project].plantItems[plantItem];
    this.forceUpdate();
    if (Object.keys(this.state.plantBag.projects[project].plantItems).length === 0) {
      delete this.state.plantBag.projects[project];
      this.forceUpdate();
    }
    this.calcPriceAndUpdatePlantBag();
  }

  increasePlantBagItem(project, plantItem) {
    this.state.plantBag.projects[project].plantItems[plantItem].amount++;
    this.forceUpdate();
    this.calcPriceAndUpdatePlantBag();
  }

  decreasePlantBagItem(project, plantItem) {
    this.state.plantBag.projects[project].plantItems[plantItem].amount--;
    this.forceUpdate();
    if (this.state.plantBag.projects[project].plantItems[plantItem].amount == 0) {
      delete this.state.plantBag.projects[project].plantItems[plantItem];
      if (Object.keys(this.state.plantBag.projects[project].plantItems).length === 0) {
        delete this.state.plantBag.projects[project];
        this.forceUpdate();
      }
      this.forceUpdate();
    }
    this.calcPriceAndUpdatePlantBag();
  }

  calcPriceAndUpdatePlantBag() {
    var price = 0;
    for (var project in this.state.plantBag.projects) {
      for (var plantItem in this.state.plantBag.projects[project].plantItems) {
        price = price + this.state.plantBag.projects[project].plantItems[plantItem].price * this.state.plantBag.projects[project].plantItems[plantItem].amount;
      }
    }
    this.state.plantBag.price = price;
    this.forceUpdate();
    localStorage.setItem('plantBag', JSON.stringify(this.state.plantBag));
    this.props.route.updatePlantBag();
  }

  updateValue(toUpdate, value) {
    this.setState({[toUpdate]: value});
    if (toUpdate == 'isGift') {
      localStorage.setItem('isGift', value);
    }
  }

  render() {
    var that = this;
    var overallPriceAndPayment;
    if (this.state.plantBag.price > 0) {
      overallPriceAndPayment = <div><div className="doubledLine"/>
        <div className="overallPrice">
          GESAMT:&nbsp;{Accounting.formatNumber(this.state.plantBag.price / 100, 2, '.', ',')}&nbsp;€
        </div>
        <div className="align-right">
          <CheckBox toUpdate="isGift" value={this.state.isGift} updateValue={this.updateValue.bind(this)} text="Als Geschenkgutschein"/><br/>
          <IconButton glyphIcon="glyphicon-euro" text="WEITER ZUR KASSE" onClick={this.switchTOPaymentPage.bind(this)}/>
        </div>
      </div>;
    } else {
      overallPriceAndPayment = <div>Es befinden sich keine Bäume in deinem Pflanzkorb.</div>;
    }

    return (
      <div className="container paddingTopBottom15">
        <div className="row plantBagPage">
          <div className="col-md-12">
            <h1>Dein Pflanzkorb</h1>
            <div className={'panel panel-warning ' + (!this.state.isAnonymUser
              ? 'no-display'
              : '')}>
              <div className="panel-heading">Du bis nicht eingeloggt</div>
              <div className="panel-body">Du bist nicht als registrierter User eingeloggt. Deine Pflanzung geschieht anonym.</div>
            </div>
            <div className="overview">
              {Object.keys(this.state.plantBag.projects).map(function(project, i) {
                var projectPrice = 0;
                for (var plantItem in that.state.plantBag.projects[project].plantItems) {
                  projectPrice = projectPrice + (that.state.plantBag.projects[project].plantItems[plantItem].amount * that.state.plantBag.projects[project].plantItems[plantItem].price);
                }
                return (
                  <PlantBagProject projectName={project} plantItems={that.state.plantBag.projects[project].plantItems} key={i} price={projectPrice}>
                    {Object.keys(that.state.plantBag.projects[project].plantItems).map(function(plantItem, i) {
                      var plantItemName = getTextForSelectedLanguage(plantItem);
                      return (<PlantBagItem plantItemName={plantItemName} plantBagitem={that.state.plantBag.projects[project].plantItems[plantItem]} key={i} removePlantBagItem={() => {
                        that.removePlantBagItem(project, plantItem);
                      }} increasePlantBagItem={() => {
                        that.increasePlantBagItem(project, plantItem);
                      }} decreasePlantBagItem={() => {
                        that.decreasePlantBagItem(project, plantItem);
                      }}/>);
                    })}
                  </PlantBagProject>
                );
              })}
              {overallPriceAndPayment}
            </div>
          </div>
        </div>
        <LoadingSpinner ref="spinner"/>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
