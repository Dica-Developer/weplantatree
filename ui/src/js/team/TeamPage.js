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
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import TeamDetails from './TeamDetails';
import EditTeamDetails from './EditTeamDetails';
import TeamMember from './TeamMember';
import LargeRankingContainer from '../common/ranking/LargeRankingContainer';
import RankingItem from '../common/ranking/RankingItem';
import RankingItemContent from '../common/ranking/content/AmountProjectDate';
import NoTreesAvailable from '../common/ranking/NoTreesAvailable';
import Notification from '../common/components/Notification';
import NotificationSystem from 'react-notification-system';

require('./team.less');

export default class TeamPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      team: {
        co2Data: {}
      },
      newestPlantRanking: {
        content: []
      },
      pageCount: 0,
      teamMember: {
        content: []
      },
      edit: false
    };
  }

  componentDidMount() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    this.loadTeamDetails();

    axios.get('http://localhost:8081/trees/team?teamName=' + encodeURIComponent(this.props.params.teamName) + '&page=0&size=15').then(function(response) {
      var result = response.data;
      that.setState({
        newestPlantRanking: result
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
    this.loadTeamMember();
  }

  loadTeamDetails() {
    var that = this;
    axios.get('http://localhost:8081/team?teamName=' + encodeURIComponent(this.props.params.teamName)).then(function(response) {
      var result = response.data;
      that.setState({
        team: result
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

  loadTeamMember() {
    var that = this;
    axios.get('http://localhost:8081/team/member?teamName=' + encodeURIComponent(this.props.params.teamName) + '&page=0&size=5').then(function(response) {
      var result = response.data;
      that.setState({
        teamMember: result
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

  callNextPage() {
    var newPage = this.state.pageCount + 1;
    this.callPage(newPage);
    this.setState({
      pageCount: newPage
    });
  }

  callPreviousPage() {
    var newPage = this.state.pageCount - 1;
    this.callPage(newPage);
    this.setState({
      pageCount: newPage
    });
  }

  callPage(page) {
    var that = this;
    axios.get('http://localhost:8081/trees/team/' + this.props.params.teamName + '?page=' + page + '&size=15').then(function(response) {
      var result = response.data;
      that.setState({
        newestPlantRanking: result
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

  editTeam(value) {
    this.setState({
      edit: value
    });
  }

  createDeleteSuccessMessageAndSwitchToProfile() {
    this.refs.notificationSystem.addNotification({
      title: counterpart.translate('TEAM_DELETED_TITLE'),
      position: 'tc',
      autoDismiss: 0,
      message: counterpart.translate('TEAM_DELETED_MESSAGE') + '\n' + counterpart.translate('YOUR_ARE_ROUTED_TO_PROFILE'),
      level: 'success',
      children: (
        <div className="delete-confirmation align-center">
              <button onClick={() => {
                browserHistory.push('/user/' + localStorage.getItem('username'));
              }}>OK</button>
            </div>
      )
    });
  }

  createSuccessMessageAndReloadPage(teamName){
    browserHistory.push('/team/' + teamName);
  }

  render() {
    var teamDetails;
    var treePart;
    var page = this.state.pageCount;

    if (this.state.edit) {
      teamDetails = <EditTeamDetails team={this.state.team} editTeam={this.editTeam.bind(this)} loadTeamDetails={this.loadTeamDetails.bind(this)} teamNameChangedAction={this.createSuccessMessageAndReloadPage.bind(this)} />;
    } else {
      teamDetails = <TeamDetails team={this.state.team} editTeam={this.editTeam.bind(this)} deleteAction={this.createDeleteSuccessMessageAndSwitchToProfile.bind(this)} loadTeamMember={this.loadTeamMember.bind(this)}/>;
    }

    if (this.state.newestPlantRanking.numberOfElements != 0) {
      treePart = <LargeRankingContainer styleClass="teamRanking" callPreviousPage={this.callPreviousPage.bind(this)} callNextPage={this.callNextPage.bind(this)} isFirstPage={this.state.newestPlantRanking.first} isLastPage={this.state.newestPlantRanking.last}>
        {this.state.newestPlantRanking.content.map(function(content, i) {
          let imageUrl;
          if (content.imagePath != null && content.imagePath != '') {
            imageUrl = 'http://localhost:8081/tree/image/' + content.imagePath + '/60/60';
          } else {
            imageUrl = 'http://localhost:8081/treeType/image/' + content.treeType.imageFile + '/60/60';
          }
          let linkTo = '/projects/' + content.projectArticle.project.name;
          return (<RankingItem imageUrl={imageUrl} rankNumber={page * 15 + (i + 1)} key={i} showRankNumber="true" showName="true"  linkTo={linkTo}>
          <RankingItemContent content={content}/>
          </RankingItem>
        );
        })}
      </LargeRankingContainer>;
    } else {
      treePart = <NoTreesAvailable/>;
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
      <div className="container paddingTopBottom15 teamPage">
        <div className="row details">
          <div className="col-md-6 ">
            {teamDetails}
          </div>
          <div className="col-md-6">
            <TeamMember teamMember={this.state.teamMember}/>
          </div>
        </div>
        <div className="row">
          {treePart}
        </div>
        <NotificationSystem ref="notificationSystem" style={style}/>
        <Notification ref="notification"/>
      </div>
    );
  }
}
