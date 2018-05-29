import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import {
  browserHistory
} from 'react-router';
import axios from 'axios';
import moment from 'moment';
import {
  getTextForSelectedLanguage,
  getShortText
} from '../common/language/LanguageHelper';

require('./blogOverviewPage.less');

class Article extends Component {
  constructor(props) {
    super(props);
  }

  switchToBlogEntry(){
    browserHistory.push('/blog/' + this.props.content.id);
  }

  render() {
    let imageUrl = 'http://localhost:8082/article/image/' + this.props.content.id + '/' + this.props.content.imageFileName + '/300/200';
    return (
      <div className="article-entry">
        <a role="button" onClick={this.switchToBlogEntry.bind(this)}>
          <h3>{getTextForSelectedLanguage(this.props.content.title)}</h3>
          <span>{moment(this.props.content.createdOn).format('DD.MM.YYYY')}{' von '}{this.props.content.owner.name}</span>
          <div className="article-content">
            <img src={imageUrl} />
            <p dangerouslySetInnerHTML={{
              __html: getTextForSelectedLanguage(this.props.content.intro)
            }}/>
          </div>
        </a>
      </div>
    );
  }
}
export default class BlogOverviewPage extends Component {

  constructor() {
    super();
    this.state = {
      articles: {
        content: []
      },
      entryCount: 5
    };
  }

  componentDidMount() {
    this.callArticleEntries();
  }

  callMoreArticleEntries(){
    this.state.entryCount = this.state.entryCount + 5;
    this.forceUpdate();
    this.callArticleEntries();
  }

  callArticleEntries(){
        var that = this;
    axios.get('http://localhost:8082/articlesPaged?articleType=BLOG&language=' + localStorage.getItem('language') +'&page=0&size=' + this.state.entryCount).then(function(response) {
      var result = response.data;
      that.setState({
        articles: result
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

  render() {
    return (
      <div className="container paddingTopBottom15 blogOverviewPage">
        <div className="row">
          <div className={'col-md-12'}>
            <h1>Blog</h1>
          </div>
        </div>
        <div className="row">
          {this.state.articles.content.map(function(article, i) {
            return (
              <div className="col-md-4" key={i}><Article content={article} /></div>
            );
          })}
        </div>
        <div className="row">
          <div className={'col-md-12'}>
            <a className={(this.state.articles.last ? 'no-display' : 'pagingLink')} role="button" onClick={this.callMoreArticleEntries.bind(this)}>
              <div>
                <span className={'glyphicon glyphicon-menu-down'}></span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
