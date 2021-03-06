import axios from 'axios';
import counterpart from 'counterpart';
import React, { Component } from 'react';
import { slideToggle } from '../3rd/jquery-alternative';
import LeftRightSwitch from '../common/components/LeftRightSwitch';
import LoadingSpinner from '../common/components/LoadingSpinner';
import Notification from '../common/components/Notification';
import { createProfileImageUrl, createTeamImageUrl } from '../common/ImageHelper';
import ButtonBar from './ButtonBar';
import RankingItemLarge from './RankingItemLarge';
import RankingItemSmall from './RankingItemSmall';

require('./rankingPage.less');

export default class RankingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ranking: {
        content: []
      },
      orgTypeDesc: counterpart.translate('RANKING_TYPES.ALL'),
      chosenOrgType: '',
      slideIn: false,
      rankingEntries: 100,
      onlyLastYear: true
    };
    this.toggleDiv = this.toggleDiv.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.refs['spinner'].showSpinner();
    this.loadAllUser();
  }

  toggleDiv() {
    slideToggle(this.refs['ranking'], 800);
  }

  loadAllUser(withToggle) {
    var that = this;
    if (withToggle) {
      this.toggleDiv();
    }
    axios
      .get('http://localhost:8081/ranking/bestUser?page=0&size=' + this.state.rankingEntries + '&lastYear=' + this.state.onlyLastYear)
      .then(function(response) {
        var result = response.data;
        setTimeout(function() {
          that.refs['spinner'].hideSpinner();
          that.setState({
            ranking: result,
            orgTypeDesc: counterpart.translate('RANKING_TYPES.ALL')
          });
          if (withToggle) {
            that.toggleDiv();
          }
        }, 1000);
      })
      .catch(function(response) {
        that.refs['spinner'].hideSpinner();
        that.refs.notification.addNotification('Fehler beim Laden der besten Nutzer!', '', 'error');
      });
  }

  loadBestTeams(withToggle) {
    var that = this;
    if (withToggle) {
      this.toggleDiv();
    }
    axios
      .get('http://localhost:8081/ranking/bestTeam?page=0&size=' + this.state.rankingEntries + '&lastYear=' + this.state.onlyLastYear)
      .then(function(response) {
        var result = response.data;
        setTimeout(function() {
          that.setState({
            ranking: result,
            orgTypeDesc: counterpart.translate('RANKING_TYPES.TEAMS')
          });
          if (withToggle) {
            that.toggleDiv();
          }
        }, 1000);
      })
      .catch(function(response) {
        that.refs['spinner'].hideSpinner();
        that.refs.notification.addNotification('Fehler beim Laden der besten Teams!', '', 'error');
      });
  }

  loadOrgTypeRanking(orgType, withToggle) {
    var that = this;
    if (withToggle) {
      this.toggleDiv();
    }
    axios
      .get('http://localhost:8081/ranking/bestOrgType/' + orgType + '?page=0&size=' + this.state.rankingEntries + '&lastYear=' + this.state.onlyLastYear)
      .then(function(response) {
        var result = response.data;
        setTimeout(function() {
          that.setState({
            ranking: result,
            orgTypeDesc: counterpart.translate('RANKING_TYPES.' + orgType),
            chosenOrgType: orgType
          });
          if (withToggle) {
            that.toggleDiv();
          }
        }, 1000);
      })
      .catch(function(response) {
        that.refs['spinner'].hideSpinner();
        that.refs.notification.addNotification('Fehler beim Laden der Rangliste!', '', 'error');
      });
  }

  callMoreRankingEntries() {
    this.state.rankingEntries = this.state.rankingEntries + 100;
    this.forceUpdate();
    this.loadRanking(false);
  }

  updateLastYearFlag(value) {
    this.state.onlyLastYear = value;
    this.forceUpdate();
    this.loadRanking(true);
  }

  loadRanking(withToggle) {
    if (this.state.orgTypeDesc == 'Alle' || this.state.orgTypeDesc == 'All') {
      this.loadAllUser(withToggle);
    } else if (this.state.orgTypeDesc == 'Teams') {
      this.loadBestTeams(withToggle);
    } else {
      this.loadOrgTypeRanking(this.state.chosenOrgType, withToggle);
    }
  }

  render() {
    var orgTypeDesc = this.state.orgTypeDesc;
    var page = 0;
    var percentTree = 100;
    var percentCo2 = 100;
    var maxTree;
    var maxCo2;
    return (
      <div className="container paddingTopBottom15 ">
        <div className="rankingPage">
          <div className="row">
            <div className="col-md-2 center-switch">
              <LeftRightSwitch
                leftText={counterpart.translate('RANKING_TYPES.TOTAL')}
                rightText={counterpart.translate('RANKING_TYPES.LAST_YEAR')}
                leftValue={false}
                rightValue={true}
                chosenValue={this.state.onlyLastYear}
                onClick={this.updateLastYearFlag.bind(this)}
              />
            </div>
            <ButtonBar loadAllUser={this.loadAllUser.bind(this)} loadBestTeams={this.loadBestTeams.bind(this)} loadOrgTypeRanking={this.loadOrgTypeRanking.bind(this)} />
            <hr />
          </div>
          <div className="row">
            <div ref="ranking" className={'col-md-12 rankingItems'}>
              <h1>{this.state.orgTypeDesc}</h1>
              {this.state.ranking.content.map(function(content, i) {
                if (i == 0) {
                  maxTree = content.amount;
                  maxCo2 = content.co2Saved;
                }
                if (i > 0) {
                  percentTree = (100 * content.amount) / maxTree;
                  percentCo2 = (100 * content.co2Saved) / maxCo2;
                }
                let imageUrl;
                let profileUrl;
                if (orgTypeDesc != 'Teams') {
                  imageUrl = createProfileImageUrl(content.imageName, 60, 60);
                  profileUrl = '/user/' + encodeURIComponent(content.name);
                } else {
                  imageUrl = createTeamImageUrl(content.imageName, 60, 60);
                  profileUrl = '/team/' + encodeURIComponent(content.name);
                }
                if (i < 10) {
                  return <RankingItemLarge profileUrl={profileUrl} imageUrl={imageUrl} content={content} rankNumber={page * 25 + (i + 1)} key={i} percentTree={percentTree} percentCo2={percentCo2} />;
                } else {
                  return <RankingItemSmall profileUrl={profileUrl} content={content} rankNumber={page * 25 + (i + 1)} key={i} percentTree={percentTree} />;
                }
              })}
            </div>
          </div>
          <div className="row">
            <div className={'col-md-12 '}>
              <a className={this.state.ranking.last ? 'no-display' : 'pagingLink'} role="button" onClick={this.callMoreRankingEntries.bind(this)}>
                <div>
                  <span className={'glyphicon glyphicon-menu-down'}></span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <LoadingSpinner ref="spinner" />
        <Notification ref="notification" />
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
