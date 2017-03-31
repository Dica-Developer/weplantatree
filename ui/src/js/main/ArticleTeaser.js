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
      imageUrl = 'http://localhost:8082/article/image/' + this.props.content.id + '/' + this.props.content.imageFileName + '/380/380';
    }

    return (
      <div>
        <a role="button" onClick={() => {
          this.linkTo(`/blog/` + this.props.content.id)
        }}>
          <img src={imageUrl} alt={this.props.content.title}/>
          <h2>
            {this.props.content.title}
          </h2>
          <div className="description">
            <p dangerouslySetInnerHTML={{
              __html: getShortText(getTextForSelectedLanguage(this.props.content.intro), 300)
            }}/>
            <i className="more">(mehr)</i>
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
