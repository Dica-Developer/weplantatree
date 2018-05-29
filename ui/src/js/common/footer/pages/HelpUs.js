import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

require('./helpUs.less');

export default class HelpUs extends Component {

  constructor() {
    super();
    this.state = {
      helpUs: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=HELP_US&language=' + localStorage.getItem('language')).then(function(response) {
      that.setState({
        helpUs: response.data
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
      <div className="container paddingTopBottom15 helpUs">
          <div className="row">
            <div className="col-md-12">
              <h1>Hilf uns</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {this.state.helpUs.map(function(help, i) {
                return ( <div key={i}><p className="title">{help.title}</p><p dangerouslySetInnerHTML={{
                  __html: help.intro
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
