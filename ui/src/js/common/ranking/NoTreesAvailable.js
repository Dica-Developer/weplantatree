import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';

import Boostrap from 'bootstrap';

require('./noTreesAvailable.less');

export default class NoTreesAvailable extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={('row noTreesAvailable')}>
        <div className="col-md-12">
          <h1>Du hast noch keine Bäume gepflanzt!? Na klasse, deine Kinder werden dir dankbar sein...</h1>
          <p>(Hier wäre noch eine Beschreibung gut, was da wirklich hin soll)</p>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
