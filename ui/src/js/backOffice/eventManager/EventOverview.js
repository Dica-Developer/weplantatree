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
import {
  getConfig
} from '../../common/RestHelper';
import Notification from '../../common/components/Notification';

require('./eventOverview.less');

export default class EventOverview extends Component {

  constructor() {
    super();
    this.state = {
      events: []
    };
  }

  componentDidMount() {
    this.loadEvents();
  }

  loadEvents() {
    var that = this;
    var config = getConfig();
    axios.get('http://localhost:8083/events', config).then(function(response) {
      var result = response.data;
      that.setState({
        events: result
      });
    }).catch(function(response) {
      console.error(response);
      that.refs.notification.addNotification('Fehler beim Laden der Events!', response.data + response.message, 'error');
    });
  }

  createEvent() {
    browserHistory.push('/event/new');
  }

  editEvent(id) {
    browserHistory.push('/event/' + id);
  }

  render() {
    var that = this;
    return (
      <div className="container paddingTopBottom15 eventOverview">
          <div className="row ">
            <div className="col-md-12">
              <h1>Events</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 project">
              <IconButton glyphIcon="glyphicon-plus" text="NEUES EVENT ERSTELLEN" onClick={this.createEvent.bind(this)}/>
            </div>
          </div>
          <div className="row">
            {this.state.events.map(function(ev, i) {
              return (<div className="col-md-4 event" key={i}>
                        <p>{ev.name}</p>
                        <IconButton glyphIcon="glyphicon-pencil" text="" onClick={() => {that.editEvent(ev.id);}}/>
                      </div>);
            })}
          </div>
          <Notification ref="notification"/>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
