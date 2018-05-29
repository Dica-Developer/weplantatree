import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

require('./terms.less');

export default class Terms extends Component {

  constructor() {
    super();
    this.state = {
      terms: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=TERMS&language=' + localStorage.getItem('language')).then(function(response) {
      var result = response.data;
      for (var terms in result) {
        axios.get('http://localhost:8082/reports/article/' + result[terms].id).then(function(response) {
          that.state.terms.push(response.data);
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
      <div className="container paddingTopBottom15 terms">
          <div className="row">
            <div className="col-md-12">
              <h1>AGB</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {this.state.terms.map(function(terms, i) {
                  return ( <div key={i} ><p className="title">{terms.title}</p><p dangerouslySetInnerHTML={{
                    __html: terms.intro}}></p>
                    {terms.paragraphs.map(function(paragraph, j) {
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
