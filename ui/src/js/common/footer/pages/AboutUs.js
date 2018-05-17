import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

require('./aboutUs.less');

export default class aboutUs extends Component {

  constructor() {
    super();
    this.state = {
      aboutUs: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=ABOUT_US&language=' + localStorage.getItem('language')).then(function(response) {
      that.setState({
        aboutUs: response.data
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
    var that = this;
    return (
      <div className="container paddingTopBottom15 aboutUs">
          <div className="row">
            <div className="col-md-12">
              <h1>Über uns</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {this.state.aboutUs.map(function(about, i) {
                return ( <div key={i}><p className="title">{about.title}</p><p dangerouslySetInnerHTML={{
                  __html: about.intro
                }}></p></div>);
                })}
              </div>
            </div>
          </div>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
