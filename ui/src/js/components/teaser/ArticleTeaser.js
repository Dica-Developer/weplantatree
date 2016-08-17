import React, {Component} from 'react';
import Boostrap from 'bootstrap';
import axios from 'axios';

export default class ArticleTeaser extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let imageUrl = 'http://localhost:8083/article/image/' + this.props.content.id + '/' + this.props.content.imageFileName + '/380/380';
    return (
      <div className="col-md-4">
        <img src={imageUrl} alt={this.props.content.title}/>
          <h3>{this.props.content.title}</h3>
          <p>{this.props.content.intro}</p>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */