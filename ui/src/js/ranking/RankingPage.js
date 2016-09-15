import React, {Component} from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import NavBar from '../common/navbar/NavBar';
import Header from '../common/header/Header';
import Footer from '../common/Footer';
import Boostrap from 'bootstrap';

import ButtonBar from './ButtonBar';
import RankingItemLarge from './RankingItemLarge';
import RankingItemSmall from './RankingItemSmall';

require("./rankingPage.less");

export default class RankingPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ranking: {
        content: []

      },
      orgTypeDesc: 'Alle'
    };
  }

  componentDidMount() {
    this.loadAllUser();
  }

  loadAllUser() {
    var that = this;
    axios.get('http://localhost:8081/ranking/bestUser?page=0&size=25').then(function(response) {
      var result = response.data;
      that.setState({ranking: result});
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
    this.setState({orgTypeDesc: 'Alle'})
  }

  loadBestTeams() {
    this.setState({orgTypeDesc: 'Teams'})
    var that = this;
    axios.get('http://localhost:8081/ranking/bestTeam?page=0&size=25').then(function(response) {
      var result = response.data;
      that.setState({ranking: result});
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

  loadOrgTypeRanking(orgType, orgTypeDesc) {
    this.setState({orgTypeDesc: orgTypeDesc})
    var that = this;
    axios.get('http://localhost:8081/ranking/bestOrgType/' + orgType + '?page=0&size=25').then(function(response) {
      var result = response.data;
      that.setState({ranking: result});
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

  render() {
    var orgTypeDesc = this.state.orgTypeDesc;
    var page = 0;
    var percentTree = 100;
    var percentCo2 = 100;
    var maxTree;
    var maxCo2;
    return (
      <div>
        <NavBar/>
        <Header/>
        <div className="container paddingTopBottom15 rankingPage">
          <div classname="row">
            <div className="col-md-12">
              <ButtonBar loadAllUser={this.loadAllUser.bind(this)} loadBestTeams={this.loadBestTeams.bind(this)} loadOrgTypeRanking={this.loadOrgTypeRanking.bind(this)}/>
            </div>
            <div className="col-md-12 rankingItems">
              <h2>Bestenliste&nbsp;/&nbsp;{this.state.orgTypeDesc}</h2>
              {this.state.ranking.content.map(function(content, i) {
                if (i == 1) {
                  maxTree = content.amount;
                  maxCo2 = content.co2Saved;
                }

                if (i > 1) {
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
                }else{
                  return(<RankingItemSmall content={content} rankNumber={page * 25 + (i + 1)} key={i} percentTree={percentTree}/>);
                }
              })}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */