import axios from 'axios';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import {
  Link,
  browserHistory
} from 'react-router';
import moment from 'moment';
import Accounting from 'accounting';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import {
  htmlDecode
} from '../common/language/HtmlHelper';
import IconButton from '../common/components/IconButton';

import EditImageItem from '../profile/edit/EditImageItem';
import EditItem from '../profile/edit/EditItem';
import Notification from '../common/components/Notification';

import Boostrap from 'bootstrap';

export default class CreateTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: {}
    };
  }

  createTeam() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.post('http://localhost:8081/team/create', this.state.team, config).then(function(response) {
      that.props.teamCreatedAction(that.state.team.name);
    }).catch(function(error) {
      that.refs.notification.handleError(error);
    });
  }

  editTeam(toEdit, event) {
    this.state.team[toEdit] = event.target.value;
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h1>{counterpart.translate('TEAM_CREATE')}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 form-group">
            <label htmlFor="team_name">{counterpart.translate('TEAM_NAME')}:</label>
            <input type="text" className="form-control" id="team_name" placeholder="" onBlur={(e) => this.editTeam('name', e)}/>
          </div>
          <div className="col-md-12 form-group">
            <label htmlFor="team_description">{counterpart.translate('TEAM_DESCRIPTION')}:</label>
            <textarea className="form-control" rows="10" id="team_description" onBlur={(e) => this.editTeam('description', e)}/>
          </div>
        </div>
        <div className="row align-center bottomButton">
          <IconButton text={counterpart.translate('TEAM_CREATE')} glyphIcon="glyphicon glyphicon-plus" onClick={this.createTeam.bind(this)}/>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
