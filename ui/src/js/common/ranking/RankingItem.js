import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';

import {getTextForSelectedLanguage} from '../../common/language/LanguageHelper';
import {htmlDecode} from '../../common/language/HtmlHelper';

require('./rankingItem.less');

export default class RankingItem extends Component {
  constructor(props) {
    super(props);
  }

  linkTo(url) {
    browserHistory.push(url);
  }

  render() {
    return (
      <div className="rankingItem">
        <a role="button" onClick={() => {
          this.linkTo(this.props.linkTo);
        }}>
        <div className={'rankingNumber' + (this.props.showRankNumber ? ' ' : ' invisible')}>
          {this.props.rankNumber}
        </div>
        <img className="ranking-img" src={this.props.imageUrl} />
        {this.props.children}
        </a>
      </div>
    );
  }
}



/* vim: set softtabstop=2:shiftwidth=2:expandtab */
