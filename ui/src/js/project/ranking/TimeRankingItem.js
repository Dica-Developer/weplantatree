import axios from 'axios';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import Accounting from 'accounting';
import moment from 'moment';
import Boostrap from 'bootstrap';

require("./rankingItem.less");

export default class TimeRankingItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let imageUrl = 'http://localhost:8081/' + this.props.imageFolder + '/image/' + this.props.content.treeTypeImageName + '/60/60';
    return (
      <div className="rankingItem">
        <img className="ranking-img" src={imageUrl} title={this.props.content.treeTypeName} alt={this.props.content.treeTypeName}/>
        <div className="rankingSummary">
          <p >
            <Link to={`/user/` + this.props.content.name}>
              <span className="name">{this.props.content.name}</span>
            </Link><br/>
            <span className="stats">B&auml;ume gepflant:&nbsp;{this.props.content.amount}</span><br/>
            <span className="stats">Datum:</span>
            <span className="stats">{moment(this.props.content.plantedOn).format("DD.MM.YYYY")}</span>
          </p>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */