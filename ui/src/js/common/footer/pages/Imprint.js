import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';

require('./imprint.less');

export default class Imprint extends Component {

  constructor() {
    super();
    this.state = {
      imprint: []
    };
  }

  componentDidMount() {
    var that = this;
    axios.get('http://localhost:8082/articles?articleType=IMPRESS&language=' + localStorage.getItem('language')).then(function(response) {
      var result = response.data;
      that.setState({imprint: result});
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
      <div className="container paddingTopBottom15 imprint">
          <div className="row">
            <div className="col-md-12">
              <h1>Impressum</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {this.state.imprint.map(function(imp, i) {
                  return ( <div key={i} ><p className="title">{imp.title}</p><p dangerouslySetInnerHTML={{
                    __html: imp.intro}}></p>
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
