import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';
import {
  Link,
  browserHistory
} from 'react-router';

require('./article.less');

export default class ArticleDesc extends Component {

  render() {
    return (
      <div className="articleDesc bold">
        <div>
          <p>
{'Baumtyp & Preis/Stk.'}
          </p>
        </div>
        <div>
          Anzahl
        </div>
        <div>
          {'  / verfügbar'}
        </div>
        <div>
          Preis gesamt
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
