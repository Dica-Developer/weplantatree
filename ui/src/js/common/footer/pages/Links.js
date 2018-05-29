import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

require('./links.less');

export default class Links extends Component {

  constructor() {
    super();
    this.state = {
      links: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=LINKS&language=' + localStorage.getItem('language')).then(function(response) {
      var result = response.data;
      for (var link in result) {
        axios.get('http://localhost:8082/reports/article/' + result[link].id).then(function(response) {
          that.state.links.push(response.data);
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
      <div className="container paddingTopBottom15 links">
          <div className="row">
            <div className="col-md-12">
              <h1>Links</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {this.state.links.map(function(link, i) {
                  return ( <div key={i} ><p className="title">{link.title}</p><p dangerouslySetInnerHTML={{
                    __html: link.intro}}></p>
                    {link.paragraphs.map(function(paragraph, j) {
                      return (<div key={j} className="link"><p className="link-title">{paragraph.title}</p><p dangerouslySetInnerHTML={{
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
