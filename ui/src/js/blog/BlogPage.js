import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import {browserHistory} from 'react-router';
import axios from 'axios';
import moment from 'moment';
import {getTextForSelectedLanguage, getShortText} from '../common/language/LanguageHelper';

require('./blogPage.less');

class Paragraph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var imagePart;
    var titlePart;
    var textPart;
    let imageUrl = '';
    if (this.props.content.title != '') {
      titlePart = <h1>{getTextForSelectedLanguage(this.props.content.title)}</h1>;
    }else{
      titlePart= '';
    }

    if (this.props.content.imageFileName != null && this.props.content.imageFileName != '') {
      imageUrl = 'http://localhost:8082/article/image/' + this.props.articleId + '/' + this.props.content.imageFileName + '/1140/755';
      imagePart = <div className="article-img">
        <img src={imageUrl}/>
      </div>;
    } else {
      imagePart = '';
    }

    if (this.props.content.text != '') {
        textPart =  <p dangerouslySetInnerHTML={{
          __html: getTextForSelectedLanguage(this.props.content.text)
        }}/>;
    } else {
      textPart = '';
    }

    return (
      <div className="paragraph">
        {titlePart}
        {imagePart}
        {textPart}
      </div>
    );
  }
}
export default class BlogPage extends Component {

  constructor() {
    super();
    this.state = {
      articleId: 0,
      article: {
        intro: '',
        imageFileName: '',
        owner: {
          name: ''
        },
        paragraphs: []
      }
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/reports/article/' + this.props.params.articleId).then(function(response) {
      var result = response.data;
      that.setState({articleId: that.props.params.articleId, article: result});
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
    var that = this;
    let articleImageUrl = '';
    var imageDesc;
    if (this.state.article.imageFileName != '') {
      articleImageUrl = 'http://localhost:8082/article/image/' + this.props.params.articleId + '/' + this.state.article.imageFileName + '/935/623';
    }
    if(this.state.article.imageDescription != null){
      imageDesc = <p className="img-desc">{this.state.article.imageDescription}</p>;
    }else{
      imageDesc = '';
    }
    return (
      <div className="container paddingTopBottom15 blogPage">
        <div className="row">
          <div className={'col-md-12'}>
            <h1>{this.state.article.title}</h1>
            {moment(this.state.article.createdOn).format('DD.MM.YYYY')}{' von '}
            <a role="button" onClick= { () => { browserHistory.push('/user/' + this.state.article.owner.name); }}>
              {this.state.article.owner.name}</a>
            <div className="article-img">
              <div className="article-img-div">
                <img src={articleImageUrl}/>
                {imageDesc}
              </div>
            </div>
            <p dangerouslySetInnerHTML={{
              __html: getTextForSelectedLanguage(this.state.article.intro)
            }}/>
            {this.state.article.paragraphs.map(function(paragraph, i) {
              return (<Paragraph articleId={that.props.params.articleId} content={paragraph} key={i}/>);
            })}
          </div>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
