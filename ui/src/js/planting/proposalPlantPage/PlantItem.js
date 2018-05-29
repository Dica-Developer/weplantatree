import React, {Component} from 'react';
import {render} from 'react-dom';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';

import {getTextForSelectedLanguage} from '../../common/language/LanguageHelper';

export default class PlantItem extends Component {

  constructor() {
    super();
  }

  render() {
    let imageUrl = 'http://localhost:8081/treeType/image/' + this.props.plantItem.imageFile + '/60/60';
    return (
      <div className="plantItem">
        <div>
          <img src={imageUrl}/>
        </div>
        <div>
          <p>
            <span className="uppercase bold">{getTextForSelectedLanguage(this.props.plantItem.treeType)}</span><br/>Stk.&nbsp;{Accounting.formatNumber(this.props.plantItem.treePrice / 100, 2, '.', ',')}&nbsp;€
          </p>
        </div>
        <div>
        {this.props.plantItem.amount}
        </div>
        <div>
          {this.props.plantItem.projectName}
        </div>
        <div>
        </div>
        <div>
          {Accounting.formatNumber(this.props.plantItem.treePrice * this.props.plantItem.amount / 100, 2, '.', ',')}&nbsp;€
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
