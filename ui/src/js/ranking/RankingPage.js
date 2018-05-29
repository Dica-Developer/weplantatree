import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import axios from 'axios';
import Boostrap from 'bootstrap';

import ButtonBar from './ButtonBar';
import LeftRightSwitch from '../common/components/LeftRightSwitch';
import RankingItemLarge from './RankingItemLarge';
import RankingItemSmall from './RankingItemSmall';
import Notification from '../common/components/Notification';
import LoadingSpinner from '../common/components/LoadingSpinner';
import $ from 'jquery';

require('./rankingPage.less');

export default class RankingPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ranking: {
        content: []

      },
      orgTypeDesc: 'Alle',
      chosenOrgType: 'PRIVATE',
      slideIn: false,
      rankingEntries: 25,
      onlyLastYear: true
    };
    this.toggleDiv = this.toggleDiv.bind(this);
  }

  componentDidMount() {
    this.refs['spinner'].showSpinner();
    this.loadAllUser();
  }

  toggleDiv() {
    $(this.refs['ranking']).slideToggle(800);
  }

  loadAllUser(withToggle) {
    var that = this;
    if (withToggle) {
      this.toggleDiv();
    }
    axios.get('http://localhost:8081/ranking/bestUser?page=0&size=' + this.state.rankingEntries + '&lastYear=' + this.state.onlyLastYear).then(function(response) {
      var result = response.data;
      setTimeout(function() {
        that.refs['spinner'].hideSpinner();
        that.setState({
          ranking: result,
          orgTypeDesc: 'Alle'
        });
        if (withToggle) {
          that.toggleDiv();
        }
      }, 1000);

    }).catch(function(response) {
      this.refs.notification.addNotification('Fehler beim Laden der besten Nutzer!', '', 'error');
    });
  }

  loadBestTeams(withToggle) {
    var that = this;
    if (withToggle) {
      this.toggleDiv();
    }
    axios.get('http://localhost:8081/ranking/bestTeam?page=0&size=' + this.state.rankingEntries + '&lastYear=' + this.state.onlyLastYear).then(function(response) {
      var result = response.data;
      setTimeout(function() {
        that.setState({
          ranking: result,
          orgTypeDesc: 'Teams'
        });
        if (withToggle) {
          that.toggleDiv();
        }
      }, 1000);
    }).catch(function(response) {
      this.refs.notification.addNotification('Fehler beim Laden der besten Teams!', '', 'error');
    });

  }

  loadOrgTypeRanking(orgType, orgTypeDesc, withToggle) {
    var that = this;
    if (withToggle) {
      this.toggleDiv();
    }
    axios.get('http://localhost:8081/ranking/bestOrgType/' + orgType + '?page=0&size=' + this.state.rankingEntries + '&lastYear=' + this.state.onlyLastYear).then(function(response) {
      var result = response.data;
      setTimeout(function() {
        that.setState({
          ranking: result,
          orgTypeDesc: orgTypeDesc,
          chosenOrgType: orgType
        });
        if (withToggle) {
          that.toggleDiv();
        }
      }, 1000);
    }).catch(function(response) {
      this.refs.notification.addNotification('Fehler beim Laden der Rangliste!', '', 'error');
    });
  }

  callMoreRankingEntries() {
    this.state.rankingEntries = this.state.rankingEntries + 25;
    this.forceUpdate();
    this.loadRanking(false);
  }

  updateLastYearFlag(value) {
    this.state.onlyLastYear = value;
    this.forceUpdate();
    this.loadRanking(true);
  }

  loadRanking(withToggle) {
    if (this.state.orgTypeDesc == 'Alle') {
      this.loadAllUser(withToggle);
    } else if (this.state.orgTypeDesc == 'Teams') {
      this.loadBestTeams(withToggle);
    } else {
      this.loadOrgTypeRanking(this.state.chosenOrgType, this.state.orgTypeDesc, withToggle);
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
              <LeftRightSwitch leftText="alle" rightText="letztes Jahr" leftValue={false} rightValue={true} chosenValue={this.state.onlyLastYear} onClick={this.updateLastYearFlag.bind(this)}/>
            </div>
              <ButtonBar loadAllUser={this.loadAllUser.bind(this)} loadBestTeams={this.loadBestTeams.bind(this)} loadOrgTypeRanking={this.loadOrgTypeRanking.bind(this)}/>
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
                  percentTree = 100 * content.amount / maxTree;
                  percentCo2 = 100 * content.co2Saved / maxCo2;
                }
                var imageUrl;
                if (orgTypeDesc != 'Teams') {
                  imageUrl = 'http://localhost:8081/user/image/' + content.imageName + '/60/60';
                } else {
                  imageUrl = 'http://localhost:8081/team/image/' + content.imageName + '/60/60';
                }
                if (i < 10) {
                  return (<RankingItemLarge imageUrl={imageUrl} content={content} rankNumber={page * 25 + (i + 1)} key={i} percentTree={percentTree} percentCo2={percentCo2}/>);
                } else {
                  return (<RankingItemSmall content={content} rankNumber={page * 25 + (i + 1)} key={i} percentTree={percentTree}/>);
                }
              })}
            </div>
          </div>
          <div className="row">
            <div className={'col-md-12 '}>
              <a className={(this.state.ranking.last
                ? 'no-display'
                : 'pagingLink')} role="button" onClick={this.callMoreRankingEntries.bind(this)}>
                <div>
                  <span className={'glyphicon glyphicon-menu-down'}></span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <LoadingSpinner ref="spinner"/>
        <Notification ref="notification"/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
