import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

require('./disclaimer.less');

export default class Disclaimer extends Component {

  constructor() {
    super();
    this.state = {
      disclaimer: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=DISCLAIMER&language=' + localStorage.getItem('language')).then(function(response) {
      var result = response.data;
      for (var disclaim in result) {
        axios.get('http://localhost:8082/reports/article/' + result[disclaim].id).then(function(response) {
          that.state.disclaimer.push(response.data);
          that.forceUpdate();
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
      <div className="container paddingTopBottom15 disclaimer">
          <div className="row">
            <div className="col-md-12">
              <h1>Haftungsauschluss</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {this.state.disclaimer.map(function(disclaim, i) {
                  return ( <div key={i} ><p className="title">{disclaim.title}</p><p dangerouslySetInnerHTML={{
                    __html: disclaim.intro}}></p>
                    {disclaim.paragraphs.map(function(paragraph, j) {
                      return (<div key={j} className="link"><p >{paragraph.title}</p><p dangerouslySetInnerHTML={{
                        __html: paragraph.text}}></p></div>);
                    })}
                </div>);
                })}
              </div>
            </div>
          </div>
        </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
