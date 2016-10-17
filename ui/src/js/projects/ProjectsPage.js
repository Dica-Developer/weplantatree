import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {
  browserHistory
} from 'react-router';

import NavBar from '../common/navbar/NavBar';
import Header from '../common/header/Header';
import Footer from '../common/Footer';
import IconButton from '../common/components/IconButton';

import CompletedProject from './CompletedProject';
import ActiveProject from './ActiveProject';

require("./projectsPage.less");

export default class ProjectsPage extends Component {

  constructor() {
    super();
    this.state = {
      completedProjects: {
        content: []
      },
      completeProjectsPageSize: 10,
      activeProjects: []
    };
  }

  componentDidMount() {
    this.getCompletedProjects();
    this.getActiveProjects();
  }

  moreCompletedProjects() {
    this.state.completeProjectsPageSize = this.state.completeProjectsPageSize + 5;
    this.forceUpdate();
    this.getCompletedProjects();
  }

  getCompletedProjects() {
    var that = this;
    axios.get('http://localhost:8081/reports/inActiveProjects?page=0&size=' + this.state.completeProjectsPageSize).then(function(response) {
      var result = response.data;
      that.setState({
        completedProjects: result
      });
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

  getActiveProjects() {
    var that = this;
    axios.get('http://localhost:8081/reports/activeProjects').then(function(response) {
      var result = response.data;
      that.setState({
        activeProjects: result
      });
    });
  }

  switchToOfferProjectPage() {
    browserHistory.push('/projectOffer');
  }

  render() {
    var moreCompletedProjectsButton;
    if (!this.state.completedProjects.last) {
      moreCompletedProjectsButton = <IconButton text="" glyphIcon="glyphicon-chevron-down" onClick={this.moreCompletedProjects.bind(this)}/>;
    } else {
      moreCompletedProjectsButton = '';
    }

    return (
      <div>
        <NavBar ref="navbar" reRender={this.props.routes[0].reRender.bind(this)}/>
        <Header/>
        <div className="container paddingTopBottom15">
          <div className="row projectsPage">
            <div className="col-md-12">
              <h2>Projektflächen</h2>
              <div className="active-projects">
                <h3>laufende Projekte</h3>
                  {this.state.activeProjects.map(function(project, i) {
                    return (<ActiveProject project={project} key={i} />);
                  })}
                <div className="align-center border-top">
                  {moreCompletedProjectsButton}
                </div>
              </div>
              <div className="completed-projects">
                <h3>abgeschlossene Projekte</h3>
                  {this.state.completedProjects.content.map(function(project, i) {
                    return (<CompletedProject project={project} key={i} />);
                  })}
                <div className="align-center border-top">
                  {moreCompletedProjectsButton}
                </div>
              </div>
              <div className="bottom">Dir stehen Flächen zur Verfügung und Du hast Interesse daran, dass I Plant a Tree diese bepflanzt?
                <br/>
                Hier kanns Du eine&nbsp;
                <IconButton glyphIcon="glyphicon-forward" text="PROJEKTFLÄCHE ANBIETEN" onClick={this.switchToOfferProjectPage.bind(this)}/>
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