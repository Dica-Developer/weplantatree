import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import Accounting from 'accounting';
import Boostrap from 'bootstrap';

import {htmlDecode} from '../common/language/HtmlHelper';

export default class RankingItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="rankingItemLarge">
        <div className="rankingNumber">{this.props.rankNumber}</div>
        <div className="ranking-img-div">
          <img className="ranking-img" src={this.props.imageUrl} alt="logo"/>
        </div>
        <div className="rankingSummary">
          <Link to={'/user/' + this.props.content.name}>
            <span className="name">{htmlDecode(this.props.content.name)}</span>
          </Link>
          <br/>
          <p style={{
            width: this.props.percentTree + '%'
          }}>
            <span className="stats">&nbsp;{Accounting.formatNumber(this.props.content.amount, 0, '.', ',')}</span>
            <span className="text">
              B&auml;ume gepflanzt
            </span><br/>
          </p>
          <p style={{
            width: this.props.percentCo2 + '%'
          }}>
            <span className="stats">&nbsp;{Accounting.formatNumber(this.props.content.co2Saved, 1, '.', ',')}&nbsp;</span>
            <span className="text">
              Tonnen CO<sub>2</sub>&nbsp;gebunden
            </span>
          </p>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
