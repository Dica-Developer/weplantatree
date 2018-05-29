import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import UserDetails from './UserDetails';
import EditUserDetails from './edit/EditUserDetails';
import CreateTeam from '../team/CreateTeam';
import TeamDetails from '../team/TeamDetails';
import EditTeamDetails from '../team/EditTeamDetails';
import NoTeamAvailable from './NoTeamAvailable';
import LargeRankingContainer from '../common/ranking/LargeRankingContainer';
import RankingItem from '../common/ranking/RankingItem';
import RankingItemContent from '../common/ranking/content/AmountProjectDate';
import NoTreesAvailable from '../common/ranking/NoTreesAvailable';
import Notification from '../common/components/Notification';

require('./profile.less');

export default class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        co2Data: {}
      },
      editUser: false,
      editTeam: false,
      createTeam: false,
      team: {
        co2Data: {}
      },
      newestPlantRanking: {
        content: []
      },
      pageCount: 0
    };

  }

  componentDidMount() {
    var that = this;
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/user?userName=' + encodeURIComponent(this.props.params.userName), config).then(function(response) {
      var result = response.data;
      that.setState({
        user: result
      });
      if (that.state.user.teamName != '') {
        that.loadTeamDetails();
      }
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

    axios.get('http://localhost:8081/trees/owner?userName=' + encodeURIComponent(this.props.params.userName) + '&page=0&size=15').then(function(response) {
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

  loadTeamDetails() {
    var that = this;
    if (this.state.user.teamName && this.state.user.teamName != '') {
      axios.get('http://localhost:8081/team?teamName=' + this.state.user.teamName).then(function(response) {
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
    axios.get('http://localhost:8081/trees/owner?userName=' + encodeURIComponent(this.props.params.userName) + '&page=' + page + '&size=15').then(function(response) {
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

  showEditUser() {
    this.setState({
      editUser: true
    });
  }

  showProfile() {
    var that = this;
    this.setState({
      editUser: false
    });
    var config = {
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('jwt')
      }
    };
    axios.get('http://localhost:8081/user?userName=' + encodeURIComponent(this.props.params.userName), config).then(function(response) {
      var result = response.data;
      that.setState({
        user: result
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

  updateLanguage(value) {
    this.refs['navbar'].updateLanguage(value);
  }

  editTeam(value) {
    this.setState({
      editTeam: value
    });
    if (!value) {
      this.reloadTeam();
    }
  }

  switchTeamPartToNoTeam() {
    this.state.user.teamName = '';
    this.state.team = {
      co2Data: {}
    };
    this.forceUpdate();
    this.refs.notification.addNotification(counterpart.translate('TEAM_DELETED_TITLE'), counterpart.translate('TEAM_DELETED_MESSAGE'), 'success');
  }

  reloadTeam(teamName) {
    this.state.user.teamName = teamName;
    this.forceUpdate();
    this.loadTeamDetails();
  }

  openCreateTeamPart() {
    this.setState({
      createTeam: true
    });
  }

  teamCreated(teamName) {
    this.setState({
      createTeam: false
    });
    this.reloadTeam(teamName);
    this.refs.notification.addNotification(counterpart.translate('CREATE_TEAM_SUCCESS_TITLE'), counterpart.translate('CREATE_TEAM_SUCCESS_MESSAGE'), 'success');
  }

  teamLeft(){
    this.state.user.teamName = ''; this.forceUpdate();
  }

  render() {
    var that = this;
    var userPart;
    var teamPart;
    var treePart;
    var page = this.state.pageCount;

    if (!this.state.editUser) {
      userPart = <UserDetails user={this.state.user} showEditUser={this.showEditUser.bind(this)}/>;
    } else {
      userPart = <EditUserDetails user={this.state.user} showProfile={this.showProfile.bind(this)} updateLanguage={this.updateLanguage.bind(this)}/>;
    }

    if (this.state.user.teamName != '' && !this.state.editTeam) {
      teamPart = <TeamDetails team={this.state.team} editTeam={this.editTeam.bind(this)} deleteAction={this.switchTeamPartToNoTeam.bind(this)} loadTeamMember={this.teamLeft.bind(this)}/>;
    } else if (this.state.user.teamName != '' && this.state.editTeam) {
      teamPart = <EditTeamDetails team={this.state.team} editTeam={this.editTeam.bind(this)} loadTeamDetails={this.loadTeamDetails.bind(this)}  teamNameChangedAction={this.reloadTeam.bind(this)}/>;
    } else if (this.state.user.teamName === '' && this.state.createTeam) {
      teamPart = <CreateTeam teamCreatedAction={this.teamCreated.bind(this)}/>;
    } else if (this.state.user.teamName === '' && !this.state.createTeam) {
      teamPart = <NoTeamAvailable openCreateTeamPart={this.openCreateTeamPart.bind(this)}/>;
    }

    if (this.state.newestPlantRanking.numberOfElements != 0) {
      treePart = <LargeRankingContainer styleClass="ranking" callPreviousPage={this.callPreviousPage.bind(this)} callNextPage={this.callNextPage.bind(this)} isFirstPage={this.state.newestPlantRanking.first} isLastPage={this.state.newestPlantRanking.last}>
        {this.state.newestPlantRanking.content.map(function(content, i) {
          let imageUrl;
          if (content.imagePath != null && content.imagePath != '') {
            imageUrl = 'http://localhost:8081/tree/image/' + content.imagePath + '/60/60';
          } else {
            imageUrl = 'http://localhost:8081/treeType/image/' + content.treeType.imageFile + '/60/60';
          }
          var linkTo;
          if(content.projectArticle != null){
            linkTo = '/projects/' + content.projectArticle.project.name;
          }else{
            linkTo = '/user/' + that.props.params.userName;
          }
          return (
            <RankingItem imageUrl={imageUrl} rankNumber={page * 15 + (i + 1)} content={content} key={i} showRankNumber={true} showName={false} linkTo={linkTo}>
              <RankingItemContent content={content}/>
            </RankingItem>
          );
        })}
      </LargeRankingContainer >;
    } else {
      treePart = <NoTreesAvailable/>;
    }

    return (
      <div className="container paddingTopBottom15 profile">
        <div className="row details">
          <div className="col-md-6 ">
            {userPart}
          </div>
          <div className="col-md-6">
            {teamPart}
          </div>
        </div>
        <div className="row">
          {treePart}
        </div>
        <Notification ref="notification"/>
      </div>
    );
  }
}
