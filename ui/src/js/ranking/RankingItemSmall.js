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
      <div className="smallRankingItem">
        <div className="smallRankingNumber">{this.props.rankNumber}</div>
        <div className="name">
          <Link to={'/user/' + this.props.content.name}>
            <span className="name">{htmlDecode(this.props.content.name)}</span>
          </Link>
        </div>
        <div className="trees">
          <p style={{
            width: this.props.percentTree + '%'
          }}>
            &nbsp;{Accounting.formatNumber(this.props.content.amount, 0, '.', ',')}&nbsp;B&auml;ume&nbsp;gepflanzt
          </p>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
