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

import IconButton from '../../common/components/IconButton';
import {getConfig} from '../../common/RestHelper';
import NotificationSystem from 'react-notification-system';

require('./projectOverview.less');

export default class ProjectOverview extends Component {

  constructor() {
    super();
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.loadProjects();
  }

  loadProjects() {
    var that = this;
    var config = getConfig();
    axios.get('http://localhost:8083/projects', config).then(function(response) {
      var result = response.data;
      that.setState({
        projects: result
      });
    }).catch(function(response) {
      that.refs.notification.addNotification('Fehler beim Laden der Projekte!', response.data + response.message, 'error');
    });
  }

  createProject() {
    browserHistory.push('/project-edit/new');
  }

  editProject(id) {
    browserHistory.push('/project-edit/' + id);
  }

  render() {
    var that = this;
    return (
      <div className="container paddingTopBottom15 projectOverview">
          <div className="row ">
            <div className="col-md-12">
              <h1>Projekte</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 project">
              <IconButton glyphIcon="glyphicon-plus" text="NEUES PROJEKT ERSTELLEN" onClick={this.createProject.bind(this)}/>
            </div>
          </div>
          <div className="row">
            {this.state.projects.map(function(project, i) {
              return (<div className="col-md-4 project" key={i}>
                        <p>{project.name}</p>
                        <IconButton glyphIcon="glyphicon-pencil" text="" onClick={() => {that.editProject(project.id);}}/>
                      </div>);
            })}
          </div>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
