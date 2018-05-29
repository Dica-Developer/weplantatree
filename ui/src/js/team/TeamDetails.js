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
import {
  htmlDecode
} from '../common/language/HtmlHelper';
import IconButton from '../common/components/IconButton';
import Notification from '../common/components/Notification';
import NotificationSystem from 'react-notification-system';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import Boostrap from 'bootstrap';

export default class TeamDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTeamAdmin: false,
      isTeamMember: false
    };
    if(this.props.team.teamId){
      this.checkIfTeamAdmin(this.props.team.teamId);
      this.checkIfTeamMember(this.props.team.teamId);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.team.teamId){
      this.checkIfTeamAdmin(nextProps.team.teamId);
      this.checkIfTeamMember(nextProps.team.teamId);
    }
  }


  switchToTeamPage() {
    browserHistory.push('/team/' + this.props.team.teamName);
  }

  checkIfTeamAdmin(teamId) {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/team/isAdmin?teamId=' + teamId, config).then(function(response) {
      var result = response.data;
      that.setState({
        isTeamAdmin: result
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

  checkIfTeamMember(teamId) {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/team/isMember?teamId=' + teamId, config).then(function(response) {
      var result = response.data;
      that.setState({
        isTeamMember: result
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

  deleteTeam() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.delete('http://localhost:8081/team/delete?teamId=' + this.props.team.teamId, config).then(function(response) {
      that.props.deleteAction();
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

  editTeam() {
    this.props.editTeam(true);
  }

  joinTeam() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.post('http://localhost:8081/team/join?teamId=' + this.props.team.teamId, {}, config).then(function(response) {
      that.refs.notification.addNotification('Team beigetreten', 'Du bist dem Team beigetreten.', 'success');
      that.setState({
        isTeamMember: true
      });
      that.props.loadTeamMember();
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

  leaveTeam() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.post('http://localhost:8081/team/leave', {}, config).then(function(response) {
      that.refs.notification.addNotification('Team verlassen', 'Du hast dein Team verlassen, deine Mitglieder werden dich vermissen.', 'success');
      that.props.loadTeamMember();
      that.setState({
        isTeamMember: false
      });
      that.forceUpdate();
    }).catch(function(response) {
      console.error(response);
      that.refs.notification.addNotification('Team verlassen fehlgeschlagen', 'Beim verlassen des Teams ist ein Fehler aufgetreten, bitte versuche es noch einmal.', 'error');
    });
  }

  createDeleteConfirmation() {
    this.refs.notificationSystem.addNotification({
      title: counterpart.translate('TEAM_DELETE_CONFIRMATION_TITLE'),
      position: 'tc',
      autoDismiss: 0,
      message: counterpart.translate('ARE_YOU_SURE'),
      level: 'warning',
      children: (
        <div className="delete-confirmation align-center">
              <button>Nein</button>
              <button onClick={() => {
                this.deleteTeam();
              }}>Ja</button>
            </div>
      )
    });
  }

  createLeaveConfirmation() {
    this.refs.notificationSystem.addNotification({
      title: counterpart.translate('TEAM_LEAVE_CONFIRMATION_TITLE'),
      position: 'tc',
      autoDismiss: 0,
      message: counterpart.translate('ARE_YOU_SURE'),
      level: 'warning',
      children: (
        <div className="delete-confirmation align-center">
              <button>Nein</button>
              <button onClick={() => {
                this.leaveTeam();
              }}>Ja</button>
            </div>
      )
    });
  }

  render() {
    let teamImageUrl;
    if (this.props.team.teamName) {
      teamImageUrl = 'http://localhost:8081/team/image/' + this.props.team.teamId + '/150/150';
    }

    let buttons = '';
    if (this.state.isTeamAdmin) {
      buttons = <div><IconButton text={counterpart.translate('TEAM_EDIT')} glyphIcon="glyphicon-cog" onClick={this.editTeam.bind(this)}/> <IconButton text="Team löschen" glyphIcon="glyphicon-remove" onClick={this.createDeleteConfirmation.bind(this)}/></div>;
    } else if (!this.state.isTeamMember) {
      buttons = <div><IconButton text={counterpart.translate('TEAM_JOIN')} glyphIcon="glyphicon-share-alt" onClick={this.joinTeam.bind(this)}/></div>;
    } else if (this.state.isTeamMember) {
      buttons = <div><IconButton text={counterpart.translate('TEAM_LEAVE')} glyphIcon="glyphicon-remove" onClick={this.createLeaveConfirmation.bind(this)}/></div>;
    }

    var style = {
      Containers: {
        DefaultStyle: {
          zIndex: 11000
        },
        tc: {
          top: '50%',
          bottom: 'auto',
          margin: '0 auto',
          left: '50%'
        }
      }
    };
    return (
      <div >
        <h1>Team</h1>
        <div className="imageDiv">
          <img src={teamImageUrl} alt="profile"/>
        </div>
        <p className="teamName" onClick={this.switchToTeamPage.bind(this)}>{htmlDecode(this.props.team.teamName)}</p>
        <div className="stats">
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="bold">Rang:&nbsp;</span>{this.props.team.rank}
                </td>
                <td>
                  <span className="bold">gegründet:&nbsp;</span>{moment(this.props.team.regDate).format('DD.MM.YYYY')}</td>
              </tr>
              <tr>
                <td>
                  <span className="bold">B&auml;ume gepflanzt:&nbsp;</span>{Accounting.formatNumber(this.props.team.co2Data.treesCount, 0, '.', ',')}</td>
                <td>
                  <span className="bold">Teamleiter:&nbsp;</span>{htmlDecode(this.props.team.adminName)}</td>
              </tr>
              <tr>
                <td>
                  <span className="bold">CO<sub>2</sub>&nbsp;gebunden:&nbsp;</span>{Accounting.formatNumber(this.props.team.co2Data.co2, 3, '.', ',')}&nbsp;t</td>
                <td>
                  <span className="bold">Mitglieder:&nbsp;</span>{this.props.team.memberCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="teamDesc">
          <p>
            <i>{htmlDecode(this.props.team.description)}</i>
          </p>
        </div>
        <div className="align-center teamButtons">
          {buttons}
        </div>
        <NotificationSystem ref="notificationSystem" style={style}/>
        <Notification ref="notification"/>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
