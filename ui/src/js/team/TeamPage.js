import axios from 'axios';
import counterpart from 'counterpart';
import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import { browserHistory } from 'react-router';
import he from 'he';
import Notification from '../common/components/Notification';
import { createProfileImageUrl, createTeamImageUrl } from '../common/ImageHelper';
import RankingContentNameAmountCo2 from '../common/ranking/content/NameAmountCo2';
import RankingItemContent from '../common/ranking/content/AmountProjectDate';
import LargeRankingContainer from '../common/ranking/LargeRankingContainer';
import NoTreesAvailable from '../common/ranking/NoTreesAvailable';
import RankingItem from '../common/ranking/RankingItem';
import SmallRankingContainer from '../common/ranking/SmallRankingContainer';
import EditTeamDetails from './EditTeamDetails';
import TeamDetails from './TeamDetails';
import TeamMember from './TeamMember';

require('./team.less');

class Member extends Component {
  constructor(props) {
    super(props);
  }

  linkToProfile(){
    browserHistory.push('/user/' + encodeURIComponent(this.props.member.name));
  }

  render() {
    let imageUrl = createProfileImageUrl(this.props.member.imageName, 80, 80);
    return (
      <div className="member align-center">
        <a role="button" onClick={this.linkToProfile.bind(this)}>
          <div className="image">
            <img src={imageUrl} width="80" height="80"/>
          </div>
          <div className="name">
            {he.decode(this.props.member.name)}
          </div>
        </a>
      </div>
    );
  }
}

export default class TeamPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teamMemberPage: 0,
      teamMember: {
        content: []
      },
      team: {
        co2Data: {}
      },
      newestPlantRanking: {
        content: []
      },
      pageCount: 0,
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

  callNextPageTeamMember() {
    var newPage = this.state.teamMemberPage + 1;
    this.callPageTeamMember(newPage);
    this.setState({
      teamMemberPage: newPage
    });
  }

  callPreviousPageTeamMember() {
    var newPage = this.state.teamMemberPage - 1;
    this.callPageTeamMember(newPage);
    this.setState({
      teamMemberPage: newPage
    });
  }

  callPageTeamMember(page) {
    var that = this;
    axios.get('http://localhost:8081/team/member?teamName=' + encodeURIComponent(this.props.params.teamName) + '&page=' + page + '&size=5').then(function(response) {
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
    axios.get('http://localhost:8081/trees/team/' + encodeURIComponent(this.props.params.teamName) + '?page=' + page + '&size=15').then(function(response) {
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
                browserHistory.push('/user/' + encodeURIComponent(localStorage.getItem('username')));
              }}>OK</button>
            </div>
      )
    });
  }

  createSuccessMessageAndReloadPage(teamName){
    browserHistory.push('/team/' + teamName);
  }

  render() {
    let teamMemberPage = this.state.teamMemberPage;
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
          var linkTo;
          if(content.projectArticle && content.projectArticle.project){
            linkTo = '/projects/' + content.projectArticle.project.name;
          }else{
            linkTo = '/selfPlants/' + content.id;
          }
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
          <h1>Mitglieder</h1>
          <SmallRankingContainer title="" withPaging={true} rankingType="teamMember" page={teamMemberPage} callPreviousPage={this.callPreviousPageTeamMember.bind(this)} callNextPage={this.callNextPageTeamMember.bind(this)} isFirstPage={this.state.teamMember.first} isLastPage={this.state.teamMember.last}>
              {this.state.teamMember.content.map(function(content, i) {
                return (
                  <div key={i} className="teamMember">
                    <Member member={content}/>
                  </div>
                );
              })}
            </SmallRankingContainer>
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
