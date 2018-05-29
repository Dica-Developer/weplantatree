import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';

import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid';

import SvgButton from '../../common/components/SvgButton';
import Notification from '../../common/components/Notification';
import BottomPart from '../../planting/BottomPart';
import Project from '../../planting/customPlantPage/Project';
import {getConfig} from '../../common/RestHelper';
import VirtualizedSelect from 'react-virtualized-select';

require('./plantManager.less');

export default class PlantManager extends Component {

  constructor() {
    super();
    this.state = {
      users: [],
      selectedUserId: null,
      projects: [],
      overallPrice: 0,
      restConfig: getConfig()
    };
    this.updatePrice = this.updatePrice.bind(this);
  }

  componentDidMount() {
    var that = this;
    this.loadUser();
    this.loadProjects();
  }

  loadProjects(){
    var that = this;
    axios.get('http://localhost:8081/reports/activeProjects').then(function(response) {
      var result = response.data;
      that.setState({projects: result});
      that.forceUpdate();
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden der aktiven Projekte!', response.data + response.message, 'error');
    });
  }

  loadUser() {
    var that = this;
    axios.get('http://localhost:8083/users', this.state.restConfig).then(function(response) {
      var result = response.data;
      that.createValueLabelPairsForUser(result);
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden der Nutzer!', response.data + response.message, 'error');
    });
  }

  createValueLabelPairsForUser(users) {
    var options = [];
    for (var user in users) {
      var option = {
        value: users[user].id,
        label: users[user].name
      };
      options.push(option);
    }
    this.setState({users: options});
  }

  updatePrice() {
    var price = 0;
    for (var project in this.state.projects) {
      price = price + parseInt(this.refs['project_' + project].getPrice());
    }
    this.state.overallPrice = price;
    this.forceUpdate();
  }

  updatePlantBag() {
    for (var project in this.state.projects) {
      var projectItems = {};
      var updateProject = false;
      for (var article in this.refs['project_' + project].getArticles()) {
        if (this.refs['project_' + project].getArticleValue(article) != null && this.refs['project_' + project].getArticleValue(article) > 0) {
          projectItems[this.refs['project_' + project].getArticles()[article].treeType.name] = {
            amount: parseInt(this.refs['project_' + project].getArticleValue(article)),
            price: parseInt(this.refs['project_' + project].getArticles()[article].price.priceAsLong),
            imageFile: this.refs['project_' + project].getArticles()[article].treeType.imageFile
          };
          updateProject = true;
        }
      }
      if (updateProject) {
        this.props.route.updatePlantBag(this.refs['project_' + project].getPrice(), projectItems, this.state.projects[project].projectName, this.props.route.isGift);
      }
    }
  }

  plantForUser() {
    var that = this;
    this.updatePlantBag();
    var plantBag = JSON.parse(localStorage.getItem('plantBag'));
    var request = {
      amountOfPlantBags: 1,
      cartState: 'VERIFIED',
      userId: this.state.selectedUserId,
      plantBag: plantBag
    };

    var config = getConfig();
    axios.post('http://localhost:8081/plantForUser/', request, config).then(function(response) {
      that.refs.notification.addNotification('Bäume wurden für den Nutzer gepflant!', '', 'success');
    }).catch(function(response) {
      that.refs.notification.addNotification('Ein Fehler ist aufgetreten!', '', 'error');
    });
  }

  selectUser(user) {
    this.setState({selectedUserId: user.id});
  }

  render() {
    var that = this;
    return (
      <div className="container paddingTopBottom15 plantManager">
        <div className="row ">
          <h1>Pflanzen</h1>
          <div className="col-md-4">
            <label className="select-label">User</label>
          </div>
          <div className="col-md-8">
            <VirtualizedSelect name="user-select" value={this.state.selectedUserId} options={this.state.users} onChange={this.selectUser.bind(this)}/>
          </div>
          <div className="col-md-12">
            <div>
              {this.state.projects.map(function(project, i) {
                return (<Project key={i} project={project} ref={'project_' + i} updatePrice={that.updatePrice.bind(this)}/>);
              })}
            </div>
          </div>
          <div className="col-md-12 plant-div">
            <div className="price">
              <span>GESAMT:&nbsp;{Accounting.formatNumber(this.state.overallPrice / 100, 2, '.', ',')}&nbsp;€</span>
            </div>
            <SvgButton text="PFLANZEN" buttonType="barrow" onClick={this.plantForUser.bind(this)} />
          </div>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
