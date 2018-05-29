import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

import ProjectCarousel from './ProjectCarousel';
import ProjectDetails from './ProjectDetails';
import ProjectPlanting from './planting/ProjectPlantingWithoutSlider';
import SmallRankingContainer from '../common/ranking/SmallRankingContainer';
import RankingItem from '../common/ranking/RankingItem';
import RankingContentNameAmountCo2 from '../common/ranking/content/NameAmountCo2';
import RankingContentNameAmountDate from '../common/ranking/content/NameAmountDate';

require('./projectPage.less');

export default class ProjectDetailsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      project: {
        projectReportData: {
          projectName: 'default project',
          description: '',
          projectImageFileName: 'test.jpg',
          latitude: 0,
          longitude: 0,
          amountOfMaximumTreesToPlant: 0,
          amountOfPlantedTrees: 0
        },
        images: []
      },
      articles: [],
      detailsActive: true,
      bestTeam: {
        content: []
      },
      bestTeamPage: 0,
      bestUser: {
        content: []
      },
      bestUserPage: 0,
      lastPlantedTrees: {
        content: []
      },
      lastPlantedTreesPage: 0
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8081/projects/search/name/extended/' + encodeURIComponent(this.props.params.projectName)).then(function(response) {
      var result = response.data;
      that.setState({project: result});
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

    axios.get('http://localhost:8081/ranking/bestUser/project?projectName=' + this.props.params.projectName + '&page=0&size=5').then(function(response) {
      var result = response.data;
      that.setState({bestUser: result});
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

    axios.get('http://localhost:8081/ranking/bestTeam/project?projectName=' + this.props.params.projectName + '&page=0&size=5').then(function(response) {
      var result = response.data;
      that.setState({bestTeam: result});
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

    axios.get('http://localhost:8081/ranking/lastPlantedTrees/project?projectName=' + this.props.params.projectName + '&page=0&size=5').then(function(response) {
      var result = response.data;
      that.setState({lastPlantedTrees: result});
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
    axios.get('http://localhost:8081/project/articles?projectName=' + this.props.params.projectName).then(function(response) {
      var result = response.data;
      that.setState({articles: result});
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

  callNextPage(rankingType, page) {
    var that = this;
    var newPage = page + 1;
    axios.get('http://localhost:8081/ranking/' + rankingType + '/project?projectName=' + this.props.params.projectName + '&page=' + newPage + '&size=5').then(function(response) {
      var result = response.data;
      that.setState({[rankingType]: result});
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
    that.setState({
      [rankingType + 'Page']: newPage
    });
  }

  callPreviousPage(rankingType, page) {
    var that = this;
    var newPage = page - 1;
    axios.get('http://localhost:8081/ranking/' + rankingType + '/project?projectName=' + this.props.params.projectName + '&page=' + newPage + '&size=5').then(function(response) {
      var result = response.data;
      that.setState({[rankingType]: result});
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
    that.setState({
      [rankingType + 'Page']: newPage
    });
  }

  setDetailsActive(value) {
    this.setState({detailsActive: value});
    window.scrollTo(0, 0);
  }

  updatePlantBag(overallPrice, projectItems, projectName) {
    this.props.route.updatePlantBag(overallPrice, projectItems, projectName, false);
  }

  render() {
    var bestUserPage = this.state.bestUserPage;
    var bestTeamPage = this.state.bestTeamPage;
    var lastPlantedTreesPage = this.state.lastPlantedTreesPage;
    var mainPart;

    if (this.state.detailsActive) {
      mainPart = <div><ProjectCarousel projectName={this.props.params.projectName} slides={this.state.project.images}/>
        <ProjectDetails project={this.state.project} showPlanting={() => {
          this.setDetailsActive(false);
        }}/></div>;
    } else {
      mainPart = <ProjectPlanting projectName={this.props.params.projectName} showDetails={() => {
        this.setDetailsActive(true);
      }} articles={this.state.articles} updatePlantBag={this.updatePlantBag.bind(this)} amount="5"/>;
    };

    return (
      <div className="container paddingTopBottom15 projectPage">
        <div className="row">
          <div className="col-md-12">
            {mainPart}
          </div>
        </div>
        <div className="row projectRankings">
          <div className="col-md-4">
            <SmallRankingContainer title="Beste Teams" withPaging={true} rankingType="bestTeam" page={bestTeamPage} callPreviousPage={this.callPreviousPage.bind(this)} callNextPage={this.callNextPage.bind(this)} isFirstPage={this.state.bestTeam.first} isLastPage={this.state.bestTeam.last}>
              {this.state.bestTeam.content.map(function(content, i) {
                let imageUrl = 'http://localhost:8081/team/image/' + content.imageName + '/60/60';
                let linkTo = '/team/' + content.name;
                return (
                  <RankingItem content={content} key={i} rankNumber={bestTeamPage * 5 + (i + 1)} imageUrl={imageUrl} showRankNumber="true" linkTo={linkTo}>
                    <RankingContentNameAmountCo2 content={content}/>
                  </RankingItem>
                );
              })}
            </SmallRankingContainer>
          </div>
          <div className="col-md-4">
            <SmallRankingContainer title="Beste Pflanzer" withPaging={true} rankingType="bestUser" page={bestUserPage} callPreviousPage={this.callPreviousPage.bind(this)} callNextPage={this.callNextPage.bind(this)} isFirstPage={this.state.bestUser.first} isLastPage={this.state.bestUser.last}>
              {this.state.bestUser.content.map(function(content, i) {
                let imageUrl = 'http://localhost:8081/user/image/' + content.imageName + '/60/60';
                let linkTo = '/user/' + content.name;
                return (
                  <RankingItem content={content} key={i} rankNumber={bestUserPage * 5 + (i + 1)} imageUrl={imageUrl} showRankNumber="true" linkTo={linkTo}>
                    <RankingContentNameAmountCo2 content={content}/>
                  </RankingItem>
                );
              })}
            </SmallRankingContainer>
          </div>
          <div className="col-md-4">
            <SmallRankingContainer title="Neueste Pflanzungen" withPaging={true} rankingType="lastPlantedTrees" page={lastPlantedTreesPage} callPreviousPage={this.callPreviousPage.bind(this)} callNextPage={this.callNextPage.bind(this)} isFirstPage={this.state.lastPlantedTrees.first} isLastPage={this.state.lastPlantedTrees.last}>
              {this.state.lastPlantedTrees.content.map(function(content, i) {
                let imageUrl = 'http://localhost:8081/treeType/image/' + content.treeTypeImageName + '/60/60';
                let linkTo = '/user/' + content.name;
                return (
                  <RankingItem imageUrl={imageUrl} key={i} linkTo={linkTo}>
                    <RankingContentNameAmountDate name={content.name} amount={content.amount} plantedOn={content.plantedOn}/>
                  </RankingItem>
                );
              })}
            </SmallRankingContainer>
          </div>
        </div>
      </div>
    );
  }
}
