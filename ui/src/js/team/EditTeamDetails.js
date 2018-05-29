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

export default class EditTeamDetails extends Component {
  constructor(props) {
    super(props);
  }

  uploadImage(file) {
    var data = new FormData();
    data.append('teamId', this.props.team.teamId);
    data.append('file', file);
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.post('http://localhost:8081/team/image/upload', data, config).then(function(response) {
      that.refs.notification.addNotification(counterpart.translate('EDIT_SUCCES_TITLE'), counterpart.translate('EDIT_SUCCES_MESSAGE'), 'success');
    }).catch(function(error) {
      that.refs.notification.handleError(error);
    });
  }

  leaveEditMode() {
    this.props.editTeam(false);
  }

  editTeam(toEdit, event) {
    var that = this;
    var toEditGlobal = toEdit;
    var newEntry = event.target.value;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.post('http://localhost:8081/team/edit?teamId=' + this.props.team.teamId + '&toEdit=' + toEditGlobal + '&newEntry=' + newEntry, {}, config).then(function(response) {
      // that.refs.notification.addNotification(counterpart.translate('EDIT_SUCCES_TITLE'), counterpart.translate('EDIT_SUCCES_MESSAGE'), 'success');
      if (toEditGlobal === 'name'){
        that.props.teamNameChangedAction(newEntry);
      }else{
        that.props.loadTeamDetails();
      }
    }).catch(function(error) {
      that.refs.notification.handleError(error);
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h1>{counterpart.translate('TEAM_EDIT')}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 form-group">
            <label htmlFor="team_name">{counterpart.translate('TEAM_NAME')}:</label>
            <input type="text" className="form-control" id="team_name" placeholder="" defaultValue={this.props.team.teamName} onBlur={(e) => this.editTeam('name', e)}/>
          </div>
          <div className="col-md-12 form-group">
            <label htmlFor="team_description">{counterpart.translate('TEAM_DESCRIPTION')}:</label>
            <textarea className="form-control" rows="10" id="team_description" onBlur={(e) => this.editTeam('description', e)} defaultValue={this.props.team.description}/>
          </div>
          <div className="col-md-12">
            <EditImageItem uploadImage={this.uploadImage.bind(this)}/>
          </div>
        </div>
        <div className="row align-center bottomButton">
          <IconButton text="Anschauen" glyphIcon="glyphicon-eye-open" onClick={this.leaveEditMode.bind(this)}/>
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
