import React, {Component} from 'react';
import Boostrap from 'bootstrap';
import axios from 'axios';
import {browserHistory} from 'react-router';

import {getTextForSelectedLanguage, getShortText} from '../common/language/LanguageHelper';

export default class ArticleTeaser extends Component {
  constructor(props) {
    super(props);
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    let imageUrl = '';
    if (this.props.content.id != 0) {
      imageUrl = 'http://localhost:8082/article/image/' + this.props.content.id + '/' + this.props.content.imageFileName + '/380/253';
    }

    return (
      <div>
        <a role="button" onClick={() => {
          this.linkTo('/blog/' + this.props.content.id);
        }}>
          <img src={imageUrl} alt={this.props.content.title} width="380" height="253" />
          <h1>
            {this.props.content.title}
          </h1>
          <div className="description">
            <p dangerouslySetInnerHTML={{
              __html: getTextForSelectedLanguage(this.props.content.intro)
            }}/>
          </div>
        </a>
      </div>
    );
  }
}

ArticleTeaser.defaultProps = {
  content: {
    id: 0,
    imageFileName: '',
    title: '',
    intro: ''
  }
};

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
