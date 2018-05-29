import React, {Component} from 'react';
import {render} from 'react-dom';
import Boostrap from 'bootstrap';
import axios from 'axios';
import Accounting from 'accounting';
import {Link, browserHistory} from 'react-router';

import SvgButton from '../common/components/SvgButton';
import IconButton from '../common/components/IconButton';

require('./bottomPart.less');

export default class BottomPart extends Component {

  switchToOfferProjectPage() {
    browserHistory.push('/projectOffer');
  }


  render() {
    return (
      <div className="bottomPart">
        <div className="button-and-price">
          <div className="price">
            <span>GESAMT:&nbsp;{Accounting.formatNumber(this.props.overallPrice / 100, 2, '.', ',')}&nbsp;€</span>
          </div>
          <div className="plantBagButton">
            <SvgButton text="AB IN MEINEN<br/>PFLANZKORB" buttonType="barrow" onClick={this.props.updatePlantBag.bind(this)} />
          </div>
        </div>
        <div className="line">Dir stehen Flächen zur Verfügung und Du hast Interesse daran, dass I Plant a Tree diese bepflanzt?
          Hier kannst Du ein
        </div>
        <div className="iconButtonWrapper">
          <IconButton className="iconButton" glyphIcon="glyphicon-forward" text="Projekt anbieten" onClick={this.switchToOfferProjectPage.bind(this)}/>
        </div>
      </div>
    );
  }
}

/* vim: set softtabstop=2:shiftwidth=2:expandtab */
